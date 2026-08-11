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

class FloatingTimerService : Service() {

    companion object {
        private const val NOTIFICATION_ID = 4107
        private const val CHANNEL_ID = "isotope-floating-timer"
        private const val PREFS_NAME = "floating_timer_overlay"
        private const val PREF_X = "overlay_x"
        private const val PREF_Y = "overlay_y"
        private const val PREF_WIDTH = "overlay_width"
        private const val PREF_HEIGHT = "overlay_height"
        private const val PREF_THEME = "overlay_theme"
        private const val THEME_DARK = "dark"
        private const val THEME_GLASS = "glass"
        private const val POLL_MS = 750L
        private const val TICK_MS = 250L
    }

    private val BRAND_500 = Color.rgb(139, 92, 246)
    private val EMERALD_500 = Color.rgb(16, 185, 129)
    private val EMERALD_600 = Color.rgb(5, 150, 105)
    private val ROSE_600 = Color.rgb(225, 29, 72)
    private val AMBER_500 = Color.rgb(245, 158, 11)
    private val AMBER_600 = Color.rgb(217, 119, 6)
    private val SKY_400 = Color.rgb(56, 189, 248)

    private val handler = Handler(Looper.getMainLooper())
    private var windowManager: WindowManager? = null
    private var layoutParams: WindowManager.LayoutParams? = null
    private var rootView: View? = null
    private var cardView: LinearLayout? = null
    private var contentView: LinearLayout? = null
    private var questionSection: LinearLayout? = null
    private var targetEditorRow: LinearLayout? = null
    private var progressFill: View? = null
    private var progressContainer: FrameLayout? = null
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
    private var themeButton: Button? = null

    private var state = TimerState()
    private var foregroundStarted = false
    private var manualStart = false
    private var lastSeq = -1L
    private var dragging = false
    private var resizing = false
    private var touchStartX = 0f
    private var touchStartY = 0f
    private var windowStartX = 0
    private var windowStartY = 0
    private var resizeStartWidth = 0
    private var resizeStartHeight = 0
    private var currentTheme = THEME_DARK

    private val poll = object : Runnable {
        override fun run() {
            PipClient.fetchState(this@FloatingTimerService, handler) { s, ok, seq ->
                if (ok && seq != lastSeq) {
                    lastSeq = seq
                    state = s
                    renderAll()
                }
                if (!state.isActive() && foregroundStarted && !manualStart) {
                    handler.postDelayed({ stopSelf() }, 2000)
                }
            }
            handler.postDelayed(this, POLL_MS)
        }
    }

