package app.isotopeai.pip

import android.animation.ObjectAnimator
import android.app.Activity
import android.app.AlertDialog
import android.app.PictureInPictureParams
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.text.InputType
import android.util.Rational
import android.view.Choreographer
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

/**
 * Isotope PiP card. Renders exclusively from StateHub (populated by
 * PipBridgeService's 10ms poller against the localhost server) using a 10ms
 * Choreographer ticker that extrapolates time locally — zero network per
 * frame. Owns PiP lifecycle, the permission UX (display-over-other-apps,
 * notifications, battery exemption) and the floating overlay toggle.
 *
 * Layout: two full screens — the compact timer card (also the PiP content)
 * and a centered permission card shown until every permission is granted.
 * They never overlap.
 */
class PipActivity : Activity() {

    private lateinit var root: FrameLayout
    private lateinit var cardScreen: FrameLayout
    private lateinit var permScreen: FrameLayout

    private lateinit var cardView: LinearLayout
    private lateinit var progressFill: View
    private lateinit var headingText: TextView
    private lateinit var timerText: TextView
    private lateinit var statusDot: TextView
    private lateinit var statusText: TextView
    private lateinit var focusChip: TextView
    private lateinit var attemptedText: TextView
    private lateinit var correctButton: Button
    private lateinit var incorrectButton: Button
    private lateinit var skippedButton: Button
    private lateinit var undoButton: Button
    private lateinit var actionButtons: LinearLayout
    private lateinit var floatToggle: Button

    private lateinit var permChipOverlay: TextView
    private lateinit var permChipNotif: TextView
    private lateinit var permChipBattery: TextView

    private var tickerRunning = false
    private var inPip = false
    private var autoEnterPip = true
    private var lastState: PipState? = null
    private var serverUp = false
    private var pulse: ObjectAnimator? = null

    private val stateListener: (PipState?) -> Unit = { st ->
        serverUp = StateHub.serverUp
        if (st != null) {
            lastState = st
            if (!tickerRunning) startTicker()
            maybeAutoEnterPip(st)
        }
    }

