package app.isotopeai.pip

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import android.provider.Settings
import android.text.InputType
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * IsotopeAI Floating Timer overlay service — native port of the "pip-like" card
 * from isotope-apk (FloatingTimerService.java), wired to the REAL focus timer.
 *
 * State source: the localhost isotope server. GET /api/pip/state returns the
 * live snapshot relayed by the real /focus page (every pixel on the card is the
 * actual timer state); an SSE subscription (GET /__pip/events) signals when the
 * page applies changes; buttons POST to /api/pip/action, which is fanned out
 * over SSE so the page itself records the result on the REAL store (correct /
 * incorrect / skipped / undo / setTarget).
 *
 * Visual design mirrors the web Focus page: zinc-950 dark / white light card,
 * 24dp corners, brand-violet progress strip, 56sp monospace timer, status dot,
 * focus chip and rounded result buttons — identical to isotope-apk's card.
 */
class FloatingTimerService : Service() {

    companion object {
        const val ACTION_START  = "in.isotopeai.pip.action.FLOATING_TIMER_START"
        const val ACTION_UPDATE = "in.isotopeai.pip.action.FLOATING_TIMER_UPDATE"
        const val ACTION_STOP   = "in.isotopeai.pip.action.FLOATING_TIMER_STOP"
        const val EXTRA_STATE_JSON = "state_json"

        const val STATE_URL   = "http://127.0.0.1:3000/api/pip/state"
        const val EVENTS_URL  = "http://127.0.0.1:3000/__pip/events"
        const val ACTION_URL  = "http://127.0.0.1:3000/api/pip/action"

        private const val PREFS_FLOATING_TIMER = "floating_timer"
        private const val PREF_X = "overlay_x"
        private const val PREF_Y = "overlay_y"
        private const val PREF_WIDTH = "overlay_width"
        private const val PREF_HEIGHT = "overlay_height"

        private const val NOTIFICATION_ID = 4107
        private const val CHANNEL_ID = "isotope-floating-timer"
    }

    // Brand / semantic colors — match isotope-code CSS variables
    private val BRAND_500   = Color.rgb(139,  92, 246) // violet-500
    private val BRAND_600   = Color.rgb(124,  58, 237) // violet-600
    private val EMERALD_600 = Color.rgb(  5, 150, 105) // correct
    private val ROSE_600    = Color.rgb(225,  29,  72) // incorrect
    private val AMBER_600   = Color.rgb(217, 119,   6) // skip / paused
    private val SKY_400     = Color.rgb( 56, 189, 248) // break

    private val handler = Handler(Looper.getMainLooper())
    private val io = Executors.newSingleThreadExecutor()

    private var windowManager: WindowManager? = null
    private var layoutParams: WindowManager.LayoutParams? = null
    private var rootView: View? = null
    private var cardView: LinearLayout? = null          // outermost card (no padding)
    private var contentView: LinearLayout? = null        // padded inner container
    private var questionSection: LinearLayout? = null
    private var targetEditorRow: LinearLayout? = null
    private var progressFill: View? = null               // brand-colored progress strip fill
    private var progressContainer: FrameLayout? = null   // full-width strip container
    private var headingText: TextView? = null
    private var timerText: TextView? = null
    private var statusDot: TextView? = null
    private var statusText: TextView? = null
    private var focusTypeText: TextView? = null
    private var attemptedText: TextView? = null
    private var targetValueText: TextView? = null
    private var expandButton: Button? = null
    private var closeButton: Button? = null
    private var correctButton: Button? = null
    private var incorrectButton: Button? = null
    private var skippedButton: Button? = null
    private var undoButton: Button? = null
    private var targetButton: Button? = null

    private var state = TimerState()
    private var foregroundStarted = false
    private var dragging = false
    private var resizing = false
    private var touchStartX = 0f
    private var touchStartY = 0f
    private var windowStartX = 0
    private var windowStartY = 0
    private var resizeStartWidth = 0
    private var resizeStartHeight = 0

    @Volatile private var sseRunning = true
    private var lastSeq = -1L
    private var lastFetchMs = 0L

