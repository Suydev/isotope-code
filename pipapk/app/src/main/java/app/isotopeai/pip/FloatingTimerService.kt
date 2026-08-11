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
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Shader
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
        private const val THEME_APPLE = "apple"
        private const val POLL_MS = 750L
        private const val TICK_MS = 40L
        private const val CORNER_RADIUS_DP = 20
    }

    private val BRAND_500 = Color.rgb(139, 92, 246)
    private val EMERALD_600 = Color.rgb(5, 150, 105)
    private val ROSE_600 = Color.rgb(225, 29, 72)
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
    private var pauseResumeButton: Button? = null
    private var correctButton: Button? = null
    private var incorrectButton: Button? = null
    private var skippedButton: Button? = null
    private var undoButton: Button? = null
    private var targetButton: Button? = null
    private var themeButton: Button? = null
    private var glassEdgeTop: View? = null
    private var glassEdgeBottom: View? = null
    private var glassEdgeLeft: View? = null
    private var glassEdgeRight: View? = null
    private var glassInnerGlow: View? = null
    private var glassCornerTL: View? = null
    private var glassCornerTR: View? = null
    private var glassCornerBL: View? = null
    private var glassCornerBR: View? = null
    private var glassLightSweep: View? = null
    private var settingsRow: LinearLayout? = null

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
            renderDynamicFields()
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
            currentTheme = when (currentTheme) {
                THEME_DARK -> THEME_GLASS
                THEME_GLASS -> THEME_APPLE
                else -> THEME_DARK
            }
            getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                .putString(PREF_THEME, currentTheme).apply()
            renderAll()
            return START_STICKY
        }
        if (action == "SET_THEME") {
            currentTheme = intent.getStringExtra("THEME_VALUE") ?: THEME_DARK
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
            clampOverlayWidth(prefs.getInt(PREF_WIDTH, dp(340))),
            clampOverlayHeight(prefs.getInt(PREF_HEIGHT, dp(390))),
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

    private fun buildOverlayView() {
        val root = FrameLayout(this).apply { setBackgroundColor(Color.TRANSPARENT) }

        cardView = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setOnTouchListener { v, event -> handleDragTouch(v, event) }
        }

        // ── Content ──
        contentView = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(20), dp(18), dp(20), dp(18))
        }

        // Header row: expand + close
        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        headingText = TextView(this).apply {
            textSize = 11f
            letterSpacing = 0.08f
            isAllCaps = true
            typeface = Typeface.DEFAULT_BOLD
            includeFontPadding = false
        }
        header.addView(headingText, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        expandButton = makeIconButton("\u2197") {
            val intent = Intent(this, PipActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
                putExtra("FROM_OVERLAY", true)
            }
            startActivity(intent)
        }
        closeButton = makeIconButton("\u00d7") {
            PipClient.postAction(this@FloatingTimerService, "close", -1)
            stopSelf()
        }
        header.addView(expandButton)
        header.addView(closeButton)

        // Focus type chip
        focusTypeText = TextView(this).apply {
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            includeFontPadding = false
            setPadding(dp(14), dp(5), dp(14), dp(5))
        }
        val chipParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin = dp(10)
            bottomMargin = dp(6)
        }

        // Timer display
        timerText = TextView(this).apply {
            textSize = 56f
            gravity = Gravity.CENTER
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            letterSpacing = -0.02f
            includeFontPadding = false
        }
        val timerParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(4)
            bottomMargin = dp(8)
        }

        // Status row
        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        statusDot = TextView(this).apply {
            textSize = 10f
            typeface = Typeface.DEFAULT_BOLD
            includeFontPadding = false
        }
        statusText = TextView(this).apply {
            textSize = 11f
            letterSpacing = 0.05f
            isAllCaps = true
            typeface = Typeface.DEFAULT_BOLD
            includeFontPadding = false
        }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)

        // Pause/Resume button (large, centered — like browser PiP)
        pauseResumeButton = Button(this).apply {
            text = "\u23f8"
            isAllCaps = false
            textSize = 22f
            typeface = Typeface.DEFAULT_BOLD
            setPadding(dp(20), dp(6), dp(20), dp(6))
            setOnClickListener {
                PipClient.postAction(this@FloatingTimerService, "togglePause", -1)
            }
        }
        val pauseParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, dp(48)).apply {
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin = dp(8)
            bottomMargin = dp(4)
        }

        // Question section
        questionSection = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val qsParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(14)
        }

        // Separator line
        val separator = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(1)).apply {
                topMargin = dp(14)
                bottomMargin = dp(14)
            }
        }

        // Attempt row: counter + target button
        val attemptRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            orientation = LinearLayout.HORIZONTAL
        }
        attemptedText = TextView(this).apply {
            textSize = 26f
            typeface = Typeface.DEFAULT_BOLD
            includeFontPadding = false
        }
        targetButton = makePillButton("Target").apply {
            setOnClickListener { showTargetDialog() }
        }
        attemptRow.addView(attemptedText, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetButton)

        // Target editor row
        targetValueText = TextView(this).apply {
            textSize = 12f
            includeFontPadding = false
        }
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

        // Result buttons (3-column grid)
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
        val gap = dp(8)
        resultRow.addView(correctButton, LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) })
        resultRow.addView(incorrectButton, LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) })
        resultRow.addView(skippedButton, LinearLayout.LayoutParams(0, btnH, 1f))

        // Undo button
        undoButton = makePillButton("Undo last").apply {
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "undo", -1) }
        }
        val undoParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(38)).apply { topMargin = dp(8) }

        // Assemble question section
        questionSection!!.addView(separator)
        questionSection!!.addView(attemptRow)
        questionSection!!.addView(targetEditorRow)
        questionSection!!.addView(resultRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(8)
        })
        questionSection!!.addView(undoButton, undoParams)

        // Settings row (in-overlay customization)
        settingsRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val themeLabel = when (currentTheme) {
            THEME_APPLE -> "\u2734 Apple"
            THEME_GLASS -> "\u2601 Glass"
            else -> "\u263E Dark"
        }
        themeButton = makePillButton(themeLabel).apply {
            textSize = 11f
            setOnClickListener {
                val intent = Intent(this@FloatingTimerService, FloatingTimerService::class.java)
                intent.action = "TOGGLE_THEME"
                startService(intent)
            }
        }
        val sizeSmallBtn = makePillButton("S").apply {
            textSize = 10f
            setOnClickListener { resizeOverlay(dp(280), dp(320)) }
        }
        val sizeMedBtn = makePillButton("M").apply {
            textSize = 10f
            setOnClickListener { resizeOverlay(dp(340), dp(390)) }
        }
        val sizeLgBtn = makePillButton("L").apply {
            textSize = 10f
            setOnClickListener { resizeOverlay(dp(420), dp(480)) }
        }
        settingsRow!!.addView(themeButton, LinearLayout.LayoutParams(0, dp(28), 1f))
        settingsRow!!.addView(sizeSmallBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeMedBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeLgBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })

        // Add content to card
        contentView!!.addView(header)
        contentView!!.addView(focusTypeText, chipParams)
        contentView!!.addView(timerText, timerParams)
        contentView!!.addView(statusRow)
        contentView!!.addView(pauseResumeButton, pauseParams)
        contentView!!.addView(questionSection, qsParams)
        contentView!!.addView(settingsRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(28)).apply { topMargin = dp(10) })

        cardView!!.addView(contentView, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

        // ── Liquid Glass edge highlights ──
        val edgeThickness = dp(3)
        val cornerSize = dp(24)

        glassEdgeTop = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply {
                gravity = Gravity.TOP
            }
            visibility = View.GONE
        }
        glassEdgeBottom = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply {
                gravity = Gravity.BOTTOM
            }
            visibility = View.GONE
        }
        glassEdgeLeft = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                edgeThickness, FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.START
                topMargin = dp(20)
                bottomMargin = dp(20)
            }
            visibility = View.GONE
        }
        glassEdgeRight = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                edgeThickness, FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.END
                topMargin = dp(20)
                bottomMargin = dp(20)
            }
            visibility = View.GONE
        }
        glassInnerGlow = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, dp(40)).apply {
                gravity = Gravity.TOP
            }
            visibility = View.GONE
        }
        glassCornerTL = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply {
                gravity = Gravity.TOP or Gravity.START
            }
            visibility = View.GONE
        }
        glassCornerTR = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply {
                gravity = Gravity.TOP or Gravity.END
            }
            visibility = View.GONE
        }
        glassCornerBL = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply {
                gravity = Gravity.BOTTOM or Gravity.START
            }
            visibility = View.GONE
        }
        glassCornerBR = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply {
                gravity = Gravity.BOTTOM or Gravity.END
            }
            visibility = View.GONE
        }
        glassLightSweep = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            visibility = View.GONE
        }

        // Assemble root
        root.addView(cardView, FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        root.addView(glassEdgeTop)
        root.addView(glassEdgeBottom)
        root.addView(glassEdgeLeft)
        root.addView(glassEdgeRight)
        root.addView(glassInnerGlow)
        root.addView(glassCornerTL)
        root.addView(glassCornerTR)
        root.addView(glassCornerBL)
        root.addView(glassCornerBR)
        root.addView(glassLightSweep)

        // Resize handle
        val resizeHandle = TextView(this).apply {
            text = "\u25e2"
            textSize = 14f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            setOnTouchListener { v, event -> handleResizeTouch(v, event) }
        }
        root.addView(resizeHandle, FrameLayout.LayoutParams(dp(32), dp(32), Gravity.BOTTOM or Gravity.END))

        rootView = root
    }

    private fun renderAll() {
        val card = cardView ?: return
        val isBreak = state.timerState == "break" || state.activePhase == "break"

        currentTheme = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString(PREF_THEME, THEME_DARK) ?: THEME_DARK

        // Hide all glass effects by default
        hideGlassEffects()

        when (currentTheme) {
            THEME_APPLE -> renderAppleLiquid(card, isBreak)
            THEME_GLASS -> renderDarkGlass(card, isBreak)
            else -> renderDarkSolid(card, isBreak)
        }

        // Drop shadow
        card.elevation = when (currentTheme) {
            THEME_APPLE -> dp(12).toFloat()
            THEME_GLASS -> dp(8).toFloat()
            else -> dp(4).toFloat()
        }

        // Resize handle color
        val rootFrame = rootView as? FrameLayout
        rootFrame?.let {
            for (i in 0 until it.childCount) {
                val child = it.getChildAt(i)
                if (child is TextView && child.text == "\u25e2") {
                    child.setTextColor(when (currentTheme) {
                        THEME_APPLE -> Color.argb(70, 0, 0, 0)
                        else -> Color.argb(50, 255, 255, 255)
                    })
                }
            }
        }

        // Light sweep for Apple
        if (currentTheme == THEME_APPLE) {
            handler.postDelayed({ startLightSweep() }, 300)
        } else {
            glassLightSweep?.animate()?.cancel()
            glassLightSweep?.alpha = 0f
        }

        renderDynamicFields()
    }

    // ═══════════════════════════════════════════════════════════════
    //  DARK SOLID — matches browser PiP dark background (#050506)
    // ═══════════════════════════════════════════════════════════════
    private fun renderDarkSolid(card: LinearLayout, isBreak: Boolean) {
        card.background = GradientDrawable().apply {
            setColor(Color.rgb(5, 5, 6))
            cornerRadius = dp(CORNER_RADIUS_DP).toFloat()
        }

        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply { setColor(stripColor) }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 139, 92, 246))
        }

        // Focus chip — dark glass pill
        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 255, 255, 255))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(20, 255, 255, 255))
        }

        val textMuted = Color.rgb(161, 161, 170)
        headingText?.setTextColor(textMuted)
        timerText?.setTextColor(Color.WHITE)
        statusText?.setTextColor(textMuted)
        focusTypeText?.setTextColor(Color.rgb(196, 181, 253))
        attemptedText?.setTextColor(Color.WHITE)
        targetValueText?.setTextColor(textMuted)

        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 255, 255, 255))
            cornerRadius = dp(12).toFloat()
        }
        expandButton?.setTextColor(textMuted)

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 255, 255, 255))
            cornerRadius = dp(12).toFloat()
        }
        closeButton?.setTextColor(textMuted)

        // Pause button
        pauseResumeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 255, 255, 255))
            cornerRadius = dp(16).toFloat()
            setStroke(dp(1), Color.argb(30, 255, 255, 255))
        }
        pauseResumeButton?.setTextColor(Color.WHITE)

        // Result buttons — solid brand colors (browser PiP style)
        styleSolidButton(correctButton, EMERALD_600, Color.WHITE)
        styleSolidButton(incorrectButton, ROSE_600, Color.WHITE)
        styleSolidButton(skippedButton, AMBER_600, Color.WHITE)

        // Target / undo — subtle glass
        stylePillButton(targetButton, Color.argb(20, 255, 255, 255), Color.WHITE, Color.argb(45, 255, 255, 255))
        stylePillButton(undoButton, Color.TRANSPARENT, textMuted, Color.argb(45, 255, 255, 255))

        // Settings
        stylePillButton(themeButton, Color.argb(30, 139, 92, 246), BRAND_500, Color.argb(30, 139, 92, 246))
    }

    // ═══════════════════════════════════════════════════════════════
    //  DARK GLASS — dark frosted glassmorphism + top edge highlight
    // ═══════════════════════════════════════════════════════════════
    private fun renderDarkGlass(card: LinearLayout, isBreak: Boolean) {
        card.background = GradientDrawable().apply {
            setColor(Color.argb(180, 17, 25, 40))
            cornerRadius = dp(CORNER_RADIUS_DP).toFloat()
            setStroke(dp(1), Color.argb(30, 255, 255, 255))
        }

        // Top edge highlight
        glassEdgeTop?.visibility = View.VISIBLE
        glassEdgeTop?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(20, 255, 255, 255), Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(
                dp(CORNER_RADIUS_DP).toFloat(), dp(CORNER_RADIUS_DP).toFloat(),
                dp(CORNER_RADIUS_DP).toFloat(), dp(CORNER_RADIUS_DP).toFloat(),
                0f, 0f, 0f, 0f)
        }

        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply { setColor(stripColor) }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 139, 92, 246))
        }

        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(50, 139, 92, 246))
        }

        val textMuted = Color.rgb(161, 161, 170)
        headingText?.setTextColor(textMuted)
        timerText?.setTextColor(Color.WHITE)
        statusText?.setTextColor(textMuted)
        focusTypeText?.setTextColor(Color.rgb(196, 181, 253))
        attemptedText?.setTextColor(Color.WHITE)
        targetValueText?.setTextColor(textMuted)

        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 139, 92, 246))
            cornerRadius = dp(12).toFloat()
        }
        expandButton?.setTextColor(BRAND_500)

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 255, 255, 255))
            cornerRadius = dp(12).toFloat()
        }
        closeButton?.setTextColor(textMuted)

        // Pause button — frosted glass
        pauseResumeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(20, 255, 255, 255))
            cornerRadius = dp(16).toFloat()
            setStroke(dp(1), Color.argb(25, 255, 255, 255))
        }
        pauseResumeButton?.setTextColor(Color.WHITE)

        // Result buttons — colored glass tint
        styleGlassButton(correctButton, Color.argb(35, 16, 185, 129), Color.rgb(110, 231, 183))
        styleGlassButton(incorrectButton, Color.argb(35, 225, 29, 72), Color.rgb(248, 113, 133))
        styleGlassButton(skippedButton, Color.argb(35, 245, 158, 11), Color.rgb(253, 211, 138))

        stylePillButton(targetButton, Color.argb(20, 255, 255, 255), Color.WHITE, Color.argb(15, 255, 255, 255))
        stylePillButton(undoButton, Color.TRANSPARENT, textMuted, Color.argb(12, 255, 255, 255))

        stylePillButton(themeButton, Color.argb(30, 139, 92, 246), BRAND_500, Color.argb(25, 139, 92, 246))
    }

    // ═══════════════════════════════════════════════════════════════
    //  APPLE LIQUID — milky translucent + full 4-edge glass rim
    // ═══════════════════════════════════════════════════════════════
    private fun renderAppleLiquid(card: LinearLayout, isBreak: Boolean) {
        val cr = dp(CORNER_RADIUS_DP).toFloat()

        // Card body — milky translucent
        card.background = GradientDrawable().apply {
            setColor(Color.argb(30, 255, 255, 255))
            cornerRadius = cr
            setStroke(dp(1), Color.argb(40, 255, 255, 255))
        }

        // ── Full 4-edge glass rim ──
        // Top edge — specular highlight
        glassEdgeTop?.visibility = View.VISIBLE
        glassEdgeTop?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(130, 255, 255, 255), Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(cr, cr, cr, cr, 0f, 0f, 0f, 0f)
        }
        // Bottom edge — reflection
        glassEdgeBottom?.visibility = View.VISIBLE
        glassEdgeBottom?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(0, 255, 255, 255), Color.argb(65, 255, 255, 255))
            cornerRadii = floatArrayOf(0f, 0f, 0f, 0f, cr, cr, cr, cr)
        }
        // Left edge
        glassEdgeLeft?.visibility = View.VISIBLE
        glassEdgeLeft?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(45, 255, 255, 255), Color.argb(0, 255, 255, 255))
            orientation = GradientDrawable.Orientation.LEFT_RIGHT
        }
        // Right edge
        glassEdgeRight?.visibility = View.VISIBLE
        glassEdgeRight?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(0, 255, 255, 255), Color.argb(45, 255, 255, 255))
            orientation = GradientDrawable.Orientation.LEFT_RIGHT
        }
        // Inner glow
        glassInnerGlow?.visibility = View.VISIBLE
        glassInnerGlow?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(30, 255, 255, 255), Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(cr, cr, cr, cr, 0f, 0f, 0f, 0f)
        }
        // Corner glows
        val cornerGlow = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(50, 255, 255, 255), Color.argb(0, 255, 255, 255))
            shape = GradientDrawable.OVAL
        }
        glassCornerTL?.visibility = View.VISIBLE
        glassCornerTL?.background = cornerGlow
        glassCornerTR?.visibility = View.VISIBLE
        glassCornerTR?.background = cornerGlow
        val cornerGlowBottom = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(20, 255, 255, 255), Color.argb(0, 255, 255, 255))
            shape = GradientDrawable.OVAL
        }
        glassCornerBL?.visibility = View.VISIBLE
        glassCornerBL?.background = cornerGlowBottom
        glassCornerBR?.visibility = View.VISIBLE
        glassCornerBR?.background = cornerGlowBottom
        // Light sweep
        glassLightSweep?.visibility = View.VISIBLE
        glassLightSweep?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(45, 255, 255, 255),
                Color.argb(12, 255, 255, 255),
                Color.argb(0, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            gradientType = GradientDrawable.LINEAR_GRADIENT
            orientation = GradientDrawable.Orientation.TL_BR
            cornerRadius = cr
        }

        // Progress
        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply { setColor(stripColor); cornerRadius = dp(2).toFloat() }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(12, 139, 92, 246))
        }

        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(45, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(50, 139, 92, 246))
        }

        // Dark text on light frosted (Apple HIG)
        val textPrimary = Color.rgb(12, 12, 18)
        val textSecondary = Color.rgb(65, 65, 80)
        val textTertiary = Color.rgb(105, 105, 125)

        headingText?.setTextColor(textSecondary)
        timerText?.setTextColor(textPrimary)
        statusText?.setTextColor(textSecondary)
        focusTypeText?.setTextColor(Color.rgb(80, 30, 190))
        attemptedText?.setTextColor(textPrimary)
        targetValueText?.setTextColor(textTertiary)

        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 139, 92, 246))
            cornerRadius = dp(12).toFloat()
        }
        expandButton?.setTextColor(Color.rgb(80, 30, 190))

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 0, 0, 0))
            cornerRadius = dp(12).toFloat()
        }
        closeButton?.setTextColor(textSecondary)

        // Pause button — frosted dark glass
        pauseResumeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(18, 0, 0, 0))
            cornerRadius = dp(16).toFloat()
            setStroke(dp(1), Color.argb(20, 0, 0, 0))
        }
        pauseResumeButton?.setTextColor(textPrimary)

        // Result buttons — colored glass, dark colored text
        styleGlassButton(correctButton, Color.argb(50, 5, 150, 105), Color.rgb(0, 100, 70))
        styleGlassButton(incorrectButton, Color.argb(50, 225, 29, 72), Color.rgb(170, 10, 50))
        styleGlassButton(skippedButton, Color.argb(50, 217, 119, 6), Color.rgb(160, 80, 0))

        stylePillButton(targetButton, Color.argb(20, 0, 0, 0), textSecondary, Color.argb(18, 0, 0, 0))
        stylePillButton(undoButton, Color.TRANSPARENT, textTertiary, Color.argb(12, 0, 0, 0))

        stylePillButton(themeButton, Color.argb(35, 139, 92, 246), Color.rgb(80, 30, 190), Color.argb(25, 139, 92, 246))

        startLightSweep()
    }

    private fun hideGlassEffects() {
        glassEdgeTop?.visibility = View.GONE
        glassEdgeBottom?.visibility = View.GONE
        glassEdgeLeft?.visibility = View.GONE
        glassEdgeRight?.visibility = View.GONE
        glassInnerGlow?.visibility = View.GONE
        glassCornerTL?.visibility = View.GONE
        glassCornerTR?.visibility = View.GONE
        glassCornerBL?.visibility = View.GONE
        glassCornerBR?.visibility = View.GONE
        glassLightSweep?.visibility = View.GONE
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

        // Pause/Resume icon
        val isRunning = state.timerState == "running"
        pauseResumeButton?.text = if (isRunning) "\u23f8" else "\u25b6"

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
        val overlayWidth = lp.width.toFloat()
        val overlayHeight = lp.height.toFloat()
        val wScale = Math.max(0.65f, Math.min(1.4f, overlayWidth / dp(340)))
        val hScale = Math.max(0.65f, Math.min(1.4f, overlayHeight / dp(390)))
        val scale = Math.min(wScale, hScale)

        timerText?.textSize = Math.max(24f, 56f * scale)
        headingText?.textSize = Math.max(8f, 11f * scale)
        statusText?.textSize = Math.max(8f, 11f * scale)
        focusTypeText?.textSize = Math.max(9f, 13f * scale)
        focusTypeText?.setPadding(dp((14 * scale).toInt()), dp((5 * scale).toInt()), dp((14 * scale).toInt()), dp((5 * scale).toInt()))

        attemptedText?.textSize = Math.max(16f, 26f * scale)
        targetValueText?.textSize = Math.max(9f, 12f * scale)

        val btnH = Math.max(dp(32), (dp(44) * scale).toInt())
        val btnPadH = Math.max(6, (12 * scale).toInt())
        val btnTextSize = Math.max(10f, 13f * scale)
        val btnRadius = Math.max(dp(10), dp((14 * scale).toInt()))
        listOf(correctButton, incorrectButton, skippedButton).forEach { btn ->
            btn?.let {
                val params = it.layoutParams as? LinearLayout.LayoutParams
                params?.height = btnH
                params?.weight = 1f
                it.layoutParams = params
                it.textSize = btnTextSize
                it.setPadding(btnPadH, 0, btnPadH, 0)
                val bg = it.background
                if (bg is GradientDrawable) bg.cornerRadius = btnRadius.toFloat()
            }
        }

        val pillH = Math.max(dp(28), (dp(38) * scale).toInt())
        val pillTextSize = Math.max(9f, 12f * scale)
        listOf(targetButton, undoButton, themeButton).forEach { btn ->
            btn?.let {
                val params = it.layoutParams as? LinearLayout.LayoutParams
                params?.height = pillH
                it.layoutParams = params
                it.textSize = pillTextSize
                val bg = it.background
                if (bg is GradientDrawable) bg.cornerRadius = Math.max(dp(8), dp((14 * scale).toInt())).toFloat()
            }
        }

        val iconSize = Math.max(dp(28), (dp(36) * scale).toInt())
        listOf(expandButton, closeButton).forEach { btn ->
            btn?.let {
                val params = it.layoutParams as? LinearLayout.LayoutParams
                params?.width = iconSize
                params?.height = iconSize
                it.layoutParams = params
                it.textSize = Math.max(12f, 16f * scale)
            }
        }

        // Pause button scale
        pauseResumeButton?.let {
            val params = it.layoutParams as? LinearLayout.LayoutParams
            params?.height = Math.max(dp(36), (dp(48) * scale).toInt())
            it.layoutParams = params
            it.textSize = Math.max(16f, 22f * scale)
        }

        val pad = Math.max(dp(12), (20 * scale).toInt())
        contentView?.setPadding(pad, dp((18 * scale).toInt()), pad, pad)
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
                scaleButtonsToOverlay()
                return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (resizing) {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putInt(PREF_WIDTH, lp.width)
                        .putInt(PREF_HEIGHT, lp.height)
                        .apply()
                    scaleButtonsToOverlay()
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

    private fun resizeOverlay(w: Int, h: Int) {
        val lp = layoutParams ?: return
        val wm = windowManager ?: return
        lp.width = clampOverlayWidth(w)
        lp.height = clampOverlayHeight(h)
        try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
            .putInt(PREF_WIDTH, lp.width)
            .putInt(PREF_HEIGHT, lp.height)
            .apply()
        scaleButtonsToOverlay()
    }

    // ── Button factories ──

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
            cornerRadius = dp(14).toFloat()
        }
    }

    private fun styleSolidButton(button: Button?, bgColor: Int, textColor: Int) {
        button ?: return
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(14).toFloat()
        }
        button.setTextColor(textColor)
    }

    private fun styleGlassButton(button: Button?, bgColor: Int, textColor: Int) {
        button ?: return
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(14).toFloat()
        }
        button.setTextColor(textColor)
    }

    private fun stylePillButton(button: Button?, bgColor: Int, textColor: Int, strokeColor: Int) {
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

    private fun startLightSweep() {
        val sweep = glassLightSweep ?: return
        sweep.alpha = 0f
        sweep.translationX = -sweep.width.toFloat() - dp(100).toFloat()
        sweep.animate()
            .translationX(sweep.width.toFloat() + dp(100).toFloat())
            .alpha(0.5f)
            .setDuration(2500)
            .setInterpolator(android.view.animation.AccelerateDecelerateInterpolator())
            .withEndAction {
                sweep.animate().alpha(0f).setDuration(800).start()
            }
            .start()
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
