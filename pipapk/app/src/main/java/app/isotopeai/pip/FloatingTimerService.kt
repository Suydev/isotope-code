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
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.graphics.RuntimeShader
import android.graphics.Shader
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
        private const val THEME_APPLE = "apple"
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
    private var glassEdgeTop: View? = null
    private var glassEdgeBottom: View? = null
    private var glassEdgeLeft: View? = null
    private var glassEdgeRight: View? = null
    private var glassEdgeShine: View? = null
    private var glassCornerTL: View? = null
    private var glassCornerTR: View? = null
    private var glassCornerBL: View? = null
    private var glassCornerBR: View? = null
    private var glassLightSweep: View? = null
    private var blurBackdrop: View? = null
    private var settingsRow: LinearLayout? = null
    private var settingsExpanded = false

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
        // Start light sweep animation for Apple theme
        if (isApple) {
            handler.postDelayed({ startLightSweep() }, 300)
        } else {
            glassLightSweep?.animate()?.cancel()
            glassLightSweep?.alpha = 0f
        }

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
            clampOverlayWidth(prefs.getInt(PREF_WIDTH, dp(300))),
            clampOverlayHeight(prefs.getInt(PREF_HEIGHT, dp(340))),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT)
        // API 31+ window blur behind — real frosted glass
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            layoutParams!!.flags = layoutParams!!.flags or
                WindowManager.LayoutParams.FLAG_BLUR_BEHIND
            layoutParams!!.setBlurBehindRadius(30)
        }
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

        // In-overlay customization row (always visible)
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
            setOnClickListener { resizeOverlay(dp(240), dp(280)) }
        }
        val sizeMedBtn = makePillButton("M").apply {
            textSize = 10f
            setOnClickListener { resizeOverlay(dp(300), dp(340)) }
        }
        val sizeLgBtn = makePillButton("L").apply {
            textSize = 10f
            setOnClickListener { resizeOverlay(dp(400), dp(440)) }
        }
        settingsRow!!.addView(themeButton, LinearLayout.LayoutParams(0, dp(28), 1f))
        settingsRow!!.addView(sizeSmallBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeMedBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeLgBtn, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })

        contentView!!.addView(header)
        contentView!!.addView(focusTypeText, chipParams)
        contentView!!.addView(timerText, timerParams)
        contentView!!.addView(statusRow)
        contentView!!.addView(questionSection, qsParams)
        contentView!!.addView(settingsRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(28)).apply { topMargin = dp(6) })

        cardView!!.addView(contentView,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

        // Apple Liquid Glass edge highlights — ALL 4 edges + corners
        val edgeThickness = dp(4)
        val cornerSize = dp(28)

        // Top edge — bright white gradient downward
        glassEdgeTop = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply {
                gravity = Gravity.TOP
            }
            visibility = View.GONE
        }
        // Bottom edge — subtle shadow gradient upward
        glassEdgeBottom = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply {
                gravity = Gravity.BOTTOM
            }
            visibility = View.GONE
        }
        // Left edge — subtle gradient rightward (full height, corners handled by corner views)
        glassEdgeLeft = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                dp(3), FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.START
                topMargin = dp(24)
                bottomMargin = dp(24)
            }
            visibility = View.GONE
        }
        // Right edge — subtle gradient leftward (full height, corners handled by corner views)
        glassEdgeRight = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                dp(3), FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.END
                topMargin = dp(24)
                bottomMargin = dp(24)
            }
            visibility = View.GONE
        }
        // Inner glow — larger soft glow from top
        glassEdgeShine = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, dp(50)).apply {
                gravity = Gravity.TOP
            }
            visibility = View.GONE
        }
        // Corner glows — rounded highlights at each corner
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

        // Blur backdrop — sits BEHIND card, blurred on API 31+
        blurBackdrop = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            setBackgroundColor(Color.TRANSPARENT)
            visibility = View.GONE
        }

        // Light sweep — animated diagonal highlight across glass
        glassLightSweep = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            visibility = View.GONE
        }

        root.addView(blurBackdrop)
        root.addView(cardView,
            FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))

        // Edge layers sit ON TOP of card in the FrameLayout
        root.addView(glassEdgeTop)
        root.addView(glassEdgeBottom)
        root.addView(glassEdgeLeft)
        root.addView(glassEdgeRight)
        root.addView(glassEdgeShine)
        root.addView(glassCornerTL)
        root.addView(glassCornerTR)
        root.addView(glassCornerBL)
        root.addView(glassCornerBR)

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

        // Read latest theme from prefs (in case settings changed it)
        currentTheme = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString(PREF_THEME, THEME_DARK) ?: THEME_DARK

        when (currentTheme) {
            THEME_APPLE -> renderAppleGlass(card, isBreak)
            THEME_GLASS -> renderGlassTheme(card, isBreak)
            else -> renderDarkTheme(card, isBreak)
        }

        // Edge highlights — Apple gets full 4-edge rim + inner glow + light sweep
        val isGlass = currentTheme == THEME_GLASS
        val isApple = currentTheme == THEME_APPLE
        val isDark = currentTheme == THEME_DARK

        // Hide all edges by default
        glassEdgeTop?.visibility = View.GONE
        glassEdgeBottom?.visibility = View.GONE
        glassEdgeLeft?.visibility = View.GONE
        glassEdgeRight?.visibility = View.GONE
        glassEdgeShine?.visibility = View.GONE
        glassCornerTL?.visibility = View.GONE
        glassCornerTR?.visibility = View.GONE
        glassCornerBL?.visibility = View.GONE
        glassCornerBR?.visibility = View.GONE
        glassLightSweep?.visibility = View.GONE

        if (isApple) {
            // Full 4-edge glass rim
            glassEdgeTop?.visibility = View.VISIBLE
            glassEdgeBottom?.visibility = View.VISIBLE
            glassEdgeLeft?.visibility = View.VISIBLE
            glassEdgeRight?.visibility = View.VISIBLE
            glassEdgeShine?.visibility = View.VISIBLE
            glassCornerTL?.visibility = View.VISIBLE
            glassCornerTR?.visibility = View.VISIBLE
            glassCornerBL?.visibility = View.VISIBLE
            glassCornerBR?.visibility = View.VISIBLE
            glassLightSweep?.visibility = View.VISIBLE
        } else if (isGlass) {
            // Subtle top edge for dark glass
            glassEdgeTop?.visibility = View.VISIBLE
        }

        // Drop shadow for glass themes (lifts glass off background)
        card.elevation = when {
            isApple -> dp(12).toFloat()
            isGlass -> dp(8).toFloat()
            else -> dp(4).toFloat()
        }

        // Resize handle adapts to theme
        val rootFrame = rootView as? FrameLayout
        rootFrame?.let {
            for (i in 0 until it.childCount) {
                val child = it.getChildAt(i)
                if (child is TextView && child.text == "\u25e2") {
                    child.setTextColor(when (currentTheme) {
                        THEME_APPLE -> Color.argb(80, 0, 0, 0)
                        THEME_GLASS -> Color.argb(60, 255, 255, 255)
                        else -> Color.argb(60, 255, 255, 255)
                    })
                }
            }
        }

        renderDynamicFields()
    }

    private fun renderGlassTheme(card: LinearLayout, isBreak: Boolean) {
        // ── Dark Frosted Glass (glassmorphism) ──
        // CSS: rgba(17,25,40,0.75), border rgba(255,255,255,0.10), shadow 0 8px 32px rgba(0,0,0,0.5)
        card.background = GradientDrawable().apply {
            setColor(Color.argb(190, 17, 25, 40))
            cornerRadius = dp(20).toFloat()
            setStroke(dp(1), Color.argb(25, 255, 255, 255))
        }

        // Top edge — subtle specular (inset 0 1px 0 rgba(255,255,255,0.06))
        glassEdgeTop?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(15, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(
                dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // Progress strip
        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply {
            setColor(stripColor)
            cornerRadius = dp(2).toFloat()
        }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(20, 139, 92, 246))
            cornerRadii = floatArrayOf(
                dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // Focus chip — frosted tinted pill
        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(30, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(50, 139, 92, 246))
        }
        focusTypeText?.setTextColor(Color.rgb(196, 181, 253))

        // Text — light on dark glass
        val textPrimary = Color.WHITE
        val textSecondary = Color.rgb(161, 161, 170)
        val textTertiary = Color.rgb(115, 115, 130)

        headingText?.setTextColor(textSecondary)
        timerText?.setTextColor(textPrimary)
        statusText?.setTextColor(textSecondary)
        attemptedText?.setTextColor(textPrimary)
        targetValueText?.setTextColor(textTertiary)

        // Expand button — frosted violet
        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(25, 139, 92, 246))
            cornerRadius = dp(12).toFloat()
            setStroke(dp(1), Color.argb(40, 139, 92, 246))
        }
        expandButton?.setTextColor(Color.rgb(196, 181, 253))

        // Close button
        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(20, 255, 255, 255))
            cornerRadius = dp(12).toFloat()
        }
        closeButton?.setTextColor(textSecondary)

        // Result buttons — tinted glass, bright colored text
        styleButtonGlass(correctButton, Color.argb(35, 16, 185, 129), Color.rgb(110, 231, 183), Color.argb(25, 16, 185, 129))
        styleButtonGlass(incorrectButton, Color.argb(35, 225, 29, 72), Color.rgb(248, 113, 133), Color.argb(25, 225, 29, 72))
        styleButtonGlass(skippedButton, Color.argb(35, 245, 158, 11), Color.rgb(253, 211, 138), Color.argb(25, 245, 158, 11))

        // Target / undo
        styleButtonGlass(targetButton, Color.argb(20, 255, 255, 255), textSecondary, Color.argb(15, 255, 255, 255))
        styleButtonGlass(undoButton, Color.TRANSPARENT, textTertiary, Color.argb(12, 255, 255, 255))

        // Settings row
        styleButtonGlass(themeButton, Color.argb(30, 139, 92, 246), Color.rgb(196, 181, 253), Color.argb(25, 139, 92, 246))
    }

    private fun renderAppleGlass(card: LinearLayout, isBreak: Boolean) {
        // ── Apple Liquid Glass (iOS 26 style) — full 4-edge glass ──

        // Card body — milky translucent white (CSS: rgba(255,255,255,0.10) with blur)
        card.background = GradientDrawable().apply {
            setColor(Color.argb(30, 255, 255, 255))
            cornerRadius = dp(28).toFloat()
            setStroke(dp(1), Color.argb(45, 255, 255, 255))
        }

        // TOP edge — bright specular highlight (inset 0 1px 0 rgba(255,255,255,0.55))
        glassEdgeTop?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(140, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(
                dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // BOTTOM edge — subtle shadow/reflection (inset 0 -1px 0 rgba(255,255,255,0.30))
        glassEdgeBottom?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(0, 255, 255, 255),
                Color.argb(75, 255, 255, 255))
            cornerRadii = floatArrayOf(
                0f, 0f, 0f, 0f,
                dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat())
        }

        // LEFT edge (inset 1px 0 0 rgba(255,255,255,0.20))
        glassEdgeLeft?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(50, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            orientation = GradientDrawable.Orientation.LEFT_RIGHT
            cornerRadii = floatArrayOf(
                dp(28).toFloat(), 0f, 0f, dp(28).toFloat(),
                dp(28).toFloat(), 0f, 0f, dp(28).toFloat())
        }

        // RIGHT edge (inset -1px 0 0 rgba(255,255,255,0.20))
        glassEdgeRight?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(0, 255, 255, 255),
                Color.argb(50, 255, 255, 255))
            orientation = GradientDrawable.Orientation.LEFT_RIGHT
            cornerRadii = floatArrayOf(
                0f, dp(28).toFloat(), dp(28).toFloat(), 0f,
                0f, dp(28).toFloat(), dp(28).toFloat(), 0f)
        }

        // Inner glow — soft light from top (ambient highlight)
        glassEdgeShine?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(35, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(
                dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // Corner glows — radial highlights at rounded corners
        val cornerGlow = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(60, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            shape = GradientDrawable.OVAL
        }
        glassCornerTL?.background = cornerGlow
        glassCornerTR?.background = cornerGlow
        glassCornerBL?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(25, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            shape = GradientDrawable.OVAL
        }
        glassCornerBR?.background = glassCornerBL?.background

        // Light sweep — diagonal sheen (linear-gradient 135deg)
        glassLightSweep?.background = GradientDrawable().apply {
            colors = intArrayOf(
                Color.argb(50, 255, 255, 255),
                Color.argb(15, 255, 255, 255),
                Color.argb(0, 255, 255, 255),
                Color.argb(0, 255, 255, 255))
            gradientType = GradientDrawable.LINEAR_GRADIENT
            orientation = GradientDrawable.Orientation.TL_BR
            cornerRadius = dp(28).toFloat()
        }

        // Progress strip
        val stripColor = if (isBreak) SKY_400 else BRAND_500
        progressFill?.background = GradientDrawable().apply {
            setColor(stripColor)
            cornerRadius = dp(2).toFloat()
        }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 139, 92, 246))
            cornerRadii = floatArrayOf(
                dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(),
                0f, 0f, 0f, 0f)
        }

        // Focus chip — frosted pill with violet tint
        focusTypeText?.background = GradientDrawable().apply {
            setColor(Color.argb(50, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(55, 139, 92, 246))
        }
        focusTypeText?.setTextColor(Color.rgb(80, 30, 190))

        // Text — dark on light frosted glass (Apple HIG)
        val textPrimary = Color.rgb(12, 12, 18)
        val textSecondary = Color.rgb(65, 65, 80)
        val textTertiary = Color.rgb(105, 105, 125)

        headingText?.setTextColor(textSecondary)
        timerText?.setTextColor(textPrimary)
        statusText?.setTextColor(textSecondary)
        attemptedText?.setTextColor(textPrimary)
        targetValueText?.setTextColor(textTertiary)

        // Expand button — frosted violet glass
        expandButton?.background = GradientDrawable().apply {
            setColor(Color.argb(35, 139, 92, 246))
            cornerRadius = dp(12).toFloat()
            setStroke(dp(1), Color.argb(30, 139, 92, 246))
        }
        expandButton?.setTextColor(Color.rgb(80, 30, 190))

        // Close button — frosted dark tint
        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(18, 0, 0, 0))
            cornerRadius = dp(12).toFloat()
        }
        closeButton?.setTextColor(textSecondary)

        // Result buttons — colored glass tint, dark colored text (NOT white)
        styleButtonGlass(correctButton, Color.argb(55, 5, 150, 105), Color.rgb(0, 100, 70), Color.argb(35, 5, 150, 105))
        styleButtonGlass(incorrectButton, Color.argb(55, 225, 29, 72), Color.rgb(170, 10, 50), Color.argb(35, 225, 29, 72))
        styleButtonGlass(skippedButton, Color.argb(55, 217, 119, 6), Color.rgb(160, 80, 0), Color.argb(35, 217, 119, 6))

        // Target / undo
        styleButtonGlass(targetButton, Color.argb(25, 0, 0, 0), textSecondary, Color.argb(20, 0, 0, 0))
        styleButtonGlass(undoButton, Color.TRANSPARENT, textTertiary, Color.argb(15, 0, 0, 0))

        // Settings row — frosted pills
        styleButtonGlass(themeButton, Color.argb(40, 139, 92, 246), Color.rgb(80, 30, 190), Color.argb(30, 139, 92, 246))

        // Start light sweep animation
        startLightSweep()
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

        // Settings row
        styleButton(themeButton, Color.argb(30, 139, 92, 246), BRAND_500, Color.argb(30, 139, 92, 246))
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
        val overlayWidth = lp.width.toFloat()
        val overlayHeight = lp.height.toFloat()
        val wScale = Math.max(0.65f, Math.min(1.4f, overlayWidth / dp(300)))
        val hScale = Math.max(0.65f, Math.min(1.4f, overlayHeight / dp(340)))
        val scale = Math.min(wScale, hScale)

        // Timer text
        timerText?.textSize = Math.max(24f, 56f * scale)
        timerText?.setPadding(dp((16 * scale).toInt()), 0, dp((16 * scale).toInt()), 0)

        // Heading / status
        headingText?.textSize = Math.max(8f, 11f * scale)
        statusText?.textSize = Math.max(8f, 11f * scale)
        focusTypeText?.textSize = Math.max(9f, 13f * scale)
        focusTypeText?.setPadding(dp((12 * scale).toInt()), dp((5 * scale).toInt()), dp((12 * scale).toInt()), dp((5 * scale).toInt()))

        // Attempt counter
        attemptedText?.textSize = Math.max(16f, 26f * scale)
        targetValueText?.textSize = Math.max(9f, 12f * scale)

        // Result buttons — scale height, text, padding
        val btnH = Math.max(dp(32), (dp(44) * scale).toInt())
        val btnPadH = Math.max(4, (10 * scale).toInt())
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
                // Update corner radius
                val bg = it.background
                if (bg is GradientDrawable) bg.cornerRadius = btnRadius.toFloat()
            }
        }

        // Pill buttons (target, undo, theme) — scale height + text
        val pillH = Math.max(dp(28), (dp(36) * scale).toInt())
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

        // Icon buttons (expand, close)
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

        // Content padding
        val pad = Math.max(dp(10), (16 * scale).toInt())
        contentView?.setPadding(pad, dp((12 * scale).toInt()), pad, pad)
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

    private fun startLightSweep() {
        val sweep = glassLightSweep ?: return
        sweep.alpha = 0f
        sweep.translationX = -sweep.width.toFloat() - dp(100).toFloat()
        sweep.animate()
            .translationX(sweep.width.toFloat() + dp(100).toFloat())
            .alpha(0.6f)
            .setDuration(2500)
            .setInterpolator(android.view.animation.AccelerateDecelerateInterpolator())
            .withEndAction {
                sweep.animate()
                    .alpha(0f)
                    .setDuration(800)
                    .start()
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
