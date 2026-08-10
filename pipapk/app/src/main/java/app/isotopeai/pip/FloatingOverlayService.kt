package app.isotopeai.pip

import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.view.Choreographer
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Floating "display over other apps" card (requires SYSTEM_ALERT_WINDOW).
 * A draggable mini version of the PiP card rendered above every app.
 *
 * Reuses StateHub as its single data source (poller lives in PipBridgeService),
 * renders with its own 10ms Choreographer ticker, and sends actions through
 * PipBridgeService.postAction(). Overlay permission is requested by PipActivity;
 * this service refuses to start without it.
 */
class FloatingOverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var cardView: View? = null
    private var layoutParams: WindowManager.LayoutParams? = null

    private var lastState: PipState? = null
    private var serverUp = false
    private var tickerRunning = false
    private var dragging = false

    // Views
    private var strip: View? = null
    private var heading: TextView? = null
    private var timerText: TextView? = null
    private var statusDot: TextView? = null
    private var statusText: TextView? = null
    private var focusChip: TextView? = null
    private var attempted: TextView? = null
    private var targetButton: Button? = null
    private var correctBtn: Button? = null
    private var incorrectBtn: Button? = null
    private var skippedBtn: Button? = null
    private var undoBtn: Button? = null
    private var questionRow: LinearLayout? = null

    private val ticker = object : Choreographer.FrameCallback {
        override fun doFrame(frameTimeNanos: Long) {
            render()
            Choreographer.getInstance().postFrameCallback(this)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return
        }
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        addOverlay()
        startTicker()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }
        return START_STICKY
    }

    override fun onDestroy() {
        stopTicker()
        cardView?.let { runCatching { windowManager?.removeView(it) } }
        cardView = null
        super.onDestroy()
    }

    // ───────────────────────── Overlay construction ────────────────────────

    private fun dp(v: Int): Int = Math.round(v * resources.displayMetrics.density)

    private fun addOverlay() {
        val width = Math.min(resources.displayMetrics.widthPixels, dp(340))
        val card = buildCard(width)
        cardView = card

        val gravity = Gravity.TOP or Gravity.START
        val x = resources.displayMetrics.widthPixels - width - dp(16)
        val y = dp(80)

        layoutParams = WindowManager.LayoutParams(
            width,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            android.graphics.PixelFormat.TRANSLUCENT
        ).apply {
            this.gravity = gravity
            this.x = x
            this.y = y
        }

        try {
            windowManager?.addView(card, layoutParams)
            makeDraggable(card)
        } catch (e: Exception) {
            stopSelf()
        }
    }

    private fun buildCard(width: Int): View {
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.background = roundedCard()
        root.gravity = Gravity.CENTER_HORIZONTAL
        root.setPadding(0, 0, 0, dp(12))
        root.isClickable = true
        root.isFocusable = true

        // Progress strip
        strip = View(this).apply {
            setScaleX(0f)
            setPivotX(0f)
            background = GradientDrawable().apply { setColor(Colors.BRAND_500) }
        }
        root.addView(strip, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(4)))

        // Header row: heading + expand + close
        val header = LinearLayout(this)
        header.orientation = LinearLayout.HORIZONTAL
        header.gravity = Gravity.CENTER_VERTICAL
        header.setPadding(dp(12), dp(8), dp(8), 0)
        heading = TextView(this).apply {
            textSize = 10f
            typeface = Typeface.DEFAULT_BOLD
            letterSpacing = 0.08f
            setTextColor(Color.rgb(161, 161, 170))
            text = "ISOTOPE FLOATING"
        }
        header.addView(heading, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        header.addView(iconBtn("↗") { openActivity() })
        header.addView(iconBtn("×") { stopSelf() })
        root.addView(header)

        // Focus chip
        focusChip = TextView(this).apply {
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(4), dp(12), dp(4))
            setTextColor(Color.rgb(196, 181, 253))
            background = pill(Color.argb(30, 139, 92, 246), Color.argb(50, 139, 92, 246))
        }
        val chipLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        chipLp.gravity = Gravity.CENTER_HORIZONTAL
        chipLp.topMargin = dp(6)
        root.addView(focusChip, chipLp)

        // Timer
        timerText = TextView(this).apply {
            textSize = 36f
            typeface = Typeface.MONOSPACE
            gravity = Gravity.CENTER
            includeFontPadding = false
            setTextColor(Color.WHITE)
        }
        val timerLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        timerLp.topMargin = dp(2)
        root.addView(timerText, timerLp)

        // Status row
        val statusRow = LinearLayout(this)
        statusRow.orientation = LinearLayout.HORIZONTAL
        statusRow.gravity = Gravity.CENTER
        statusDot = TextView(this).apply { textSize = 10f }
        statusText = TextView(this).apply {
            textSize = 10f
            letterSpacing = 0.05f
            setTextColor(Color.rgb(161, 161, 170))
        }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)
        root.addView(statusRow)

        // Question tracking section
        val qr = LinearLayout(this)
        qr.orientation = LinearLayout.VERTICAL
        questionRow = qr

        val attemptRow = LinearLayout(this)
        attemptRow.orientation = LinearLayout.HORIZONTAL
        attemptRow.gravity = Gravity.CENTER_VERTICAL
        attemptRow.setPadding(dp(12), dp(8), dp(12), 0)
        attempted = TextView(this).apply {
            textSize = 20f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
        }
        attemptRow.addView(attempted, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        targetButton = pillBtn("Target") { PipBridgeService.postAction("setTarget", 0) }
        attemptRow.addView(targetButton)
        qr.addView(attemptRow)

        val resultRow = LinearLayout(this)
        resultRow.orientation = LinearLayout.HORIZONTAL
        resultRow.gravity = Gravity.CENTER
        resultRow.setPadding(dp(12), dp(6), dp(12), 0)
        correctBtn = resultBtn("✓") { PipBridgeService.postAction("correct", -1) }
        incorrectBtn = resultBtn("✕") { PipBridgeService.postAction("incorrect", -1) }
        skippedBtn = resultBtn("↷") { PipBridgeService.postAction("skipped", -1) }
        resultRow.addView(correctBtn, weightParams(1f, 0, dp(6)))
        resultRow.addView(incorrectBtn, weightParams(1f, 0, dp(6)))
        resultRow.addView(skippedBtn, weightParams(1f, 0, 0))
        qr.addView(resultRow)

        undoBtn = Button(this).apply {
            text = "Undo last"
            isAllCaps = false
            textSize = 11f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(161, 161, 170))
            background = pill(Color.TRANSPARENT, Color.argb(36, 255, 255, 255))
            setOnClickListener { PipBridgeService.postAction("undo", -1) }
        }
        val undoLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(34))
        undoLp.setMargins(dp(12), dp(6), dp(12), 0)
        qr.addView(undoBtn, undoLp)

        root.addView(qr)

        return root
    }

    private fun weightParams(weight: Float, leftMargin: Int, rightMargin: Int): LinearLayout.LayoutParams {
        val lp = LinearLayout.LayoutParams(0, dp(40), weight)
        lp.setMargins(leftMargin, 0, rightMargin, 0)
        return lp
    }

    private fun iconBtn(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 14f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.rgb(161, 161, 170))
        background = pill(Color.argb(15, 255, 255, 255), Color.TRANSPARENT)
        setPadding(dp(8), 0, dp(8), 0)
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(dp(36), dp(28))
    }

    private fun pillBtn(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 11f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        background = pill(Colors.BRAND_500, Color.TRANSPARENT)
        setPadding(dp(10), 0, dp(10), 0)
        setOnClickListener { onClick() }
    }

    private fun resultBtn(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        background = pill(Color.rgb(30, 30, 34), Color.TRANSPARENT)
        setOnClickListener { onClick() }
    }

    private fun pill(bg: Int, stroke: Int) = GradientDrawable().apply {
        setColor(bg)
        cornerRadius = dp(14).toFloat()
        if (stroke != Color.TRANSPARENT) setStroke(dp(1), stroke)
    }

    private fun roundedCard() = GradientDrawable().apply {
        setColor(Color.rgb(14, 14, 17))
        cornerRadius = dp(20).toFloat()
        setStroke(dp(1), Color.argb(25, 255, 255, 255))
    }

    private fun makeDraggable(view: View) {
        view.setOnTouchListener { _, event ->
            val params = layoutParams ?: return@setOnTouchListener false
            val initialRawX = event.rawX
            val initialRawY = event.rawY
            var initialX = params.x.toFloat()
            var initialY = params.y.toFloat()
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    dragging = false
                    view.tag = floatArrayOf(initialRawX, initialRawY, initialX, initialY)
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val start = view.tag as FloatArray
                    val dx = event.rawX - start[0]
                    val dy = event.rawY - start[1]
                    if (Math.abs(dx) > dp(4) || Math.abs(dy) > dp(4)) dragging = true
                    if (dragging) {
                        params.x = (start[2] + dx).toInt().coerceIn(-dp(80), resources.displayMetrics.widthPixels - dp(40))
                        params.y = (start[3] + dy).toInt().coerceIn(dp(20), resources.displayMetrics.heightPixels - dp(120))
                        runCatching { windowManager?.updateViewLayout(view, params) }
                    }
                    true
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    if (dragging) view.performClick()
                    true
                }
                else -> false
            }
        }
    }

    private fun openActivity() {
        startActivity(Intent(this, PipActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    // ───────────────────────── Rendering ───────────────────────────────────

    private fun startTicker() {
        if (!tickerRunning) {
            tickerRunning = true
            Choreographer.getInstance().postFrameCallback(ticker)
        }
    }

    private fun stopTicker() {
        tickerRunning = false
        runCatching { Choreographer.getInstance().removeFrameCallback(ticker) }
    }

    private fun render() {
        val st = StateHub.lastState
        if (st == null) {
            timerText?.text = "--:--"
            statusText?.text = if (serverUp) "Loading…" else "Server offline"
            return
        }
        lastState = st
        serverUp = StateHub.serverUp
        val root = cardView ?: return
        val isBreak = st.isBreak

        strip?.setScaleX(
            when {
                st.mode == "stopwatch" -> (st.secondsNow() % (25 * 60)).toFloat() / (25 * 60)
                st.totalSeconds > 0 -> (st.secondsNow().toFloat() / st.totalSeconds).coerceIn(0f, 1f)
                else -> 0f
            }
        )
        (strip?.background as? GradientDrawable)?.setColor(if (isBreak) Colors.SKY_400 else Colors.BRAND_500)

        heading?.text = when {
            st.mode == "stopwatch" -> "STOPWATCH"
            st.pomodoroCycle > 0 -> "POMODORO  ${st.pomodoroCycle} / ${st.pomodoroSessionsUntilLongBreak}"
            else -> "POMODORO"
        }

        timerText?.text = PipState.formatSeconds(st.secondsNow())

        val (dotColor, label) = when {
            !serverUp -> Colors.ZINC_500 to "Server offline"
            st.timerState == "running" -> Colors.EMERALD_500 to "FOCUSING"
            st.timerState == "paused" -> Colors.AMBER_500 to "PAUSED"
            isBreak -> Colors.BLUE_500 to "BREAK"
            else -> Colors.ZINC_500 to "IDLE"
        }
        statusDot?.setTextColor(dotColor)
        statusDot?.text = "● "
        statusText?.text = label

        focusChip?.text = buildString {
            if (st.focusTypeIcon.isNotEmpty()) append(st.focusTypeIcon).append("  ")
            append(st.focusTypeLabel.ifEmpty { "Focus" })
        }

        questionRow?.visibility = if (st.showQuestionControls) View.VISIBLE else View.GONE
        attempted?.text = buildString {
            append(st.questionsAttempted)
            if (st.targetQuestions > 0) append(" / ").append(st.targetQuestions)
        }
        correctBtn?.text = "✓  ${st.questionsCorrect}"
        incorrectBtn?.text = "✕  ${st.questionsIncorrect}"
        skippedBtn?.text = "↷  ${st.questionsSkipped}"
        undoBtn?.isEnabled = st.undoAvailable
        undoBtn?.alpha = if (st.undoAvailable) 1f else 0.4f

        // Theme toggle on the card background is skipped; floating card stays dark.
        root.invalidate()
    }
}