    private val tick = object : Runnable {
        override fun run() {
            if (state.isActive()) {
                renderDynamicFields()
            }
            handler.postDelayed(this, TICK_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        createNotificationChannel()
        currentTheme = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString(PREF_THEME, THEME_DARK) ?: THEME_DARK
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == "STOP") { stopSelf(); return START_NOT_STICKY }
        if (action == "TOGGLE_THEME") {
            currentTheme = if (currentTheme == THEME_GLASS) THEME_DARK else THEME_GLASS
            getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                .putString(PREF_THEME, currentTheme).apply()
            renderAll()
            return START_STICKY
        }

        if (!hasOverlayPermission()) { stopSelf(); return START_NOT_STICKY }

        manualStart = intent?.getBooleanExtra("MANUAL_START", false) ?: false

        ensureForeground()
        ensureOverlay()
        renderAll()
        handler.removeCallbacks(poll)
        handler.removeCallbacks(tick)
        handler.post(poll)
        handler.post(tick)
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        removeOverlay()
        foregroundStarted = false
        super.onDestroy()
    }

    private fun hasOverlayPermission(): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)
    }

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
            Notification.Builder(this, CHANNEL_ID)
        else Notification.Builder(this)
        return builder
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Focus Timer")
            .setContentText("IsotopeAI focus session is running")
            .setContentIntent(contentIntent)
            .setOngoing(true)
            .setShowWhen(false)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val ch = NotificationChannel(
            CHANNEL_ID, "Floating Timer", NotificationManager.IMPORTANCE_LOW)
        ch.description = "Keeps the IsotopeAI Floating Timer active."
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        nm?.createNotificationChannel(ch)
    }

    private fun ensureOverlay() {
        if (rootView != null) return
        buildOverlayView()
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        layoutParams = WindowManager.LayoutParams(
            clampOverlayWidth(prefs.getInt(PREF_WIDTH, dp(300))),
            clampOverlayHeight(prefs.getInt(PREF_HEIGHT, dp(340))),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT)
        layoutParams!!.gravity = Gravity.TOP or Gravity.START
        layoutParams!!.x = prefs.getInt(PREF_X, dp(18))
        layoutParams!!.y = prefs.getInt(PREF_Y, dp(72))
        try {
            windowManager?.addView(rootView, layoutParams)
        } catch (e: Exception) {
            rootView = null
            stopSelf()
        }
    }

    private fun removeOverlay() {
        if (rootView != null && windowManager != null) {
            try { windowManager?.removeView(rootView) } catch (ignored: Exception) {}
        }
        rootView = null
    }

    private fun isGlassTheme(): Boolean = currentTheme == THEME_GLASS

    private fun buildOverlayView() {
        val root = FrameLayout(this).apply { setBackgroundColor(Color.TRANSPARENT) }

        cardView = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setOnTouchListener { v, event -> handleDragTouch(v, event) }
        }

        progressContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.argb(13, 139, 92, 246))
        }
        progressFill = View(this).apply {
            scaleX = 0f
            pivotX = 0f
            pivotY = 0f
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT)
        }
        progressContainer!!.addView(progressFill)
        cardView!!.addView(progressContainer,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(4)))

        contentView = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(12), dp(16), dp(16))
        }

        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        headingText = makeText(11, true).apply { letterSpacing = 0.08f; isAllCaps = true }
        header.addView(headingText,
            LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        expandButton = makeIconButton("\u2197") {
            PipClient.postAction(this@FloatingTimerService, "expand", -1)
            val intent = Intent(this, PipActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
            startActivity(intent)
            stopSelf()
        }
        closeButton = makeIconButton("\u00d7") {
            PipClient.postAction(this@FloatingTimerService, "close", -1)
            stopSelf()
        }
        header.addView(expandButton)
        header.addView(closeButton)

        focusTypeText = makeText(13, true).apply {
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(5), dp(12), dp(5))
        }
        val chipParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin = dp(6)
            bottomMargin = dp(4)
        }

        timerText = makeText(56, true).apply {
            gravity = Gravity.CENTER
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            letterSpacing = -0.02f
        }
        val timerParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(2)
            bottomMargin = dp(4)
        }

        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        statusDot = makeText(10, true)
        statusText = makeText(11, false).apply { letterSpacing = 0.05f; isAllCaps = true }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)

        questionSection = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val qsParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(10)
        }

        val attemptRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            orientation = LinearLayout.HORIZONTAL
        }
        attemptedText = makeText(26, true)
        targetButton = makePillButton("Target").apply {
            setOnClickListener { showTargetDialog() }
        }
        attemptRow.addView(attemptedText,
            LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetButton)

        targetValueText = makeText(12, false)
        targetEditorRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER
            orientation = LinearLayout.HORIZONTAL
        }
        val minus = makePillButton("-5").apply { setOnClickListener { updateTargetBy(-5) } }
        val plus = makePillButton("+5").apply { setOnClickListener { updateTargetBy(5) } }
        val zero = makePillButton("0").apply { setOnClickListener { setTarget(0) } }
        targetEditorRow!!.addView(minus)
        targetEditorRow!!.addView(targetValueText)
        targetEditorRow!!.addView(plus)
        targetEditorRow!!.addView(zero)
        targetEditorRow!!.visibility = View.GONE

        val resultRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        correctButton = makeResultButton("\u2713").apply {
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "correct", -1) }
        }
        incorrectButton = makeResultButton("\u2715").apply {
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "incorrect", -1) }
        }
        skippedButton = makeResultButton("\u21b7").apply {
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "skipped", -1) }
        }
        val btnH = dp(44)
        val gap = dp(6)
        val bpL = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpM = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpR = LinearLayout.LayoutParams(0, btnH, 1f)
        resultRow.addView(correctButton, bpL)
        resultRow.addView(incorrectButton, bpM)
        resultRow.addView(skippedButton, bpR)

        undoButton = makePillButton("Undo last").apply {
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "undo", -1) }
        }
        val undoParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(36)).apply { topMargin = dp(6) }

        themeButton = makePillButton(if (isGlassTheme()) "\u2601 Glass" else "\u2601 Dark").apply {
            setOnClickListener {
                val intent = Intent(this@FloatingTimerService, FloatingTimerService::class.java)
                intent.action = "TOGGLE_THEME"
                startService(intent)
            }
        }
        val themeParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, dp(32)).apply {
            gravity = Gravity.END
            topMargin = dp(4)
        }

        questionSection!!.addView(attemptRow)
        questionSection!!.addView(targetEditorRow)
        questionSection!!.addView(resultRow,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(6)
            })
        questionSection!!.addView(undoButton, undoParams)

        contentView!!.addView(header)
        contentView!!.addView(focusTypeText, chipParams)
        contentView!!.addView(timerText, timerParams)
        contentView!!.addView(statusRow)
        contentView!!.addView(questionSection, qsParams)
        contentView!!.addView(themeButton, themeParams)

        cardView!!.addView(contentView,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

        root.addView(cardView,
            FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))

        // Resize handle
        val resizeHandle = makeText(16, true).apply {
            text = "\u25e2"
            gravity = Gravity.CENTER
            setOnTouchListener { v, event -> handleResizeTouch(v, event) }
        }
        root.addView(resizeHandle,
            FrameLayout.LayoutParams(dp(36), dp(36), Gravity.BOTTOM or Gravity.RIGHT))

        rootView = root
    }

    private fun renderAll() {
        val card = cardView ?: return
        val isBreak = state.timerState == "break" || state.activePhase == "break"

        if (isGlassTheme()) {
            renderGlassTheme(card, isBreak)
        } else {
            renderDarkTheme(card, isBreak)
        }

        // Resize handle adapts to theme
        val rootFrame = rootView as? FrameLayout
        rootFrame?.let {
            for (i in 0 until it.childCount) {
                val child = it.getChildAt(i)
                if (child is TextView && child.text == "\u25e2") {
                    child.setTextColor(if (isGlassTheme()) Color.argb(60, 0, 0, 0) else Color.argb(60, 255, 255, 255))
                }
            }
        }

        renderDynamicFields()
    }

    private fun renderGlassTheme(card: LinearLayout, isBreak: Boolean) {
        // iOS liquid glass: frosted translucent white with subtle depth
        card.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(120, 255, 255, 255),  // frosted white top
                Color.argb(90, 240, 240, 245))   // slightly denser bottom
            cornerRadius = dp(28).toFloat()
            setStroke(dp(1), Color.argb(60, 255, 255, 255))
            gradientType = GradientDrawable.LINEAR_GRADIENT_TO_BOTTOM
        }

        // Progress strip — vivid brand color on glass
        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply {
            setColor(stripColor)
            cornerRadius = dp(2).toFloat()
        }

        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 139, 92, 246))
            cornerRadii = floatArrayOf(
                dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // Focus chip — tinted glass pill
        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(40, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(50, 139, 92, 246))
        }
        focusTypeText?.setTextColor(Color.rgb(109, 40, 217))  // deep violet text

        // Text colors — dark on frosted glass (iOS style)
        val textPrimary = Color.rgb(20, 20, 25)    // near-black for timer
        val textSecondary = Color.rgb(80, 80, 95)  // muted for labels
        val textTertiary = Color.rgb(120, 120, 140) // very muted

        headingText?.setTextColor(textSecondary)
        timerText?.setTextColor(textPrimary)
        statusText?.setTextColor(textSecondary)
        attemptedText?.setTextColor(textPrimary)
        targetValueText?.setTextColor(textTertiary)

        // Expand button — frosted glass tinted
        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(35, 139, 92, 246))
            cornerRadius = dp(12).toFloat()
            setStroke(dp(1), Color.argb(30, 139, 92, 246))
        }
        expandButton?.setTextColor(Color.rgb(109, 40, 217))  // violet text

        // Close button — subtle glass
        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 0, 0, 0))
            cornerRadius = dp(12).toFloat()
            setStroke(dp(1), Color.argb(20, 0, 0, 0))
        }
        closeButton?.setTextColor(textSecondary)

        // Result buttons — glass tints with COLORED text (not white!)
        styleButtonGlass(correctButton, Color.argb(45, 5, 150, 105), Color.rgb(2, 120, 85), Color.argb(30, 5, 150, 105))
        styleButtonGlass(incorrectButton, Color.argb(45, 225, 29, 72), Color.rgb(190, 20, 60), Color.argb(30, 225, 29, 72))
        styleButtonGlass(skippedButton, Color.argb(45, 217, 119, 6), Color.rgb(180, 95, 0), Color.argb(30, 217, 119, 6))

        // Target / undo — frosted pills
        styleButtonGlass(targetButton, Color.argb(25, 0, 0, 0), textSecondary, Color.argb(25, 0, 0, 0))
        styleButtonGlass(undoButton, Color.TRANSPARENT, textTertiary, Color.argb(25, 0, 0, 0))

        // Theme toggle — glass pill
        styleButtonGlass(themeButton, Color.argb(20, 139, 92, 246), Color.rgb(109, 40, 217), Color.argb(25, 139, 92, 246))
    }

    private fun renderDarkTheme(card: LinearLayout, isBreak: Boolean) {
        card.background = GradientDrawable().apply {
            setColor(Color.rgb(14, 14, 17))
            cornerRadius = dp(24).toFloat()
            setStroke(dp(1), Color.argb(25, 255, 255, 255))
        }

        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply { setColor(stripColor) }

        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(20, 139, 92, 246))
            cornerRadii = floatArrayOf(
                dp(24).toFloat(), dp(24).toFloat(), dp(24).toFloat(), dp(24).toFloat(),
                0f, 0f, 0f, 0f)
        }

        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(50, 139, 92, 246))
        }
        focusTypeText?.setTextColor(Color.rgb(196, 181, 253))

        val mutedColor = Color.rgb(161, 161, 170)

        headingText?.setTextColor(mutedColor)
        timerText?.setTextColor(Color.WHITE)
        statusText?.setTextColor(mutedColor)
        attemptedText?.setTextColor(Color.WHITE)
        targetValueText?.setTextColor(mutedColor)

        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 139, 92, 246))
            cornerRadius = dp(10).toFloat()
        }
        expandButton?.setTextColor(BRAND_500)

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 255, 255, 255))
            cornerRadius = dp(10).toFloat()
        }
        closeButton?.setTextColor(mutedColor)

        val targetBg = Color.argb(20, 255, 255, 255)
        val targetBorder = Color.argb(45, 255, 255, 255)
        styleButton(targetButton, targetBg, Color.WHITE, targetBorder)
        styleButton(correctButton, EMERALD_600, Color.WHITE, Color.TRANSPARENT)
        styleButton(incorrectButton, ROSE_600, Color.WHITE, Color.TRANSPARENT)
        styleButton(skippedButton, AMBER_600, Color.WHITE, Color.TRANSPARENT)
        styleButton(undoButton, Color.TRANSPARENT, mutedColor, targetBorder)
    }

    private fun renderDynamicFields() {
        val timer = timerText ?: return
        val seconds = state.displaySecondsNow()

        timer.text = formatSeconds(seconds)

        val heading = when {
            state.mode == "stopwatch" -> "Stopwatch"
            state.pomodoroCycle > 0 && state.pomodoroSessionsUntilLongBreak > 0 ->
                "Pomodoro  ${state.pomodoroCycle} / ${state.pomodoroSessionsUntilLongBreak}"
            else -> "Pomodoro"
        }
        headingText?.text = heading

        statusDot?.text = "\u25cf "
        statusDot?.setTextColor(state.statusColor())
        statusText?.text = state.statusLabel()

        focusTypeText?.text = "${state.focusTypeIcon}  ${state.focusTypeLabel}"

        questionSection?.visibility = if (state.showQuestionControls) View.VISIBLE else View.GONE
        attemptedText?.text = state.questionsAttempted.toString() +
            if (state.targetQuestions > 0) " / ${state.targetQuestions}" else ""
        targetValueText?.text = "  Target ${state.targetQuestions}  "
        correctButton?.text = "\u2713  ${state.questionsCorrect}"
        incorrectButton?.text = "\u2715  ${state.questionsIncorrect}"
        skippedButton?.text = "\u21b7  ${state.questionsSkipped}"
        undoButton?.isEnabled = state.undoAvailable
        undoButton?.alpha = if (state.undoAvailable) 1f else 0.4f

        val ratio = when {
            state.mode == "stopwatch" -> {
                val cycleLen = 25 * 60
                Math.min(1f, (seconds % cycleLen).toFloat() / cycleLen)
            }
            state.totalSeconds > 0 ->
                Math.max(0f, Math.min(1f, seconds.toFloat() / state.totalSeconds))
            else -> 0f
        }
        progressFill?.post { progressFill?.scaleX = ratio }

        scaleButtonsToOverlay()
    }

    private fun scaleButtonsToOverlay() {
        val lp = layoutParams ?: return
        val overlayWidth = lp.width
        val scale = Math.max(0.7f, Math.min(1.3f, overlayWidth.toFloat() / dp(300)))

        val btnH = (dp(44) * scale).toInt()
        listOf(correctButton, incorrectButton, skippedButton).forEach { btn ->
            btn?.let {
                val params = it.layoutParams as? LinearLayout.LayoutParams
                params?.height = btnH
                it.layoutParams = params
                it.textSize = 12f * scale
            }
        }

        timerText?.textSize = 56f * scale
        headingText?.textSize = 11f * scale
        statusText?.textSize = 11f * scale
        attemptedText?.textSize = 26f * scale
    }

    private fun handleDragTouch(view: View, event: MotionEvent): Boolean {
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
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putInt(PREF_X, lp.x)
                        .putInt(PREF_Y, lp.y)
                        .apply()
                }
                dragging = false
                return false
            }
        }
        return false
    }

    private fun handleResizeTouch(view: View, event: MotionEvent): Boolean {
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
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putInt(PREF_WIDTH, lp.width)
                        .putInt(PREF_HEIGHT, lp.height)
                        .apply()
                }
                resizing = false
                return true
            }
        }
        return false
    }

    private fun updateTargetBy(delta: Int) {
        setTarget(Math.max(0, Math.min(9999, state.targetQuestions + delta)))
    }

    private fun showTargetDialog() {
        val input = EditText(this).apply {
            inputType = InputType.TYPE_CLASS_NUMBER
            isSingleLine = true
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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && dialog.window != null) {
            dialog.window!!.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
        }
        dialog.setOnShowListener {
            if (dialog.window != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                dialog.window!!.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
            }
            input.requestFocus()
        }
        try { dialog.show() } catch (ignored: Exception) { updateTargetBy(5) }
    }

    private fun setTarget(value: Int) {
        state.targetQuestions = Math.max(0, Math.min(9999, value))
        PipClient.postAction(this, "setTarget", state.targetQuestions)
        renderDynamicFields()
    }

    private fun makeText(sp: Int, bold: Boolean) = TextView(this).apply {
        textSize = sp.toFloat()
        includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
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

    private fun makeResultButton(text: String) = makePillButton(text).apply { textSize = 13f }

    private fun makePillButton(text: String) = Button(this).apply {
        this.text = text
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        setPadding(dp(10), 0, dp(10), 0)
        background = GradientDrawable().apply {
            setColor(BRAND_500)
            cornerRadius = dp(16).toFloat()
        }
    }

    private fun styleButton(button: Button?, bgColor: Int, textColor: Int, strokeColor: Int) {
        button ?: return
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(16).toFloat()
            if (strokeColor != Color.TRANSPARENT) setStroke(dp(1), strokeColor)
        }
        button.setTextColor(textColor)
    }

    private fun styleButtonGlass(button: Button?, bgColor: Int, textColor: Int, strokeColor: Int) {
        button ?: return
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(14).toFloat()
            if (strokeColor != Color.TRANSPARENT) setStroke(dp(1), strokeColor)
        }
        button.setTextColor(textColor)
    }

    private fun formatSeconds(totalSeconds: Int): String {
        val s = Math.max(0, totalSeconds)
        val days = s / 86400
        val hours = (s % 86400) / 3600
        val minutes = (s % 3600) / 60
        val secs = s % 60
        val two = { v: Int -> if (v < 10) "0$v" else v.toString() }
        if (days > 0) return "${days}d $hours:${two(minutes)}:${two(secs)}"
        if (hours > 0) return "$hours:${two(minutes)}:${two(secs)}"
        return "$minutes:${two(secs)}"
    }

    private fun dp(value: Int): Int = Math.round(value * resources.displayMetrics.density)

    private fun clampOverlayWidth(value: Int): Int {
        val config = resources.configuration.orientation
        val screenW = resources.displayMetrics.widthPixels
        val landscape = config == Configuration.ORIENTATION_LANDSCAPE
        val max = if (landscape)
            Math.max(dp(280), (screenW * 0.36f).toInt())
        else Math.max(dp(280), Math.min(dp(440), screenW - dp(24)))
        return Math.max(dp(240), Math.min(max, value))
    }

    private fun clampOverlayHeight(value: Int): Int {
        val screenH = resources.displayMetrics.heightPixels
        val max = Math.max(dp(240), (screenH * 0.70f).toInt())
        return Math.max(dp(200), Math.min(max, value))
    }
}