    private val ticker = object : Choreographer.FrameCallback {
        override fun doFrame(frameTimeNanos: Long) {
            render()
            Choreographer.getInstance().postFrameCallback(this)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        buildUi()
        startBridgeService()
        refreshPermissionScreens()
    }

    override fun onStart() {
        super.onStart()
        StateHub.addListener(stateListener)
        startTicker()
        if (!isInPictureInPictureMode) autoEnterPip = true
    }

    override fun onStop() {
        super.onStop()
        if (!inPip) {
            stopTicker()
            StateHub.removeListener(stateListener)
        }
    }

    override fun onResume() {
        super.onResume()
        refreshPermissionScreens()
        refreshPiPParams()
    }

    override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean, newConfig: Configuration) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        inPip = isInPictureInPictureMode
        if (isInPictureInPictureMode) {
            StateHub.addListener(stateListener)
            startTicker()
            cardScreen.visibility = View.VISIBLE
            permScreen.visibility = View.GONE
        } else {
            refreshPermissionScreens()
        }
    }

    override fun onDestroy() {
        stopTicker()
        pulse?.cancel()
        StateHub.removeListener(stateListener)
        super.onDestroy()
    }

    // ───────────────────────── Lifecycle helpers ───────────────────────────

    private fun startBridgeService() {
        try {
            startForegroundService(Intent(this, PipBridgeService::class.java))
        } catch (e: Exception) {
            Toast.makeText(this, "Foreground service blocked", Toast.LENGTH_SHORT).show()
        }
    }

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

    private fun dp(v: Int): Int = Math.round(v * resources.displayMetrics.density)

    // ───────────────────────── UI construction ─────────────────────────────

    private fun buildUi() {
        root = FrameLayout(this)
        root.setBackgroundColor(Color.rgb(9, 9, 11))

        // ── Card screen: compact centered card ────────────────────────────
        cardScreen = FrameLayout(this)
        cardScreen.gravity = Gravity.CENTER
        cardScreen.addView(buildCardScreen())
        root.addView(cardScreen, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))

        // ── Permission screen: shown until everything is granted ──────────
        permScreen = FrameLayout(this)
        permScreen.gravity = Gravity.CENTER
        permScreen.addView(buildPermissionScreen())
        root.addView(permScreen, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))

        setContentView(root)
    }

    private fun buildCardScreen(): View {
        val cardWidth = Math.min(dp(400), resources.displayMetrics.widthPixels - dp(36))

        val wrap = LinearLayout(this)
        wrap.orientation = LinearLayout.VERTICAL
        wrap.gravity = Gravity.CENTER_HORIZONTAL

        cardView = LinearLayout(this)
        cardView.orientation = LinearLayout.VERTICAL
        cardView.background = roundedCard(Colors.ZINC_950, 22, 26)
        cardView.elevation = dp(12).toFloat()
        cardView.gravity = Gravity.CENTER_HORIZONTAL

        // Progress strip (4dp, brand/sky) on top
        val strip = FrameLayout(this)
        strip.setBackgroundColor(Color.argb(20, 139, 92, 246))
        progressFill = View(this).apply {
            setScaleX(0f)
            setPivotX(0f)
            background = GradientDrawable().apply { setColor(Colors.BRAND_500) }
        }
        strip.addView(progressFill, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        cardView.addView(strip, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(4)))

        val content = LinearLayout(this)
        content.orientation = LinearLayout.VERTICAL
        content.setPadding(dp(18), dp(14), dp(18), dp(18))

        // Header: heading + expand + close
        val header = LinearLayout(this)
        header.orientation = LinearLayout.HORIZONTAL
        header.gravity = Gravity.CENTER_VERTICAL
        headingText = text(10, true).apply {
            letterSpacing = 0.1f
            setTextColor(Colors.MUTED_DARK)
            text = "ISOTOPE PIP"
        }
        header.addView(headingText, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        header.addView(iconButton("↗") { expandWindow() })
        header.addView(iconButton("×") { closePip() })
        content.addView(header)

        // Focus chip
        focusChip = text(13, true).apply {
            gravity = Gravity.CENTER
            setPadding(dp(14), dp(6), dp(14), dp(6))
            background = pill(Color.argb(28, 139, 92, 246), Color.argb(45, 139, 92, 246))
            setTextColor(Color.rgb(196, 181, 253))
        }
        val chipLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        chipLp.gravity = Gravity.CENTER_HORIZONTAL
        chipLp.topMargin = dp(10)
        chipLp.bottomMargin = dp(2)
        content.addView(focusChip, chipLp)

        // Timer — large, tabular
        timerText = TextView(this).apply {
            textSize = 42f
            typeface = Typeface.create("sans-serif-condensed", Typeface.BOLD)
            gravity = Gravity.CENTER
            includeFontPadding = false
            setTextColor(Color.WHITE)
        }
        val timerLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        timerLp.topMargin = dp(6)
        content.addView(timerText, timerLp)

        // Status row: pulsing dot + label
        val statusRow = LinearLayout(this)
        statusRow.orientation = LinearLayout.HORIZONTAL
        statusRow.gravity = Gravity.CENTER
        statusDot = text(11, true)
        statusText = text(11, false).apply {
            letterSpacing = 0.06f
            setTextColor(Colors.MUTED_DARK)
        }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)
        content.addView(statusRow)

        // ── Question tracking section ─────────────────────────────────────
        actionButtons = LinearLayout(this)
        actionButtons.orientation = LinearLayout.VERTICAL

        val attemptRow = LinearLayout(this)
        attemptRow.orientation = LinearLayout.HORIZONTAL
        attemptRow.gravity = Gravity.CENTER_VERTICAL
        attemptedText = text(26, true).apply { setTextColor(Color.WHITE) }
        attemptRow.addView(attemptedText, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(pillButton("Target") { showTargetDialog() })
        actionButtons.addView(attemptRow)

        val editorRow = LinearLayout(this)
        editorRow.orientation = LinearLayout.HORIZONTAL
        editorRow.gravity = Gravity.CENTER
        editorRow.addView(pillButton("−5") { adjustTarget(-5) })
        editorRow.addView(pillButton("+5") { adjustTarget(5) })
        editorRow.addView(pillButton("0") { PipBridgeService.postAction("setTarget", 0) })
        actionButtons.addView(editorRow)

        val resultRow = LinearLayout(this)
        resultRow.orientation = LinearLayout.HORIZONTAL
        resultRow.gravity = Gravity.CENTER
        correctButton = resultButton("✓") { PipBridgeService.postAction("correct", -1) }
        incorrectButton = resultButton("✕") { PipBridgeService.postAction("incorrect", -1) }
        skippedButton = resultButton("↷") { PipBridgeService.postAction("skipped", -1) }
        resultRow.addView(correctButton, weightParams(1f, 0, dp(6)))
        resultRow.addView(incorrectButton, weightParams(1f, 0, dp(6)))
        resultRow.addView(skippedButton, weightParams(1f, 0, 0))
        val rr = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        rr.topMargin = dp(6)
        actionButtons.addView(resultRow, rr)

        undoButton = pillButton("Undo last").apply {
            setTextColor(Color.WHITE)
            background = pill(Color.TRANSPARENT, Color.argb(38, 255, 255, 255))
        }
        undoButton.setOnClickListener { PipBridgeService.postAction("undo", -1) }
        val undoLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(38))
        undoLp.topMargin = dp(6)
        actionButtons.addView(undoButton, undoLp)

        val qs = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        qs.topMargin = dp(12)
        content.addView(actionButtons, qs)

        // Floating mode toggle
        floatToggle = Button(this).apply {
            text = "Floating mode (over other apps)"
            isAllCaps = false
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(196, 181, 253))
            background = pill(Color.argb(28, 139, 92, 246), Color.TRANSPARENT)
            setOnClickListener { toggleFloatingMode() }
        }
        val ftLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40))
        ftLp.topMargin = dp(12)
        content.addView(floatToggle, ftLp)

        cardView.addView(content, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        wrap.addView(cardView, LinearLayout.LayoutParams(cardWidth, ViewGroup.LayoutParams.WRAP_CONTENT))
        return wrap
    }

    private fun buildPermissionScreen(): View {
        val cardWidth = Math.min(dp(360), resources.displayMetrics.widthPixels - dp(48))

        val wrap = LinearLayout(this)
        wrap.orientation = LinearLayout.VERTICAL
        wrap.gravity = Gravity.CENTER_HORIZONTAL

        val card = LinearLayout(this)
        card.orientation = LinearLayout.VERTICAL
        card.setPadding(dp(24), dp(24), dp(24), dp(24))
        card.background = roundedCard(Colors.ZINC_950, 22, 26)
        card.elevation = dp(12).toFloat()

        val title = text(18, true).apply { text = "Isotope PiP"; setTextColor(Color.WHITE) }
        card.addView(title)
        val sub = text(12, false).apply {
            text = "A floating timer companion. Grant these so it can work everywhere:"
            setTextColor(Colors.MUTED_DARK)
        }
        val subLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        subLp.topMargin = dp(4)
        subLp.bottomMargin = dp(14)
        card.addView(sub, subLp)

        card.addView(permRow("Display over other apps", "Floating card above every app") { openOverlaySettings() }.let { it.first })
        permChipOverlay = card.getChildAt(card.childCount - 1).let { permRowChip(it) }
        card.addView(permRow("Notifications", "Timer status in the notification bar") { requestNotificationPermission() }.let { it.first })
        permChipNotif = permRowChip(card.getChildAt(card.childCount - 1))
        card.addView(permRow("Background running", "Keep the timer live with the screen off") { requestBatteryExemption() }.let { it.first })
        permChipBattery = permRowChip(card.getChildAt(card.childCount - 1))

        val done = Button(this).apply {
            text = "Done"
            isAllCaps = false
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = pill(Colors.BRAND_500, Color.TRANSPARENT)
            setOnClickListener { refreshPermissionScreens() }
        }
        val doneLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44))
        doneLp.topMargin = dp(16)
        card.addView(done, doneLp)

        wrap.addView(card, LinearLayout.LayoutParams(cardWidth, ViewGroup.LayoutParams.WRAP_CONTENT))
        return wrap
    }

    private fun permRowChip(row: LinearLayout): TextView = row.getChildAt(0) as TextView

    /** Returns the row (already containing its chip) so callers can extract it. */
    private fun permRow(title: String, desc: String, onClick: () -> Unit): Pair<LinearLayout, TextView> {
        val row = LinearLayout(this)
        row.orientation = LinearLayout.HORIZONTAL
        row.gravity = Gravity.CENTER_VERTICAL
        row.setPadding(0, dp(10), 0, dp(10))

        val chip = TextView(this).apply {
            text = "○"
            textSize = 15f
            setTextColor(Colors.MUTED_DARK)
        }
        val texts = LinearLayout(this)
        texts.orientation = LinearLayout.VERTICAL
        val t = text(13, true).apply { text = title; setTextColor(Color.WHITE) }
        val d = text(11, false).apply { text = desc; setTextColor(Colors.MUTED_DARK) }
        texts.addView(t)
        texts.addView(d)
        val btn = Button(this).apply {
            text = "Grant"
            isAllCaps = false
            textSize = 11f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = pill(Colors.BRAND_500, Color.TRANSPARENT)
            setOnClickListener { onClick() }
        }
        val btnLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(34))
        btnLp.leftMargin = dp(12)

        row.addView(chip)
        row.addView(texts, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f).apply { leftMargin = dp(10) })
        row.addView(btn, btnLp)
        return row to chip
    }

    // ───────────────────────── Rendering ───────────────────────────────────

    private fun render() {
        val st = lastState
        if (st == null) {
            timerText.text = "--:--"
            statusText.text = if (serverUp) "Loading…" else "Server offline"
            return
        }
        val isBreak = st.isBreak
        (progressFill.background as? GradientDrawable)?.setColor(if (isBreak) Colors.SKY_400 else Colors.BRAND_500)

        headingText.text = when {
            st.mode == "stopwatch" -> "STOPWATCH"
            st.pomodoroCycle > 0 -> "POMODORO  ${st.pomodoroCycle} / ${st.pomodoroSessionsUntilLongBreak}"
            else -> "POMODORO"
        }

        timerText.text = PipState.formatSeconds(st.secondsNow())

        val (dotColor, label) = when {
            !serverUp -> Colors.ZINC_500 to "Server offline"
            st.timerState == "running" -> Colors.EMERALD_500 to "FOCUSING"
            st.timerState == "paused" -> Colors.AMBER_500 to "PAUSED"
            isBreak -> Colors.BLUE_500 to "BREAK"
            else -> Colors.ZINC_500 to "IDLE"
        }
        statusDot.text = "● "
        statusDot.setTextColor(dotColor)
        statusText.text = label

        if (st.isRunning && !inPip) {
            if (pulse == null) {
                pulse = ObjectAnimator.ofFloat(statusDot, "alpha", 1f, 0.35f).apply {
                    duration = 900
                    repeatMode = android.animation.ValueAnimator.REVERSE
                    repeatCount = android.animation.ValueAnimator.INFINITE
                }
            }
            pulse?.start()
        } else {
            pulse?.cancel()
            statusDot.alpha = 1f
        }

        focusChip.text = buildString {
            if (st.focusTypeIcon.isNotEmpty()) append(st.focusTypeIcon).append("  ")
            append(st.focusTypeLabel.ifEmpty { "Focus" })
        }

        actionButtons.visibility = if (st.showQuestionControls) View.VISIBLE else View.GONE
        attemptedText.text = buildString {
            append(st.questionsAttempted)
            if (st.targetQuestions > 0) append(" / ").append(st.targetQuestions)
        }
        correctButton.text = "✓  ${st.questionsCorrect}"
        incorrectButton.text = "✕  ${st.questionsIncorrect}"
        skippedButton.text = "↷  ${st.questionsSkipped}"
        undoButton.isEnabled = st.undoAvailable
        undoButton.alpha = if (st.undoAvailable) 1f else 0.4f

        val ratio = when {
            st.mode == "stopwatch" -> (st.secondsNow() % (25 * 60)).toFloat() / (25 * 60)
            st.totalSeconds > 0 -> (st.secondsNow().toFloat() / st.totalSeconds).coerceIn(0f, 1f)
            else -> 0f
        }
        progressFill.post { progressFill.setScaleX(ratio) }
    }

    // ───────────────────────── Permissions ─────────────────────────────────

    private fun hasOverlayPermission(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)

    private fun hasNotifPermission(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    private fun isIgnoringBatteryOptimizations(): Boolean =
        getSystemService(android.os.PowerManager::class.java).isIgnoringBatteryOptimizations(packageName)

    private fun allPermissionsGranted(): Boolean =
        hasOverlayPermission() && hasNotifPermission() && isIgnoringBatteryOptimizations()

    private fun refreshPermissionScreens() {
        if (inPip) return
        val granted = allPermissionsGranted()
        cardScreen.visibility = if (granted) View.VISIBLE else View.GONE
        permScreen.visibility = if (granted) View.GONE else View.VISIBLE
        setPermChip(permChipOverlay, hasOverlayPermission())
        setPermChip(permChipNotif, hasNotifPermission())
        setPermChip(permChipBattery, isIgnoringBatteryOptimizations())
        floatToggle.text = if (hasOverlayPermission()) "Floating mode (over other apps)" else "Floating mode — grant overlay permission"
    }

    private fun setPermChip(chip: TextView, granted: Boolean) {
        chip.text = if (granted) "●" else "○"
        chip.setTextColor(if (granted) Colors.EMERALD_500 else Colors.MUTED_DARK)
    }

    private fun openOverlaySettings() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return
        startActivity(
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        )
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !hasNotifPermission()) {
            requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), REQ_NOTIF)
        }
    }

    private fun requestBatteryExemption() {
        if (isIgnoringBatteryOptimizations()) return
        try {
            startActivity(
                Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName"))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        } catch (e: Exception) {
            startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_NOTIF) {
            if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Notification denied — timer still works, just no status notification", Toast.LENGTH_LONG).show()
            }
            refreshPermissionScreens()
        }
    }

    // ───────────────────────── Floating overlay ────────────────────────────

    private fun toggleFloatingMode() {
        if (hasOverlayPermission()) {
            startService(Intent(this, FloatingOverlayService::class.java))
            Toast.makeText(this, "Floating card started — drag it anywhere", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Grant 'Display over other apps' first", Toast.LENGTH_SHORT).show()
            openOverlaySettings()
        }
    }

    // ───────────────────────── PiP ─────────────────────────────────────────

    private fun refreshPiPParams() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val builder = PictureInPictureParams.Builder()
            .setAspectRatio(safeRatio(340, 390))
            .setSourceRectHint(
                android.graphics.Rect(0, 0, Math.max(1, root.width), Math.max(1, root.height))
            )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            builder.setAutoEnterEnabled(true)
        }
        try {
            setPictureInPictureParams(builder.build())
        } catch (e: Exception) { /* ignore */ }
    }

    private fun maybeAutoEnterPip(st: PipState) {
        if (!autoEnterPip || inPip) return
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)) return
        if (st.active && st.isRunning) {
            autoEnterPip = false
            try {
                enterPictureInPictureMode(
                    PictureInPictureParams.Builder()
                        .setAspectRatio(safeRatio(340, 390))
                        .build()
                )
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun safeRatio(w: Int, h: Int): Rational {
        val width = w.coerceAtLeast(1)
        val height = h.coerceAtLeast(1)
        val ratio = width.toDouble() / height
        return when {
            ratio < 1.0 / 2.39 -> Rational(100, 239)
            ratio > 2.39 -> Rational(239, 100)
            else -> Rational(width, height)
        }
    }

    private fun expandWindow() {
        PipBridgeService.postAction("expand", -1)
        if (inPip && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try { moveTaskToBack(true) } catch (e: Exception) {}
        }
    }

    private fun closePip() {
        PipBridgeService.postAction("close", -1)
        autoEnterPip = false
        if (inPip && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try { moveTaskToBack(true) } catch (e: Exception) { finish() }
        } else {
            finish()
        }
    }

    // ───────────────────────── Actions ─────────────────────────────────────

    private fun adjustTarget(delta: Int) {
        val cur = lastState?.targetQuestions ?: 0
        PipBridgeService.postAction("setTarget", (cur + delta).coerceIn(0, 9999))
    }

    private fun showTargetDialog() {
        val input = EditText(this)
        input.inputType = InputType.TYPE_CLASS_NUMBER
        input.setText((lastState?.targetQuestions ?: 0).toString())
        AlertDialog.Builder(this)
            .setTitle("Set target questions")
            .setView(input)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Set") { _, _ ->
                val v = input.text.toString().trim().toIntOrNull() ?: 0
                PipBridgeService.postAction("setTarget", v)
            }
            .show()
    }

    // ───────────────────────── View factories ──────────────────────────────

    private fun text(sp: Int, bold: Boolean) = TextView(this).apply {
        textSize = sp.toFloat()
        includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
    }

    private fun iconButton(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 15f
        typeface = Typeface.DEFAULT_BOLD
        setPadding(dp(8), 0, dp(8), 0)
        setTextColor(Colors.MUTED_DARK)
        background = pill(Color.argb(15, 255, 255, 255), Color.TRANSPARENT)
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(dp(38), dp(30))
    }

    private fun pillButton(label: String, onClick: () -> Unit = {}) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        background = pill(Colors.BRAND_500, Color.TRANSPARENT)
        setPadding(dp(10), 0, dp(10), 0)
        setOnClickListener { onClick() }
    }

    private fun resultButton(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 13f
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

    private fun roundedCard(bg: Int, radiusDp: Int, strokeAlpha: Int) = GradientDrawable().apply {
        setColor(bg)
        cornerRadius = dp(radiusDp).toFloat()
        if (strokeAlpha > 0) setStroke(dp(1), Color.argb(strokeAlpha, 255, 255, 255))
    }

    private fun weightParams(weight: Float, leftMargin: Int, rightMargin: Int): LinearLayout.LayoutParams {
        val lp = LinearLayout.LayoutParams(0, dp(44), weight)
        lp.setMargins(leftMargin, 0, rightMargin, 0)
        return lp
    }

    companion object {
        private const val REQ_NOTIF = 100
    }
}