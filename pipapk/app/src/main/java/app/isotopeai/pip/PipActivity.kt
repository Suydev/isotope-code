package app.isotopeai.pip

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
 */
class PipActivity : Activity() {

    private lateinit var root: FrameLayout
    private lateinit var cardView: LinearLayout
    private lateinit var progressFill: View
    private lateinit var headingText: TextView
    private lateinit var timerText: TextView
    private lateinit var statusDot: TextView
    private lateinit var statusText: TextView
    private lateinit var focusChip: TextView
    private lateinit var attemptedText: TextView
    private lateinit var targetButton: Button
    private lateinit var correctButton: Button
    private lateinit var incorrectButton: Button
    private lateinit var skippedButton: Button
    private lateinit var undoButton: Button
    private lateinit var actionButtons: LinearLayout
    private lateinit var expandButton: Button
    private lateinit var closeButton: Button

    private lateinit var overlayRow: LinearLayout
    private lateinit var overlayChip: TextView
    private lateinit var notifRow: LinearLayout
    private lateinit var notifChip: TextView
    private lateinit var batteryRow: LinearLayout
    private lateinit var batteryChip: TextView

    private lateinit var floatToggle: Button

    private var tickerRunning = false
    private var inPip = false
    private var autoEnterPip = true
    private var lastState: PipState? = null
    private var serverUp = false

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
        refreshPermissionRows()
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
        refreshPermissionRows()
        refreshPiPParams()
    }

    override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean, newConfig: Configuration) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        inPip = isInPictureInPictureMode
        if (isInPictureInPictureMode) {
            StateHub.addListener(stateListener)
            startTicker()
        } else {
            refreshPermissionRows()
        }
    }

    override fun onDestroy() {
        stopTicker()
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

        cardView = LinearLayout(this)
        cardView.orientation = LinearLayout.VERTICAL
        cardView.background = roundedCard(Colors.ZINC_950, 25)
        cardView.gravity = Gravity.CENTER_HORIZONTAL

        // Progress strip
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
        content.setPadding(dp(16), dp(12), dp(16), dp(16))

        // Header: heading + expand + close
        val header = LinearLayout(this)
        header.orientation = LinearLayout.HORIZONTAL
        header.gravity = Gravity.CENTER_VERTICAL
        headingText = text(11, true).apply {
            letterSpacing = 0.08f
            setTextColor(Colors.MUTED_DARK)
            text = "ISOTOPE PIP"
        }
        header.addView(headingText, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        expandButton = iconButton("↗") { expandWindow() }
        closeButton = iconButton("×") { closePip() }
        header.addView(expandButton)
        header.addView(closeButton)
        content.addView(header)

        // Focus chip
        focusChip = text(13, true).apply {
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(5), dp(12), dp(5))
            background = pill(Color.argb(30, 139, 92, 246), Color.argb(50, 139, 92, 246))
            setTextColor(Color.rgb(196, 181, 253))
        }
        val chipLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        chipLp.gravity = Gravity.CENTER_HORIZONTAL
        chipLp.topMargin = dp(6)
        chipLp.bottomMargin = dp(4)
        content.addView(focusChip, chipLp)

        // Timer
        timerText = text(40, true).apply {
            gravity = Gravity.CENTER
            typeface = Typeface.MONOSPACE
            letterSpacing = -0.02f
            setTextColor(Color.WHITE)
        }
        val timerLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        timerLp.topMargin = dp(2)
        timerLp.bottomMargin = dp(4)
        content.addView(timerText, timerLp)

        // Status row
        val statusRow = LinearLayout(this)
        statusRow.orientation = LinearLayout.HORIZONTAL
        statusRow.gravity = Gravity.CENTER
        statusDot = text(10, true)
        statusText = text(11, false).apply { letterSpacing = 0.05f; setTextColor(Colors.MUTED_DARK) }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)
        content.addView(statusRow)

        // ── Question tracking section ──────────────────────────────────────
        actionButtons = LinearLayout(this)
        actionButtons.orientation = LinearLayout.VERTICAL

        val attemptRow = LinearLayout(this)
        attemptRow.orientation = LinearLayout.HORIZONTAL
        attemptRow.gravity = Gravity.CENTER_VERTICAL
        attemptedText = text(24, true).apply { setTextColor(Color.WHITE) }
        targetButton = pillButton("Target") { showTargetDialog() }
        attemptRow.addView(attemptedText, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetButton)
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
            background = pill(Color.TRANSPARENT, Color.argb(36, 255, 255, 255))
        }
        undoButton.setOnClickListener { PipBridgeService.postAction("undo", -1) }
        val undoLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(36))
        undoLp.topMargin = dp(6)
        actionButtons.addView(undoButton, undoLp)

        val qs = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        qs.topMargin = dp(10)
        content.addView(actionButtons, qs)

        // Floating mode toggle
        floatToggle = Button(this).apply {
            text = "Floating mode (over other apps)"
            isAllCaps = false
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = pill(Color.argb(30, 139, 92, 246), Color.TRANSPARENT)
            setOnClickListener { toggleFloatingMode() }
        }
        val ftLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(38))
        ftLp.topMargin = dp(12)
        content.addView(floatToggle, ftLp)

        cardView.addView(content, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(cardView, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))

        // ── Permission panel ───────────────────────────────────────────────
        val panel = LinearLayout(this)
        panel.orientation = LinearLayout.VERTICAL
        panel.setPadding(dp(24), dp(24), dp(24), dp(24))
        panel.visibility = View.GONE

        val title = text(16, true).apply {
            text = "Isotope PiP — permissions"
            setTextColor(Color.WHITE)
        }
        val subtitle = text(12, false).apply {
            text = "These make the timer work everywhere: PiP window, floating card above other apps, and background updates."
            setTextColor(Colors.MUTED_DARK)
        }
        panel.addView(title)
        val subLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        subLp.topMargin = dp(4)
        subLp.bottomMargin = dp(12)
        panel.addView(subtitle, subLp)

        overlayRow = buildPermissionRow(panel, "Display over other apps", "Floating card above every app") {
            openOverlaySettings()
        }
        notifRow = buildPermissionRow(panel, "Notifications", "Timer status in the notification bar") {
            requestNotificationPermission()
        }
        batteryRow = buildPermissionRow(panel, "Background running", "Keep the timer live with the screen off") {
            requestBatteryExemption()
        }
        overlayChip = overlayRow.getChildAt(0) as TextView
        notifChip = notifRow.getChildAt(0) as TextView
        batteryChip = batteryRow.getChildAt(0) as TextView

        root.addView(panel, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))

        setContentView(root)
    }

    private fun buildPermissionRow(container: LinearLayout, title: String, desc: String, onClick: () -> Unit): LinearLayout {
        val row = LinearLayout(this)
        row.orientation = LinearLayout.HORIZONTAL
        row.gravity = Gravity.CENTER_VERTICAL
        row.setPadding(0, dp(8), 0, dp(8))
        val chip = TextView(this).apply {
            text = "○"
            textSize = 14f
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
        val lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        container.addView(row, lp)
        return row
    }

    // ───────────────────────── Rendering ───────────────────────────────────

    private fun render() {
        val st = lastState
        if (st == null) {
            timerText.text = "--:--"
            statusText.text = "Server offline"
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

    private fun refreshPermissionRows() {
        val panel = (root.getChildAt(root.childCount - 1)) // last child = panel
        val anyMissing = !hasOverlayPermission() || !hasNotifPermission() || !isIgnoringBatteryOptimizations()
        panel.visibility = if (anyMissing) View.VISIBLE else View.GONE

        setPermissionChip(overlayChip, hasOverlayPermission())
        setPermissionChip(notifChip, hasNotifPermission())
        setPermissionChip(batteryChip, isIgnoringBatteryOptimizations())
    }

    private fun setPermissionChip(chip: TextView, granted: Boolean) {
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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (!hasNotifPermission()) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), REQ_NOTIF)
            }
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
                Toast.makeText(this, "Notification denied — timer still works, but no status notification", Toast.LENGTH_LONG).show()
            }
            refreshPermissionRows()
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
        textSize = 16f
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

    private fun roundedCard(bg: Int, strokeAlpha: Int) = GradientDrawable().apply {
        setColor(bg)
        cornerRadius = dp(24).toFloat()
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