    private val tickRunnable = object : Runnable {
        override fun run() {
            if (!state.isActive()) { stopSelf(); return }
            renderDynamicFields()
            val now = SystemClock.elapsedRealtime()
            if (now - lastFetchMs > 1000) refreshState("tick")
            handler.postDelayed(this, 500)
        }
    }

    // ─────────────────────────── Lifecycle ───────────────────────────────────

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_UPDATE
        if (action == ACTION_STOP) { stopSelf(); return START_NOT_STICKY }

        val stateJson = intent?.getStringExtra(EXTRA_STATE_JSON)
        val nextState = TimerState.fromJson(stateJson)
        if (!nextState.isActive()) { stopSelf(); return START_NOT_STICKY }
        state = nextState

        if (!hasOverlayPermission()) { stopSelf(); return START_NOT_STICKY }

        ensureForeground()
        ensureOverlay()
        renderAll()
        handler.removeCallbacks(tickRunnable)
        handler.post(tickRunnable)
        startSseLoop()
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        sseRunning = false
        handler.removeCallbacksAndMessages(null)
        io.execute { /* drain pending */ }
        removeOverlay()
        foregroundStarted = false
        super.onDestroy()
    }

    // ─────────────────────────── Foreground / overlay setup ──────────────────

    private fun hasOverlayPermission(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)

    private fun ensureForeground() {
        if (foregroundStarted) return
        startForeground(NOTIFICATION_ID, buildNotification())
        foregroundStarted = true
    }

    private fun buildNotification(): Notification {
        val openIntent = Intent(this, PipActivity::class.java)
            .addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        val contentIntent = PendingIntent.getActivity(
            this, 4108, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            Notification.Builder(this, CHANNEL_ID) else Notification.Builder(this)
        return builder
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Focus Timer")
            .setContentText("Isotope focus session is running")
            .setContentIntent(contentIntent)
            .setOngoing(true)
            .setShowWhen(false)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val ch = NotificationChannel(
            CHANNEL_ID, "Floating Timer", NotificationManager.IMPORTANCE_LOW)
        ch.description = "Keeps the Isotope Floating Timer active."
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        nm.createNotificationChannel(ch)
    }

    private fun ensureOverlay() {
        if (rootView != null) return
        buildOverlayView()
        val prefs = getSharedPreferences(PREFS_FLOATING_TIMER, MODE_PRIVATE)
        layoutParams = WindowManager.LayoutParams(
            clampOverlayWidth(prefs.getInt(PREF_WIDTH, dp(300))),
            clampOverlayHeight(prefs.getInt(PREF_HEIGHT, dp(340))),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = prefs.getInt(PREF_X, dp(18))
            y = prefs.getInt(PREF_Y, dp(72))
        }
        try {
            windowManager?.addView(rootView, layoutParams)
        } catch (e: Exception) {
            rootView = null
            stopSelf()
        }
    }

    private fun removeOverlay() {
        rootView?.let { view ->
            try { windowManager?.removeView(view) } catch (ignored: Exception) {}
        }
        rootView = null
    }

    // ─────────────────────────── View construction ───────────────────────────

    private fun buildOverlayView() {
        // Root transparent frame — drag target
        val root = FrameLayout(this)
        root.setBackgroundColor(Color.TRANSPARENT)

        // ── Card (outermost, no padding — progress bar must be edge-to-edge) ─
        val card = LinearLayout(this)
        card.orientation = LinearLayout.VERTICAL
        card.setOnTouchListener { _, event -> handleDragTouch(event) }

        // ── Progress strip container (full width, 4dp tall) ──────────────────
        val progressFrame = FrameLayout(this)
        progressFrame.setBackgroundColor(Color.argb(13, 139, 92, 246)) // brand/5

        // fill (scales from left)
        val fill = View(this)
        fill.scaleX = 0f
        fill.pivotX = 0f
        fill.pivotY = 0f
        fill.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT)
        progressFrame.addView(fill)

        card.addView(progressFrame,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(4)))

        // ── Padded content ───────────────────────────────────────────────────
        val content = LinearLayout(this)
        content.orientation = LinearLayout.VERTICAL
        content.setPadding(dp(16), dp(12), dp(16), dp(16))

        // Header row: heading  [expand] [close]
        val header = LinearLayout(this)
        header.orientation = LinearLayout.HORIZONTAL
        header.gravity = Gravity.CENTER_VERTICAL

        val heading = makeText(11, true).apply {
            letterSpacing = 0.08f
            isAllCaps = true
        }
        header.addView(heading,
            LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        val expandBtn = makeIconButton("\u2197") {
            dispatchAction("expand", -1)
            openPipActivity()
            stopSelf()
        }
        val closeBtn = makeIconButton("\u00d7") {
            dispatchAction("close", -1)
            stopSelf()
        }
        header.addView(expandBtn)
        header.addView(closeBtn)

        // Focus type chip: icon + label inside a pill
        val chip = makeText(13, true).apply {
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(5), dp(12), dp(5))
        }
        val chipParams =
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
                gravity = Gravity.CENTER_HORIZONTAL
                topMargin = dp(6)
                bottomMargin = dp(4)
            }

        // Timer text — large, monospace, centered
        val timer = makeText(56, true).apply {
            gravity = Gravity.CENTER
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            letterSpacing = -0.02f
        }
        val timerParams =
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(2)
                bottomMargin = dp(4)
            }

        // Status row: ● Focusing...
        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val dot = makeText(10, true)
        val status = makeText(11, false).apply {
            letterSpacing = 0.05f
            isAllCaps = true
        }
        statusRow.addView(dot)
        statusRow.addView(status)

        // ── Question tracking section ─────────────────────────────────────────
        val questionSection = LinearLayout(this)
        questionSection.orientation = LinearLayout.VERTICAL
        val qsParams =
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(10)
            }

        // Attempts row
        val attemptRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            orientation = LinearLayout.HORIZONTAL
        }
        val attempted = makeText(26, true)
        val targetBtn = makePillButton("Target").apply {
            setOnClickListener { showTargetDialog() }
        }
        attemptRow.addView(attempted,
            LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetBtn)

        // Target quick-editor
        val targetValue = makeText(12, false)
        val editorRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER
            orientation = LinearLayout.HORIZONTAL
        }
        val minus = makePillButton("\u22125").apply { setOnClickListener { updateTargetBy(-5) } }
        val plus = makePillButton("+5").apply { setOnClickListener { updateTargetBy(5) } }
        val zero = makePillButton("0").apply { setOnClickListener { setTarget(0) } }
        editorRow.addView(minus)
        editorRow.addView(targetValue)
        editorRow.addView(plus)
        editorRow.addView(zero)
        editorRow.visibility = View.GONE

        // Result buttons: Correct / Incorrect / Skip — rounded-2xl style
        val resultRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val rrParams =
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(6)
            }

        val correct = makeResultButton("\u2713").apply { setOnClickListener { dispatchAction("correct", -1) } }
        val incorrect = makeResultButton("\u2715").apply { setOnClickListener { dispatchAction("incorrect", -1) } }
        val skipped = makeResultButton("\u21b7").apply { setOnClickListener { dispatchAction("skipped", -1) } }

        val btnH = dp(44)
        val gap = dp(6)
        val bpL = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpM = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpR = LinearLayout.LayoutParams(0, btnH, 1f)
        resultRow.addView(correct, bpL)
        resultRow.addView(incorrect, bpM)
        resultRow.addView(skipped, bpR)

        // Undo button
        val undo = makePillButton("Undo last").apply {
            setOnClickListener { dispatchAction("undo", -1) }
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(36)).apply {
                topMargin = dp(6)
            }
        }

        questionSection.addView(attemptRow)
        questionSection.addView(editorRow)
        questionSection.addView(resultRow, rrParams)
        questionSection.addView(undo)

        // Assemble content
        content.addView(header)
        content.addView(chip, chipParams)
        content.addView(timer, timerParams)
        content.addView(statusRow)
        content.addView(questionSection, qsParams)

        card.addView(content,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

        root.addView(card,
            FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))

        // Resize handle (bottom-right)
        val resizeHandle = makeText(16, true).apply {
            text = "\u25e2"
            gravity = Gravity.CENTER
            setTextColor(Color.argb(60, 255, 255, 255))
            setOnTouchListener { _, event -> handleResizeTouch(event) }
        }
        root.addView(resizeHandle,
            FrameLayout.LayoutParams(dp(36), dp(36), Gravity.BOTTOM or Gravity.RIGHT))

        cardView = card
        contentView = content
        progressContainer = progressFrame
        progressFill = fill
        headingText = heading
        timerText = timer
        statusDot = dot
        statusText = status
        focusTypeText = chip
        attemptedText = attempted
        targetValueText = targetValue
        targetEditorRow = editorRow
        this.questionSection = questionSection
        expandButton = expandBtn
        closeButton = closeBtn
        correctButton = correct
        incorrectButton = incorrect
        skippedButton = skipped
        undoButton = undo
        targetButton = targetBtn
        rootView = root
    }

    // ─────────────────────────── Rendering ───────────────────────────────────

    private fun renderAll() {
        val card = cardView ?: return

        val dark = state.theme == "dark"
        val isBreak = state.timerState == "break" || state.activePhase == "break"

        // Semantic colors
        val cardBgColor = if (dark) Color.rgb(14, 14, 17) else Color.WHITE // zinc-950 / white
        val textColor = if (dark) Color.WHITE else Color.rgb(24, 24, 27)   // white / zinc-900
        val mutedColor = if (dark) Color.rgb(161, 161, 170)                 // zinc-400
                         else Color.rgb(113, 113, 122)                      // zinc-500
        val borderAlpha = if (dark) 25 else 30 // white/10 dark, zinc/12 light
        val borderColor = if (dark) Color.argb(borderAlpha, 255, 255, 255)
                          else Color.argb(borderAlpha, 24, 24, 27)

        // ── Card background + border ─────────────────────────────────────────
        GradientDrawable().apply {
            setColor(cardBgColor)
            cornerRadius = dp(24).toFloat()
            setStroke(dp(1), borderColor)
        }.let { card.background = it }

        // ── Progress strip color ─────────────────────────────────────────────
        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.let { fill ->
            GradientDrawable().apply { setColor(stripColor) }.let { fill.background = it }
        }

        // Progress container top-corners must match card to avoid visible overhang
        progressContainer?.let { pc ->
            GradientDrawable().apply {
                setColor(if (dark) Color.argb(20, 139, 92, 246) else Color.argb(12, 139, 92, 246))
                cornerRadii = floatArrayOf(dp(24).toFloat(), dp(24).toFloat(), dp(24).toFloat(), dp(24).toFloat(), 0f, 0f, 0f, 0f)
            }.let { pc.background = it }
        }

        // ── Focus type chip ──────────────────────────────────────────────────
        focusTypeText?.let { chip ->
            chip.background = GradientDrawable().apply {
                setColor(if (dark) Color.argb(30, 139, 92, 246) else Color.argb(18, 139, 92, 246))
                cornerRadius = dp(999).toFloat()
                setStroke(dp(1), if (dark) Color.argb(50, 139, 92, 246) else Color.argb(35, 139, 92, 246))
            }
            chip.setTextColor(if (dark) Color.rgb(196, 181, 253) else Color.rgb(109, 40, 217)) // brand-300 / brand-700
        }

        // ── Text colors ──────────────────────────────────────────────────────
        headingText?.setTextColor(mutedColor)
        timerText?.setTextColor(textColor)
        statusText?.setTextColor(mutedColor)
        attemptedText?.setTextColor(textColor)
        targetValueText?.setTextColor(mutedColor)

        // ── Expand button (brand accent) ─────────────────────────────────────
        expandButton?.let { expand ->
            expand.background = GradientDrawable().apply {
                setColor(if (dark) Color.argb(30, 139, 92, 246) else Color.argb(15, 139, 92, 246))
                cornerRadius = dp(10).toFloat()
            }
            expand.setTextColor(BRAND_500)
        }

        // ── Close button (subtle) ────────────────────────────────────────────
        closeButton?.let { close ->
            close.background = GradientDrawable().apply {
                setColor(if (dark) Color.argb(15, 255, 255, 255) else Color.argb(8, 24, 24, 27))
                cornerRadius = dp(10).toFloat()
            }
            close.setTextColor(mutedColor)
        }

        // ── Target / question-section buttons ────────────────────────────────
        val targetBg = if (dark) Color.argb(20, 255, 255, 255) else Color.argb(10, 24, 24, 27)
        val targetBorder = if (dark) Color.argb(45, 255, 255, 255) else Color.argb(30, 24, 24, 27)
        targetButton?.let { styleButton(it, targetBg, textColor, targetBorder) }
        correctButton?.let { styleButton(it, EMERALD_600, Color.WHITE, Color.TRANSPARENT) }
        incorrectButton?.let { styleButton(it, ROSE_600, Color.WHITE, Color.TRANSPARENT) }
        skippedButton?.let { styleButton(it, AMBER_600, Color.WHITE, Color.TRANSPARENT) }
        undoButton?.let {
            styleButton(it, Color.TRANSPARENT, mutedColor,
                if (dark) Color.argb(36, 255, 255, 255) else Color.argb(36, 24, 24, 27))
        }

        renderDynamicFields()
    }

    private fun renderDynamicFields() {
        val timer = timerText ?: return

        val isBreak = state.timerState == "break" || state.activePhase == "break"
        val seconds = state.displaySecondsNow()

        // Timer digits
        timer.text = formatSeconds(seconds)

        // Heading: mode label + pomodoro cycle
        headingText?.text = when {
            state.mode == "stopwatch" -> "Stopwatch"
            state.pomodoroCycle > 0 && state.pomodoroSessionsUntilLongBreak > 0 ->
                "Pomodoro  ${state.pomodoroCycle} / ${state.pomodoroSessionsUntilLongBreak}"
            else -> "Pomodoro"
        }

        // Status dot + text
        statusDot?.apply {
            text = "\u25cf "
            setTextColor(state.statusColor())
        }
        statusText?.text = state.statusLabel()

        // Focus type chip
        focusTypeText?.text = state.focusTypeIcon + "  " + state.focusTypeLabel

        // Question section
        questionSection?.visibility = if (state.showQuestionControls) View.VISIBLE else View.GONE
        attemptedText?.text =
            state.questionsAttempted.toString() +
            (if (state.targetQuestions > 0) " / ${state.targetQuestions}" else "")
        targetValueText?.text = "  Target ${state.targetQuestions}  "
        correctButton?.text = "\u2713  ${state.questionsCorrect}"
        incorrectButton?.text = "\u2715  ${state.questionsIncorrect}"
        skippedButton?.text = "\u21b7  ${state.questionsSkipped}"
        undoButton?.let { undo ->
            undo.isEnabled = state.undoAvailable
            undo.alpha = if (state.undoAvailable) 1f else 0.4f
        }

        // Progress strip — fraction of time remaining
        progressFill?.let { fill ->
            val ratio = when {
                state.mode == "stopwatch" -> {
                    // Stopwatch: fill grows — cap at a rolling 25-min cycle
                    val cycleLen = 25 * 60
                    Math.min(1f, (seconds % cycleLen).toFloat() / cycleLen)
                }
                state.totalSeconds > 0 -> // Countdown: fraction of time remaining
                    Math.max(0f, Math.min(1f, seconds.toFloat() / state.totalSeconds))
                else -> 0f
            }
            fill.post { fill.scaleX = ratio }
        }

        if (!state.isActive()) stopSelf()
    }

    // ─────────────────────────── Server wiring ───────────────────────────────

    /** Background: pull the latest snapshot; render on the main thread if seq changed. */
    private fun refreshState(reason: String) {
        lastFetchMs = SystemClock.elapsedRealtime()
        io.execute {
            try {
                val url = URL(STATE_URL)
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                val json = conn.inputStream.bufferedReader().use { it.readText() }
                val parsed = JSONObject(json)
                val seq = parsed.optLong("seq", -1)
                handler.post {
                    if (seq != lastSeq) {
                        lastSeq = seq
                        state = TimerState.fromJson(parsed.toString())
                        renderAll()
                    }
                }
            } catch (ignored: Exception) {
            }
        }
    }

    /** Long-lived SSE reader: server → page action envelopes + heartbeats. */
    private fun startSseLoop() {
        sseRunning = true
        Thread {
            while (sseRunning) {
                try {
                    val url = URL(EVENTS_URL)
                    val conn = url.openConnection() as HttpURLConnection
                    conn.connectTimeout = 3000
                    conn.readTimeout = 60000
                    val reader = BufferedReader(InputStreamReader(conn.inputStream))
                    while (sseRunning) {
                        val line = reader.readLine() ?: break
                        if (line.trim().startsWith("data:")) {
                            refreshState("sse")
                        }
                    }
                    reader.close()
                } catch (ignored: Exception) {
                }
                try { Thread.sleep(1000) } catch (ignored: InterruptedException) {}
            }
        }.start()
    }

    /** POST an action to the local server; the /focus page applies it to the REAL store via SSE. */
    private fun dispatchAction(type: String, value: Int) {
        io.execute {
            try {
                val body = if (type == "setTarget") "{\"type\":\"$type\",\"value\":$value}"
                           else "{\"type\":\"$type\"}"
                val url = URL(ACTION_URL)
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                conn.setRequestProperty("Content-Type", "application/json")
                conn.outputStream.use { it.write(body.toByteArray()) }
                conn.inputStream.close()
                refreshState("action")
            } catch (ignored: Exception) {
            }
        }
    }

    // ─────────────────────────── Touch handling ──────────────────────────────

    private fun handleDragTouch(event: MotionEvent): Boolean {
        val lp = layoutParams ?: return false
        val wm = windowManager ?: return false
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                dragging = false
                touchStartX = event.rawX
                touchStartY = event.rawY
                windowStartX = lp.x
                windowStartY = lp.y
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                val dx = Math.round(event.rawX - touchStartX)
                val dy = Math.round(event.rawY - touchStartY)
                if (Math.abs(dx) > dp(3) || Math.abs(dy) > dp(3)) {
                    dragging = true
                    lp.x = windowStartX + dx
                    lp.y = Math.max(0, windowStartY + dy)
                    try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
                }
                return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (dragging) {
                    getSharedPreferences(PREFS_FLOATING_TIMER, MODE_PRIVATE).edit()
                        .putInt(PREF_X, lp.x)
                        .putInt(PREF_Y, lp.y)
                        .apply()
                }
                dragging = false
                return false
            }
            else -> return false
        }
    }

    private fun handleResizeTouch(event: MotionEvent): Boolean {
        val lp = layoutParams ?: return false
        val wm = windowManager ?: return false
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                resizing = true
                touchStartX = event.rawX
                touchStartY = event.rawY
                resizeStartWidth = lp.width
                resizeStartHeight = lp.height
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                if (!resizing) return true
                lp.width = clampOverlayWidth(resizeStartWidth + Math.round(event.rawX - touchStartX))
                lp.height = clampOverlayHeight(resizeStartHeight + Math.round(event.rawY - touchStartY))
                try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
                return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (resizing) {
                    getSharedPreferences(PREFS_FLOATING_TIMER, MODE_PRIVATE).edit()
                        .putInt(PREF_WIDTH, lp.width)
                        .putInt(PREF_HEIGHT, lp.height)
                        .apply()
                }
                resizing = false
                return true
            }
            else -> return false
        }
    }

    // ─────────────────────────── User actions ────────────────────────────────

    private fun updateTargetBy(delta: Int) {
        setTarget(Math.max(0, Math.min(9999, state.targetQuestions + delta)))
    }

    private fun showTargetDialog() {
        val input = EditText(this).apply {
            inputType = InputType.TYPE_CLASS_NUMBER
            setSingleLine(true)
            setText(if (state.targetQuestions > 0) state.targetQuestions.toString() else "")
            setSelectAllOnFocus(true)
            setPadding(dp(20), dp(12), dp(20), dp(12))
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle("Set target questions")
            .setView(input)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Set") { _, _ ->
                var v = 0
                try { v = input.text.toString().trim().toInt() } catch (ignored: Exception) {}
                setTarget(Math.max(0, Math.min(9999, v)))
            }
            .create()
        dialog.setOnShowListener {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                dialog.window?.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
            }
            input.requestFocus()
        }
        try { dialog.show() } catch (ignored: Exception) { updateTargetBy(5) }
    }

    private fun setTarget(value: Int) {
        state.targetQuestions = Math.max(0, Math.min(9999, value))
        dispatchAction("setTarget", state.targetQuestions)
        renderDynamicFields()
    }

    private fun openPipActivity() {
        startActivity(
            Intent(this, PipActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        )
    }

    // ─────────────────────────── View helpers ────────────────────────────────

    private fun makeText(sp: Int, bold: Boolean) = TextView(this).apply {
        textSize = sp.toFloat()
        includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
    }

    private fun makeIconButton(text: String, action: () -> Unit) = Button(this).apply {
        this.text = text
        isAllCaps = false
        textSize = 16f
        typeface = Typeface.DEFAULT_BOLD
        setPadding(dp(8), dp(2), dp(8), dp(2))
        setOnClickListener { action() }
        layoutParams = LinearLayout.LayoutParams(dp(36), dp(28)).apply {
            setMargins(dp(4), 0, 0, 0)
        }
    }

    private fun makeResultButton(text: String) = makePillButton(text).apply {
        textSize = 13f
    }

    private fun makePillButton(text: String) = Button(this).apply {
        this.text = text
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        setPadding(dp(10), 0, dp(10), 0)
        background = GradientDrawable().apply {
            setColor(BRAND_500)
            cornerRadius = dp(16).toFloat() // rounded-2xl
        }
    }

    private fun styleButton(button: Button, bgColor: Int, textColor: Int, strokeColor: Int) {
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(16).toFloat() // rounded-2xl — matches isotope-code control buttons
            if (strokeColor != Color.TRANSPARENT) setStroke(dp(1), strokeColor)
        }
        button.setTextColor(textColor)
    }

    // ─────────────────────────── Formatting ──────────────────────────────────

    private fun formatSeconds(totalSeconds: Int): String {
        val s = Math.max(0, totalSeconds)
        val days = s / 86400
        val hours = (s % 86400) / 3600
        val minutes = (s % 3600) / 60
        val secs = s % 60
        if (days > 0) return "$days" + "d " + hours + ":" + two(minutes) + ":" + two(secs)
        if (hours > 0) return hours.toString() + ":" + two(minutes) + ":" + two(secs)
        return minutes.toString() + ":" + two(secs)
    }

    private fun two(v: Int) = if (v < 10) "0$v" else v.toString()

    private fun dp(value: Int): Int = Math.round(value * resources.displayMetrics.density)

    private fun clampOverlayWidth(value: Int): Int {
        val config = resources.configuration.orientation
        val screenW = resources.displayMetrics.widthPixels
        val landscape = config == Configuration.ORIENTATION_LANDSCAPE
        // Landscape on tablet: cap at 36% of screen width to avoid covering content
        // Portrait/phone: cap at 440dp or screen width – 24dp
        val max = if (landscape)
            Math.max(dp(280), (screenW * 0.36f).toInt())
        else
            Math.max(dp(280), Math.min(dp(440), screenW - dp(24)))
        return Math.max(dp(240), Math.min(max, value))
    }

    private fun clampOverlayHeight(value: Int): Int {
        val screenH = resources.displayMetrics.heightPixels
        // Never exceed 70% of screen height so content remains visible behind overlay
        val max = Math.max(dp(240), (screenH * 0.70f).toInt())
        return Math.max(dp(200), Math.min(max, value))
    }

    // ─────────────────────────── TimerState ──────────────────────────────────

    private class TimerState {
        var mode = "pomodoro"
        var timerState = "idle"
        var activePhase = ""
        var completionAtMs = 0L
        var updatedAtMs = 0L
        var displayedSeconds = 0
        var totalSeconds = 0
        var pomodoroCycle = 1
        var pomodoroSessionsUntilLongBreak = 4
        var focusTypeLabel = "Focus"
        var focusTypeIcon = "\ud83d\udccc"
        var showQuestionControls = false
        var questionsAttempted = 0
        var questionsCorrect = 0
        var questionsIncorrect = 0
        var questionsSkipped = 0
        var targetQuestions = 0
        var undoAvailable = false
        var theme = "dark"

        fun isActive(): Boolean {
            if (timerState != "running" && timerState != "paused" && timerState != "break") return false
            return mode == "stopwatch" || displaySecondsNow() > 0 || timerState == "paused"
        }

        fun displaySecondsNow(): Int {
            val now = System.currentTimeMillis()
            if ((timerState == "running" || timerState == "break") && mode == "stopwatch")
                return clamp(displayedSeconds + Math.max(0L, (now - updatedAtMs) / 1000).toInt(), 0, 365 * 24 * 3600)
            if ((timerState == "running" || timerState == "break") && completionAtMs > 0)
                return clamp(Math.ceil(Math.max(0, completionAtMs - now) / 1000.0).toInt(), 0, 365 * 24 * 3600)
            return displayedSeconds
        }

        fun statusLabel(): String = when {
            timerState == "running" -> "Focusing"
            timerState == "paused" -> "Paused"
            timerState == "break" || activePhase == "break" -> "Break"
            else -> "Idle"
        }

        fun statusColor(): Int = when {
            timerState == "running" -> Color.rgb(16, 185, 129)   // emerald-500
            timerState == "paused" -> Color.rgb(245, 158, 11)    // amber-500
            timerState == "break" || activePhase == "break" -> Color.rgb(56, 189, 248) // sky-400
            else -> Color.rgb(113, 113, 122)                     // zinc-500
        }

        companion object {
            fun fromJson(json: String?): TimerState {
                val s = TimerState()
                if (json.isNullOrBlank()) return s
                return try {
                    val o = JSONObject(json)
                    s.mode = if (o.optString("mode") == "stopwatch") "stopwatch" else "pomodoro"
                    val raw = o.optString("timerState", "idle")
                    s.timerState = if (isTimerState(raw)) raw else "idle"
                    s.activePhase = o.optString("activePhase", "")
                    s.completionAtMs = Math.max(0, o.optLong("completionAtMs", 0))
                    s.updatedAtMs = Math.max(0, o.optLong("updatedAtMs", System.currentTimeMillis()))
                    s.displayedSeconds = clamp(o.optInt("displayedSeconds", 0), 0, 365 * 24 * 3600)
                    s.totalSeconds = clamp(o.optInt("totalSeconds", s.displayedSeconds), 0, 365 * 24 * 3600)
                    s.pomodoroCycle = clamp(o.optInt("pomodoroCycle", 1), 1, 999)
                    s.pomodoroSessionsUntilLongBreak = clamp(o.optInt("pomodoroSessionsUntilLongBreak", 4), 1, 99)
                    s.focusTypeLabel = cleanText(o.optString("focusTypeLabel", "Focus"), 48, "Focus")
                    s.focusTypeIcon = cleanText(o.optString("focusTypeIcon", "\ud83d\udccc"), 8, "\ud83d\udccc")
                    s.showQuestionControls = o.optBoolean("showQuestionControls", false)
                    s.questionsAttempted = clamp(o.optInt("questionsAttempted", 0), 0, 999999)
                    s.questionsCorrect = clamp(o.optInt("questionsCorrect", 0), 0, 999999)
                    s.questionsIncorrect = clamp(o.optInt("questionsIncorrect", 0), 0, 999999)
                    s.questionsSkipped = clamp(o.optInt("questionsSkipped", 0), 0, 999999)
                    s.targetQuestions = clamp(o.optInt("targetQuestions", 0), 0, 9999)
                    s.undoAvailable = o.optBoolean("undoAvailable", false)
                    s.theme = if (o.optString("theme") == "light") "light" else "dark"
                    s
                } catch (ignored: Exception) {
                    s
                }
            }

            private fun isTimerState(v: String) =
                v == "idle" || v == "running" || v == "paused" || v == "break"

            private fun clamp(value: Int, min: Int, max: Int) = Math.max(min, Math.min(max, value))

            private fun cleanText(value: String, max: Int, fallback: String): String {
                val t = value.trim()
                if (t.isEmpty()) return fallback
                return if (t.length > max) t.substring(0, max) else t
            }
        }
    }
}