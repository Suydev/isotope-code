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
        private const val THEME_APPLE = "apple"
        private const val POLL_MS = 750L
        private const val TICK_MS = 40L
    }

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
    private var statusDot: View? = null
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
    private var subjectLabel: TextView? = null
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

        contentView = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            // PC PiP: padding 20px
            setPadding(dp(20), dp(20), dp(20), dp(20))
        }

        // ── [1] Mode Label ──
        // PC: font-size 14px, weight 600, uppercase, letter-spacing 0.05em, opacity 0.7
        headingText = TextView(this).apply {
            textSize = 14f
            letterSpacing = 0.05f
            isAllCaps = true
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            includeFontPadding = false
        }

        // ── [2] Timer Display ──
        // PC: font-size 3.1rem (49.6px), weight 800, letter-spacing -0.025em
        timerText = TextView(this).apply {
            textSize = 50f
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            letterSpacing = -0.025f
            includeFontPadding = false
        }

        // ── [3] Status Indicator Row ──
        // PC: flex, align-items center, gap 8px, font-size 14px, opacity 0.8
        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        // Status dot: 6x6px circle
        statusDot = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(dp(6), dp(6)).apply {
                marginEnd = dp(8)
            }
        }
        statusText = TextView(this).apply {
            textSize = 14f
            typeface = Typeface.DEFAULT
            includeFontPadding = false
        }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)

        // ── [4] Separator + [5] Question Tracking ──
        questionSection = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        // Separator: 1px solid rgba(255,255,255,0.12), padding-top 14px
        val separator = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(1)).apply {
                topMargin = dp(14)
                bottomMargin = dp(14)
            }
        }

        // [5a] Subject + Target row
        val attemptRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            orientation = LinearLayout.HORIZONTAL
        }
        // Subject label: font-size 12.48px, opacity 0.66, weight 700
        subjectLabel = TextView(this).apply {
            textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            includeFontPadding = false
        }
        // Question count: font-size 24.8px, weight 900
        attemptedText = TextView(this).apply {
            textSize = 25f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            includeFontPadding = false
        }
        // Target button: pill, border rgba(255,255,255,0.16), bg rgba(255,255,255,0.07)
        targetButton = Button(this).apply {
            text = "Target"
            isAllCaps = false
            textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnClickListener { showTargetDialog() }
        }

        // Build attempt row cleanly: leftCol (subjectLabel + countRow) + targetButton
        val leftCol = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        val countRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        targetValueText = TextView(this).apply {
            textSize = 14f
            typeface = Typeface.DEFAULT
            includeFontPadding = false
        }
        countRow.addView(attemptedText)
        leftCol.addView(subjectLabel)
        leftCol.addView(countRow)
        attemptRow.addView(leftCol, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetButton)

        // Target editor row
        targetEditorRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER
            orientation = LinearLayout.HORIZONTAL
        }
        val minus = Button(this).apply {
            text = "-5"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnClickListener { updateTargetBy(-5) }
        }
        val plus = Button(this).apply {
            text = "+5"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnClickListener { updateTargetBy(5) }
        }
        val zero = Button(this).apply {
            text = "0"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnClickListener { setTarget(0) }
        }
        targetEditorRow!!.addView(minus)
        targetEditorRow!!.addView(targetValueText)
        targetEditorRow!!.addView(plus)
        targetEditorRow!!.addView(zero)
        targetEditorRow!!.visibility = View.GONE

        // [5b] Scoring grid: 3-column, gap 8px
        // PC: border-radius 14px, padding 10px 12px, font-size 12.48px, weight 800
        val resultRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        correctButton = Button(this).apply {
            text = "\u2713"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(12), dp(10), dp(12), dp(10))
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "correct", -1) }
        }
        incorrectButton = Button(this).apply {
            text = "\u2715"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(12), dp(10), dp(12), dp(10))
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "incorrect", -1) }
        }
        skippedButton = Button(this).apply {
            text = "Skip"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(12), dp(10), dp(12), dp(10))
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "skipped", -1) }
        }
        val btnH = dp(40)
        val gap = dp(8)
        resultRow.addView(correctButton, LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) })
        resultRow.addView(incorrectButton, LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) })
        resultRow.addView(skippedButton, LinearLayout.LayoutParams(0, btnH, 1f))

        // [5c] Undo: pill, border rgba(255,255,255,0.14), text rgba(255,255,255,0.72)
        undoButton = Button(this).apply {
            text = "Undo last"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(8), dp(10), dp(8))
            setOnClickListener { PipClient.postAction(this@FloatingTimerService, "undo", -1) }
        }

        // Assemble question section
        questionSection!!.addView(separator)
        questionSection!!.addView(attemptRow)
        questionSection!!.addView(targetEditorRow)
        questionSection!!.addView(resultRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(8)
        })
        questionSection!!.addView(undoButton, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(36)).apply { topMargin = dp(8) })

        // Settings row
        settingsRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val themeLabel = when (currentTheme) {
            THEME_APPLE -> "\u2734 Apple"
            THEME_GLASS -> "\u2601 Glass"
            else -> "\u263E Dark"
        }
        themeButton = Button(this).apply {
            text = themeLabel; isAllCaps = false; textSize = 11f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(10), dp(6), dp(10), dp(6))
            setOnClickListener {
                val intent = Intent(this@FloatingTimerService, FloatingTimerService::class.java)
                intent.action = "TOGGLE_THEME"
                startService(intent)
            }
        }
        val sizeSmall = Button(this).apply {
            text = "S"; isAllCaps = false; textSize = 10f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(8), dp(6), dp(8), dp(6))
            setOnClickListener { resizeOverlay(dp(280), dp(320)) }
        }
        val sizeMed = Button(this).apply {
            text = "M"; isAllCaps = false; textSize = 10f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(8), dp(6), dp(8), dp(6))
            setOnClickListener { resizeOverlay(dp(340), dp(390)) }
        }
        val sizeLg = Button(this).apply {
            text = "L"; isAllCaps = false; textSize = 10f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(8), dp(6), dp(8), dp(6))
            setOnClickListener { resizeOverlay(dp(420), dp(480)) }
        }
        settingsRow!!.addView(themeButton, LinearLayout.LayoutParams(0, dp(28), 1f))
        settingsRow!!.addView(sizeSmall, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeMed, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })
        settingsRow!!.addView(sizeLg, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })

        // Close button — opens PipActivity and stops overlay
        closeButton = Button(this).apply {
            text = "\u2715"; isAllCaps = false; textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setPadding(dp(8), dp(6), dp(8), dp(6))
            setOnClickListener {
                stopSelf()
                startActivity(Intent(this@FloatingTimerService, PipActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                })
            }
        }
        settingsRow!!.addView(closeButton, LinearLayout.LayoutParams(0, dp(28), 1f).apply { setMargins(dp(4), 0, 0, 0) })

        // Assemble content
        // PC PiP gap: 14px between elements
        val gapParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(14)
        }
        contentView!!.addView(headingText, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(0)
        })
        contentView!!.addView(timerText, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(14)
        })
        contentView!!.addView(statusRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(14)
        })

        // Pause/Resume button
        pauseResumeButton = Button(this).apply {
            text = "\u23f8"
            isAllCaps = false
            textSize = 20f
            typeface = Typeface.DEFAULT_BOLD
            setPadding(dp(24), dp(8), dp(24), dp(8))
            setOnClickListener {
                PipClient.postAction(this@FloatingTimerService, "togglePause", -1)
            }
        }
        contentView!!.addView(pauseResumeButton, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT, dp(44)).apply {
            topMargin = dp(14)
            gravity = Gravity.CENTER_HORIZONTAL
        })

        contentView!!.addView(questionSection, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(14)
        })
        contentView!!.addView(settingsRow, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, dp(28)).apply {
            topMargin = dp(14)
        })

        cardView!!.addView(contentView, LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT))

        // ── Liquid Glass edge highlights (for Apple theme) ──
        val edgeThickness = dp(3)
        val cornerSize = dp(24)
        glassEdgeTop = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply { gravity = Gravity.TOP }
            visibility = View.GONE
        }
        glassEdgeBottom = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, edgeThickness).apply { gravity = Gravity.BOTTOM }
            visibility = View.GONE
        }
        glassEdgeLeft = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(edgeThickness, FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.START; topMargin = dp(20); bottomMargin = dp(20)
            }
            visibility = View.GONE
        }
        glassEdgeRight = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(edgeThickness, FrameLayout.LayoutParams.MATCH_PARENT).apply {
                gravity = Gravity.END; topMargin = dp(20); bottomMargin = dp(20)
            }
            visibility = View.GONE
        }
        glassInnerGlow = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, dp(40)).apply { gravity = Gravity.TOP }
            visibility = View.GONE
        }
        glassCornerTL = View(this).apply { layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply { gravity = Gravity.TOP or Gravity.START }; visibility = View.GONE }
        glassCornerTR = View(this).apply { layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply { gravity = Gravity.TOP or Gravity.END }; visibility = View.GONE }
        glassCornerBL = View(this).apply { layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply { gravity = Gravity.BOTTOM or Gravity.START }; visibility = View.GONE }
        glassCornerBR = View(this).apply { layoutParams = FrameLayout.LayoutParams(cornerSize, cornerSize).apply { gravity = Gravity.BOTTOM or Gravity.END }; visibility = View.GONE }
        glassLightSweep = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            visibility = View.GONE
        }

        root.addView(cardView, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
        root.addView(glassEdgeTop); root.addView(glassEdgeBottom)
        root.addView(glassEdgeLeft); root.addView(glassEdgeRight)
        root.addView(glassInnerGlow)
        root.addView(glassCornerTL); root.addView(glassCornerTR)
        root.addView(glassCornerBL); root.addView(glassCornerBR)
        root.addView(glassLightSweep)

        // Resize handle
        val resizeHandle = TextView(this).apply {
            text = "\u25e2"; textSize = 14f; typeface = Typeface.DEFAULT_BOLD
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

        hideGlassEffects()

        when (currentTheme) {
            THEME_APPLE -> renderAppleLiquid(card, isBreak)
            THEME_GLASS -> renderDarkGlass(card, isBreak)
            else -> renderDarkSolid(card, isBreak)
        }

        card.elevation = when (currentTheme) {
            THEME_APPLE -> dp(12).toFloat()
            THEME_GLASS -> dp(8).toFloat()
            else -> dp(4).toFloat()
        }

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

        if (currentTheme == THEME_APPLE) {
            handler.postDelayed({ startLightSweep() }, 300)
        } else {
            glassLightSweep?.animate()?.cancel()
            glassLightSweep?.alpha = 0f
        }

        renderDynamicFields()
    }

    // ═══════════════════════════════════════════════════════
    //  DARK SOLID — matches PC PiP: bg #000000
    // ═══════════════════════════════════════════════════════
    private fun renderDarkSolid(card: LinearLayout, isBreak: Boolean) {
        // PC PiP: background #000000
        card.background = GradientDrawable().apply {
            setColor(Color.BLACK)
            cornerRadius = dp(20).toFloat()
        }

        // Progress strip
        progressFill?.background = GradientDrawable().apply {
            setColor(if (isBreak) Color.rgb(59, 130, 246) else Color.rgb(139, 92, 246))
        }
        progressContainer?.background = GradientDrawable().apply {
            setColor(Color.argb(15, 139, 92, 246))
        }

        // PC PiP mode label: opacity 0.7
        headingText?.setTextColor(Color.argb(178, 255, 255, 255))

        // PC PiP timer: white
        timerText?.setTextColor(Color.WHITE)

        // PC PiP status row: opacity 0.8
        statusText?.setTextColor(Color.argb(204, 255, 255, 255))

        // Status dot colors (PC PiP dark mode)
        val dotColor = when {
            state.timerState == "running" -> Color.parseColor("#22c55e")
            state.timerState == "paused" -> Color.parseColor("#f59e0b")
            state.timerState == "break" || state.activePhase == "break" -> Color.parseColor("#3b82f6")
            else -> Color.parseColor("#6b7280")
        }
        statusDot?.background = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(dotColor)
        }

        focusTypeText?.visibility = View.GONE

        // Subject label — PC PiP: opacity 0.66, weight 700
        subjectLabel?.setTextColor(Color.argb(168, 255, 255, 255))

        // PC PiP scoring buttons: solid brand colors
        correctButton?.background = GradientDrawable().apply {
            setColor(Color.parseColor("#059669"))
            cornerRadius = dp(14).toFloat()
        }
        correctButton?.setTextColor(Color.WHITE)

        incorrectButton?.background = GradientDrawable().apply {
            setColor(Color.parseColor("#e11d48"))
            cornerRadius = dp(14).toFloat()
        }
        incorrectButton?.setTextColor(Color.WHITE)

        skippedButton?.background = GradientDrawable().apply {
            setColor(Color.parseColor("#d97706"))
            cornerRadius = dp(14).toFloat()
        }
        skippedButton?.setTextColor(Color.WHITE)

        // PC PiP target: bg rgba(255,255,255,0.07), border rgba(255,255,255,0.16)
        targetButton?.background = GradientDrawable().apply {
            setColor(Color.argb(17, 255, 255, 255))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(40, 255, 255, 255))
        }
        targetButton?.setTextColor(Color.WHITE)

        // PC PiP undo: transparent, text rgba(255,255,255,0.72), border rgba(255,255,255,0.14)
        undoButton?.background = GradientDrawable().apply {
            setColor(Color.TRANSPARENT)
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(35, 255, 255, 255))
        }
        undoButton?.setTextColor(Color.argb(183, 255, 255, 255))

        // Settings
        themeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(17, 255, 255, 255))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(40, 255, 255, 255))
        }
        themeButton?.setTextColor(Color.WHITE)

        // Pause button
        pauseResumeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(17, 255, 255, 255))
            cornerRadius = dp(14).toFloat()
            setStroke(dp(1), Color.argb(40, 255, 255, 255))
        }
        pauseResumeButton?.setTextColor(Color.WHITE)

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(17, 255, 255, 255))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(40, 255, 255, 255))
        }
        closeButton?.setTextColor(Color.WHITE)

        // Subject label
        (attemptedText?.parent as? LinearLayout)?.let { parent ->
            for (i in 0 until parent.childCount) {
                val child = parent.getChildAt(i)
                if (child != attemptedText && child is TextView && child != targetValueText) {
                    // This is the subject label — set its color
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════
    //  DARK GLASS — dark frosted glassmorphism
    // ═══════════════════════════════════════════════════════
    private fun renderDarkGlass(card: LinearLayout, isBreak: Boolean) {
        card.background = GradientDrawable().apply {
            setColor(Color.argb(180, 17, 25, 40))
            cornerRadius = dp(20).toFloat()
            setStroke(dp(1), Color.argb(30, 255, 255, 255))
        }

        glassEdgeTop?.visibility = View.VISIBLE
        glassEdgeTop?.background = GradientDrawable().apply {
            colors = intArrayOf(Color.argb(20, 255, 255, 255), Color.argb(0, 255, 255, 255))
            cornerRadii = floatArrayOf(dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(), dp(20).toFloat(), 0f, 0f, 0f, 0f)
        }

        progressFill?.background = GradientDrawable().apply {
            setColor(if (isBreak) Color.rgb(59, 130, 246) else Color.rgb(139, 92, 246))
        }
        progressContainer?.background = GradientDrawable().apply { setColor(Color.argb(15, 139, 92, 246)) }

        headingText?.setTextColor(Color.argb(178, 255, 255, 255))
        timerText?.setTextColor(Color.WHITE)
        statusText?.setTextColor(Color.argb(204, 255, 255, 255))

        val dotColor = when {
            state.timerState == "running" -> Color.parseColor("#22c55e")
            state.timerState == "paused" -> Color.parseColor("#f59e0b")
            state.timerState == "break" || state.activePhase == "break" -> Color.parseColor("#3b82f6")
            else -> Color.parseColor("#6b7280")
        }
        statusDot?.background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(dotColor) }

        focusTypeText?.visibility = View.GONE

        subjectLabel?.setTextColor(Color.argb(168, 255, 255, 255))

        correctButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#059669")); cornerRadius = dp(14).toFloat() }
        correctButton?.setTextColor(Color.WHITE)
        incorrectButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#e11d48")); cornerRadius = dp(14).toFloat() }
        incorrectButton?.setTextColor(Color.WHITE)
        skippedButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#d97706")); cornerRadius = dp(14).toFloat() }
        skippedButton?.setTextColor(Color.WHITE)

        targetButton?.background = GradientDrawable().apply { setColor(Color.argb(17, 255, 255, 255)); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(40, 255, 255, 255)) }
        targetButton?.setTextColor(Color.WHITE)
        undoButton?.background = GradientDrawable().apply { setColor(Color.TRANSPARENT); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(35, 255, 255, 255)) }
        undoButton?.setTextColor(Color.argb(183, 255, 255, 255))

        themeButton?.background = GradientDrawable().apply { setColor(Color.argb(17, 255, 255, 255)); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(40, 255, 255, 255)) }
        themeButton?.setTextColor(Color.WHITE)

        pauseResumeButton?.background = GradientDrawable().apply { setColor(Color.argb(17, 255, 255, 255)); cornerRadius = dp(14).toFloat(); setStroke(dp(1), Color.argb(40, 255, 255, 255)) }
        pauseResumeButton?.setTextColor(Color.WHITE)

        closeButton?.background = GradientDrawable().apply { setColor(Color.argb(17, 255, 255, 255)); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(40, 255, 255, 255)) }
        closeButton?.setTextColor(Color.WHITE)
    }

    // ═══════════════════════════════════════════════════════
    //  APPLE LIQUID — milky translucent + 4-edge glass rim
    // ═══════════════════════════════════════════════════════
    private fun renderAppleLiquid(card: LinearLayout, isBreak: Boolean) {
        val cr = dp(20).toFloat()
        card.background = GradientDrawable().apply { setColor(Color.argb(30, 255, 255, 255)); cornerRadius = cr; setStroke(dp(1), Color.argb(40, 255, 255, 255)) }

        glassEdgeTop?.visibility = View.VISIBLE
        glassEdgeTop?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(130, 255, 255, 255), Color.argb(0, 255, 255, 255)); cornerRadii = floatArrayOf(cr, cr, cr, cr, 0f, 0f, 0f, 0f) }
        glassEdgeBottom?.visibility = View.VISIBLE
        glassEdgeBottom?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(0, 255, 255, 255), Color.argb(65, 255, 255, 255)); cornerRadii = floatArrayOf(0f, 0f, 0f, 0f, cr, cr, cr, cr) }
        glassEdgeLeft?.visibility = View.VISIBLE
        glassEdgeLeft?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(45, 255, 255, 255), Color.argb(0, 255, 255, 255)); orientation = GradientDrawable.Orientation.LEFT_RIGHT }
        glassEdgeRight?.visibility = View.VISIBLE
        glassEdgeRight?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(0, 255, 255, 255), Color.argb(45, 255, 255, 255)); orientation = GradientDrawable.Orientation.LEFT_RIGHT }
        glassInnerGlow?.visibility = View.VISIBLE
        glassInnerGlow?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(30, 255, 255, 255), Color.argb(0, 255, 255, 255)); cornerRadii = floatArrayOf(cr, cr, cr, cr, 0f, 0f, 0f, 0f) }
        val cg = GradientDrawable().apply { colors = intArrayOf(Color.argb(50, 255, 255, 255), Color.argb(0, 255, 255, 255)); shape = GradientDrawable.OVAL }
        glassCornerTL?.visibility = View.VISIBLE; glassCornerTL?.background = cg
        glassCornerTR?.visibility = View.VISIBLE; glassCornerTR?.background = cg
        val cgb = GradientDrawable().apply { colors = intArrayOf(Color.argb(20, 255, 255, 255), Color.argb(0, 255, 255, 255)); shape = GradientDrawable.OVAL }
        glassCornerBL?.visibility = View.VISIBLE; glassCornerBL?.background = cgb
        glassCornerBR?.visibility = View.VISIBLE; glassCornerBR?.background = cgb
        glassLightSweep?.visibility = View.VISIBLE
        glassLightSweep?.background = GradientDrawable().apply { colors = intArrayOf(Color.argb(45, 255, 255, 255), Color.argb(12, 255, 255, 255), Color.argb(0, 255, 255, 255), Color.argb(0, 255, 255, 255)); gradientType = GradientDrawable.LINEAR_GRADIENT; orientation = GradientDrawable.Orientation.TL_BR; cornerRadius = cr }

        progressFill?.background = GradientDrawable().apply { setColor(if (isBreak) Color.rgb(59, 130, 246) else Color.rgb(139, 92, 246)); cornerRadius = dp(2).toFloat() }
        progressContainer?.background = GradientDrawable().apply { setColor(Color.argb(12, 139, 92, 246)) }

        val textPrimary = Color.rgb(12, 12, 18)
        val textSecondary = Color.rgb(65, 65, 80)

        headingText?.setTextColor(textSecondary)
        timerText?.setTextColor(textPrimary)
        statusText?.setTextColor(textSecondary)

        val dotColor = when {
            state.timerState == "running" -> Color.parseColor("#16a34a")
            state.timerState == "paused" -> Color.parseColor("#d97706")
            state.timerState == "break" || state.activePhase == "break" -> Color.parseColor("#2563eb")
            else -> Color.parseColor("#6b7280")
        }
        statusDot?.background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(dotColor) }

        focusTypeText?.visibility = View.GONE

        // Subject label — Apple theme: dark text on light bg
        subjectLabel?.setTextColor(Color.argb(168, 12, 12, 18))

        correctButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#059669")); cornerRadius = dp(14).toFloat() }
        correctButton?.setTextColor(Color.WHITE)
        incorrectButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#e11d48")); cornerRadius = dp(14).toFloat() }
        incorrectButton?.setTextColor(Color.WHITE)
        skippedButton?.background = GradientDrawable().apply { setColor(Color.parseColor("#d97706")); cornerRadius = dp(14).toFloat() }
        skippedButton?.setTextColor(Color.WHITE)

        targetButton?.background = GradientDrawable().apply { setColor(Color.argb(204, 255, 255, 255)); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(40, 24, 24, 27)) }
        targetButton?.setTextColor(Color.parseColor("#18181b"))
        undoButton?.background = GradientDrawable().apply { setColor(Color.TRANSPARENT); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(35, 24, 24, 27)) }
        undoButton?.setTextColor(Color.argb(183, 24, 24, 27))

        themeButton?.background = GradientDrawable().apply { setColor(Color.argb(204, 255, 255, 255)); cornerRadius = dp(999).toFloat(); setStroke(dp(1), Color.argb(40, 24, 24, 27)) }
        themeButton?.setTextColor(Color.parseColor("#18181b"))

        // Pause button - glass tinted with dark text
        pauseResumeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(204, 255, 255, 255))
            cornerRadius = dp(14).toFloat()
            setStroke(dp(1), Color.argb(40, 24, 24, 27))
        }
        pauseResumeButton?.setTextColor(Color.parseColor("#18181b"))

        closeButton?.background = GradientDrawable().apply {
            setColor(Color.argb(204, 255, 255, 255))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), Color.argb(40, 24, 24, 27))
        }
        closeButton?.setTextColor(Color.parseColor("#18181b"))

        startLightSweep()
    }

    private fun hideGlassEffects() {
        glassEdgeTop?.visibility = View.GONE; glassEdgeBottom?.visibility = View.GONE
        glassEdgeLeft?.visibility = View.GONE; glassEdgeRight?.visibility = View.GONE
        glassInnerGlow?.visibility = View.GONE
        glassCornerTL?.visibility = View.GONE; glassCornerTR?.visibility = View.GONE
        glassCornerBL?.visibility = View.GONE; glassCornerBR?.visibility = View.GONE
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

        statusText?.text = when {
            state.timerState == "running" -> "Focusing..."
            state.timerState == "paused" -> "Paused"
            state.timerState == "break" || state.activePhase == "break" -> "Break"
            else -> "Idle"
        }

        // Pause/Resume button icon
        pauseResumeButton?.text = when {
            state.timerState == "running" -> "\u23f8"
            else -> "\u25b6"
        }

        questionSection?.visibility = if (state.showQuestionControls) View.VISIBLE else View.GONE
        subjectLabel?.text = "${state.focusTypeIcon} ${state.focusTypeLabel}"
        attemptedText?.text = state.questionsAttempted.toString() +
            if (state.targetQuestions > 0) " / ${state.targetQuestions}" else ""
        targetValueText?.text = "  Target ${state.targetQuestions}  "
        correctButton?.text = "\u2713  ${state.questionsCorrect}"
        incorrectButton?.text = "\u2715  ${state.questionsIncorrect}"
        skippedButton?.text = "Skip  ${state.questionsSkipped}"
        undoButton?.isEnabled = state.undoAvailable
        undoButton?.alpha = if (state.undoAvailable) 1f else 0.45f

        val ratio = when {
            state.mode == "stopwatch" -> Math.min(1f, (seconds % (25 * 60)).toFloat() / (25 * 60))
            state.totalSeconds > 0 -> Math.max(0f, Math.min(1f, seconds.toFloat() / state.totalSeconds))
            else -> 0f
        }
        progressFill?.post { progressFill?.scaleX = ratio }

        // Pulse animation on status dot when running (matches PC PiP CSS pulse)
        statusDot?.animate()?.cancel()
        if (state.timerState == "running") {
            statusDot?.animate()?.alpha(0.5f)?.setDuration(1000)
                ?.setInterpolator(android.view.animation.AccelerateDecelerateInterpolator())
                ?.withEndAction {
                    statusDot?.animate()?.alpha(1f)?.setDuration(1000)
                        ?.setInterpolator(android.view.animation.AccelerateDecelerateInterpolator())
                        ?.withEndAction { /* repeat handled by next tick */ }
                        ?.start()
                }
                ?.start()
        } else {
            statusDot?.alpha = 1f
        }

        scaleButtonsToOverlay()
    }

    private fun scaleButtonsToOverlay() {
        val lp = layoutParams ?: return
        val w = lp.width.toFloat()
        val h = lp.height.toFloat()
        val scale = Math.min(
            Math.max(0.65f, Math.min(1.4f, w / dp(340))),
            Math.max(0.65f, Math.min(1.4f, h / dp(390)))
        )

        timerText?.textSize = Math.max(24f, 50f * scale)
        headingText?.textSize = Math.max(10f, 14f * scale)
        statusText?.textSize = Math.max(10f, 14f * scale)

        val btnH = Math.max(dp(28), (dp(40) * scale).toInt())
        val btnTextSize = Math.max(9f, 12f * scale)
        listOf(correctButton, incorrectButton, skippedButton).forEach { btn ->
            btn?.let {
                (it.layoutParams as? LinearLayout.LayoutParams)?.let { p -> p.height = btnH; p.weight = 1f; it.layoutParams = p }
                it.textSize = btnTextSize
                (it.background as? GradientDrawable)?.cornerRadius = dp(14).toFloat()
            }
        }

        val pillH = Math.max(dp(28), (dp(36) * scale).toInt())
        listOf(targetButton, undoButton, themeButton).forEach { btn ->
            btn?.let {
                (it.layoutParams as? LinearLayout.LayoutParams)?.let { p -> p.height = pillH; it.layoutParams = p }
                it.textSize = Math.max(9f, 12f * scale)
            }
        }

        val pad = Math.max(dp(12), (20 * scale).toInt())
        contentView?.setPadding(pad, pad, pad, pad)
    }

    private fun handleDragTouch(view: View, event: MotionEvent): Boolean {
        val lp = layoutParams ?: return false
        val wm = windowManager ?: return false
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                dragging = false; touchStartX = event.rawX; touchStartY = event.rawY
                windowStartX = lp.x; windowStartY = lp.y; return true
            }
            MotionEvent.ACTION_MOVE -> {
                val dx = Math.round(event.rawX - touchStartX); val dy = Math.round(event.rawY - touchStartY)
                if (Math.abs(dx) > dp(3) || Math.abs(dy) > dp(3)) {
                    dragging = true; lp.x = windowStartX + dx; lp.y = Math.max(0, windowStartY + dy)
                    try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
                }
                return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (dragging) getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putInt(PREF_X, lp.x).putInt(PREF_Y, lp.y).apply()
                dragging = false; return false
            }
        }
        return false
    }

    private fun handleResizeTouch(view: View, event: MotionEvent): Boolean {
        val lp = layoutParams ?: return false
        val wm = windowManager ?: return false
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                resizing = true; touchStartX = event.rawX; touchStartY = event.rawY
                resizeStartWidth = lp.width; resizeStartHeight = lp.height; return true
            }
            MotionEvent.ACTION_MOVE -> {
                if (!resizing) return true
                lp.width = clampOverlayWidth(resizeStartWidth + Math.round(event.rawX - touchStartX))
                lp.height = clampOverlayHeight(resizeStartHeight + Math.round(event.rawY - touchStartY))
                try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
                scaleButtonsToOverlay(); return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (resizing) {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putInt(PREF_WIDTH, lp.width).putInt(PREF_HEIGHT, lp.height).apply()
                    scaleButtonsToOverlay()
                }
                resizing = false; return true
            }
        }
        return false
    }

    private fun updateTargetBy(delta: Int) { setTarget(Math.max(0, Math.min(9999, state.targetQuestions + delta))) }

    private fun showTargetDialog() {
        val input = EditText(this).apply {
            inputType = InputType.TYPE_CLASS_NUMBER; isSingleLine = true
            setText(if (state.targetQuestions > 0) state.targetQuestions.toString() else "")
            setSelectAllOnFocus(true); setPadding(dp(20), dp(12), dp(20), dp(12))
        }
        val dialog = AlertDialog.Builder(this).setTitle("Set target questions").setView(input)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Set") { _, _ -> var v = 0; try { v = input.text.toString().trim().toInt() } catch (ignored: Exception) {}; setTarget(Math.max(0, Math.min(9999, v))) }
            .create()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && dialog.window != null) dialog.window!!.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
        dialog.setOnShowListener { if (dialog.window != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) dialog.window!!.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY); input.requestFocus() }
        try { dialog.show() } catch (ignored: Exception) { updateTargetBy(5) }
    }

    private fun setTarget(value: Int) { state.targetQuestions = Math.max(0, Math.min(9999, value)); PipClient.postAction(this, "setTarget", state.targetQuestions); renderDynamicFields() }

    private fun resizeOverlay(w: Int, h: Int) {
        val lp = layoutParams ?: return; val wm = windowManager ?: return
        lp.width = clampOverlayWidth(w); lp.height = clampOverlayHeight(h)
        try { wm.updateViewLayout(rootView, lp) } catch (ignored: Exception) {}
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putInt(PREF_WIDTH, lp.width).putInt(PREF_HEIGHT, lp.height).apply()
        scaleButtonsToOverlay()
    }

    private fun formatSeconds(totalSeconds: Int): String {
        val s = Math.max(0, totalSeconds); val d = s / 86400; val h = (s % 86400) / 3600; val m = (s % 3600) / 60; val sec = s % 60
        val two = { v: Int -> if (v < 10) "0$v" else v.toString() }
        if (d > 0) return "${d}d $h:${two(m)}:${two(sec)}"
        if (h > 0) return "$h:${two(m)}:${two(sec)}"
        return "$m:${two(sec)}"
    }

    private fun startLightSweep() {
        val sweep = glassLightSweep ?: return
        sweep.alpha = 0f; sweep.translationX = -sweep.width.toFloat() - dp(100).toFloat()
        sweep.animate().translationX(sweep.width.toFloat() + dp(100).toFloat()).alpha(0.5f).setDuration(2500)
            .setInterpolator(android.view.animation.AccelerateDecelerateInterpolator())
            .withEndAction { sweep.animate().alpha(0f).setDuration(800).start() }.start()
    }

    private fun dp(value: Int): Int = Math.round(value * resources.displayMetrics.density)

    private fun clampOverlayWidth(value: Int): Int {
        val screenW = resources.displayMetrics.widthPixels
        val max = if (resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE)
            Math.max(dp(280), (screenW * 0.36f).toInt())
        else Math.max(dp(280), Math.min(dp(440), screenW - dp(24)))
        return Math.max(dp(240), Math.min(max, value))
    }

    private fun clampOverlayHeight(value: Int): Int {
        val screenH = resources.displayMetrics.heightPixels
        return Math.max(dp(200), Math.min(Math.max(dp(240), (screenH * 0.70f).toInt()), value))
    }
}
