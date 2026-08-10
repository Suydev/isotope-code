package app.isotopeai.pip

import android.app.Activity
import android.app.AlertDialog
import android.app.PictureInPictureParams
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.text.InputType
import android.util.Rational
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
 * Native PiP companion — pipapk.md Option A (RECOMMENDED). No WebView.
 *
 * The whole UI of this app is the focus-timer card. It polls
 * GET /api/pip/state every 750ms (server is the state owner — the /focus page
 * relays its store), renders the card natively, and POSTs user actions to
 * /api/pip/action which the page applies to the REAL store.
 * Enters system PiP (aspect 340:390, matching the web PiP canvas) automatically
 * while the timer is active; shows "server offline" + last-known state when the
 * server is down. A small "Float" button lifts the same card into the
 * display-over-other-apps overlay (FloatingTimerService bonus mode).
 */
class PipActivity : Activity() {

    companion object {
        private const val POLL_MS = 750L
        private const val TICK_MS = 250L
    }

    private val ui = Handler(Looper.getMainLooper())

    private var state = TimerState()
    private var lastSeq = -1L
    private var serverOk = true
    private var inPip = false
    private var enteredPipForSession = false

    private lateinit var cardView: LinearLayout
    private lateinit var progressFill: View
    private lateinit var headingText: TextView
    private lateinit var chipText: TextView
    private lateinit var timerText: TextView
    private lateinit var statusDot: TextView
    private lateinit var statusText: TextView
    private lateinit var questionSection: LinearLayout
    private lateinit var attemptedText: TextView
    private lateinit var correctButton: Button
    private lateinit var incorrectButton: Button
    private lateinit var skippedButton: Button
    private lateinit var undoButton: Button
    private lateinit var targetButton: Button
    private lateinit var offlineBadge: TextView

    private val poll = object : Runnable {
        override fun run() {
            PipClient.fetchState(ui) { s, ok, seq ->
                serverOk = ok
                offlineBadge.visibility = if (ok) View.GONE else View.VISIBLE
                if (ok && seq != lastSeq) {
                    lastSeq = seq
                    state = s
                    renderAll()
                    maybeEnterPip()
                }
            }
            ui.postDelayed(this, POLL_MS)
        }
    }

    private val tick = object : Runnable {
        override fun run() {
            renderDynamic()
            if (state.isActive()) maybeEnterPip()
            ui.postDelayed(this, TICK_MS)
        }
    }

    // ───────────────────────── Lifecycle ─────────────────────────────────────

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        buildUi()
    }

    override fun onResume() {
        super.onResume()
        ui.removeCallbacks(poll)
        ui.removeCallbacks(tick)
        ui.post(poll)
        ui.post(tick)
    }

    override fun onPause() {
        ui.removeCallbacks(poll)
        ui.removeCallbacks(tick)
        super.onPause()
    }

    override fun onDestroy() {
        ui.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean, newConfig: android.content.res.Configuration) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        inPip = isInPictureInPictureMode
        if (!inPip && !state.isActive()) enteredPipForSession = false
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        maybeEnterPip()
    }

    // ───────────────────────── UI construction ───────────────────────────────

    private fun buildUi() {
        val root = FrameLayout(this).apply { setBackgroundColor(Color.rgb(9, 9, 11)) }

        // ── Card (centered column) ───────────────────────────────────────────
        val card = LinearLayout(this)
        card.orientation = LinearLayout.VERTICAL
        card.setPadding(dp(16), dp(12), dp(16), dp(16))

        // Progress strip (edge-to-edge 4dp)
        val progressFrame = FrameLayout(this).apply { setBackgroundColor(Color.argb(13, 139, 92, 246)) }
        progressFill = View(this).apply {
            scaleX = 0f
            pivotX = 0f
            pivotY = 0f
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        }
        progressFrame.addView(progressFill)
        card.addView(progressFrame,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(4)))

        // Content column
        val content = LinearLayout(this)
        content.orientation = LinearLayout.VERTICAL
        content.setPadding(dp(0), dp(12), dp(0), dp(0))

        headingText = text(11, true).apply { letterSpacing = 0.08f; isAllCaps = true }
        content.addView(headingText)

        chipText = text(13, true).apply {
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(5), dp(12), dp(5))
        }
        val chipLp = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin = dp(6)
            bottomMargin = dp(4)
        }
        content.addView(chipText, chipLp)

        timerText = text(56, true).apply {
            gravity = Gravity.CENTER
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            letterSpacing = -0.02f
        }
        content.addView(timerText,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(2)
                bottomMargin = dp(4)
            })

        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        statusDot = text(10, true)
        statusText = text(11, false).apply { letterSpacing = 0.05f; isAllCaps = true }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)
        content.addView(statusRow)

        // ── Question tracking section (pipapk.md §4b elements 7-12) ──────────
        questionSection = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        val attemptRow = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            orientation = LinearLayout.HORIZONTAL
        }
        attemptedText = text(26, true)
        targetButton = pillButton("Target").apply { setOnClickListener { showTargetDialog() } }
        attemptRow.addView(attemptedText,
            LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        attemptRow.addView(targetButton)
        questionSection.addView(attemptRow)

        val resultRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        correctButton = resultButton("\u2713").apply { setOnClickListener { PipClient.postAction("correct", -1) } }
        incorrectButton = resultButton("\u2715").apply { setOnClickListener { PipClient.postAction("incorrect", -1) } }
        skippedButton = resultButton("\u21b7").apply { setOnClickListener { PipClient.postAction("skipped", -1) } }
        val btnH = dp(44)
        val gap = dp(6)
        val bpL = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpM = LinearLayout.LayoutParams(0, btnH, 1f).apply { setMargins(0, 0, gap, 0) }
        val bpR = LinearLayout.LayoutParams(0, btnH, 1f)
        resultRow.addView(correctButton, bpL)
        resultRow.addView(incorrectButton, bpM)
        resultRow.addView(skippedButton, bpR)
        questionSection.addView(resultRow,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(6)
            })

        undoButton = pillButton("Undo last").apply {
            setOnClickListener { PipClient.postAction("undo", -1) }
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(36)).apply {
                topMargin = dp(6)
            }
        }
        questionSection.addView(undoButton)
        content.addView(questionSection,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(10)
            })

        card.addView(content,
            LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        cardView = card

        val cardWrap = FrameLayout(this)
        cardWrap.addView(card, FrameLayout.LayoutParams(dp(340), ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER))

        // Offline badge
        offlineBadge = text(11, false).apply {
            text = "server offline  \u2022  showing last state"
            setTextColor(Colors.MUTED_DARK)
            gravity = Gravity.CENTER
        }
        cardWrap.addView(offlineBadge,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(24), Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM).apply {
                topMargin = dp(8)
            })

        // Float button (overlay bonus mode)
        val floatButton = pillButton("Float").apply {
            setOnClickListener { toggleOverlay() }
        }
        root.addView(floatButton, FrameLayout.LayoutParams(dp(76), dp(48), Gravity.BOTTOM or Gravity.END))

        root.addView(cardWrap, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        setContentView(root)
    }

    // ───────────────────────── Rendering ─────────────────────────────────────

    private fun renderAll() {
        val dark = state.theme == "dark"
        val isBreak = state.timerState == "break" || state.activePhase == "break"

        val bgColor = if (dark) Color.rgb(14, 14, 17) else Color.WHITE          // zinc-950 / white
        val textColor = if (dark) Color.WHITE else Color.rgb(24, 24, 27)        // white / zinc-900
        val mutedColor = if (dark) Color.rgb(161, 161, 170) else Color.rgb(113, 113, 122)
        val border = if (dark) Color.argb(25, 255, 255, 255) else Color.argb(30, 24, 24, 27)

        cardView.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(24).toFloat()
            setStroke(dp(1), border)
        }

        progressFill.background = GradientDrawable().apply {
            setColor(if (isBreak) Color.rgb(56, 189, 248) else Color.rgb(139, 92, 246))
        }

        chipText.background = GradientDrawable().apply {
            setColor(if (dark) Color.argb(30, 139, 92, 246) else Color.argb(18, 139, 92, 246))
            cornerRadius = dp(999).toFloat()
            setStroke(dp(1), if (dark) Color.argb(50, 139, 92, 246) else Color.argb(35, 139, 92, 246))
        }
        chipText.setTextColor(if (dark) Color.rgb(196, 181, 253) else Color.rgb(109, 40, 217))

        headingText.setTextColor(mutedColor)
        timerText.setTextColor(textColor)
        statusText.setTextColor(mutedColor)
        attemptedText.setTextColor(textColor)

        val targetBg = if (dark) Color.argb(20, 255, 255, 255) else Color.argb(10, 24, 24, 27)
        val targetBorder = if (dark) Color.argb(45, 255, 255, 255) else Color.argb(30, 24, 24, 27)
        stylePillBy(targetButton, targetBg, textColor, targetBorder)
        stylePillBy(correctButton, Color.rgb(5, 150, 105), Color.WHITE, Color.TRANSPARENT)
        stylePillBy(incorrectButton, Color.rgb(225, 29, 72), Color.WHITE, Color.TRANSPARENT)
        stylePillBy(skippedButton, Color.rgb(217, 119, 6), Color.WHITE, Color.TRANSPARENT)
        stylePillBy(undoButton, Color.TRANSPARENT, mutedColor,
            if (dark) Color.argb(36, 255, 255, 255) else Color.argb(36, 24, 24, 27))

        renderDynamic()
    }

    private fun renderDynamic() {
        if (!::timerText.isInitialized) return
        val isBreak = state.timerState == "break" || state.activePhase == "break"
        timerText.text = formatSeconds(state.displaySecondsNow())

        val (cycle, sessions) = state.pomodoroCycle to state.pomodoroSessionsUntilLongBreak
        headingText.text = when {
            state.mode == "stopwatch" -> "Stopwatch"
            cycle > 0 && sessions > 0 -> "Pomodoro  $cycle / $sessions"
            else -> "Pomodoro"
        }

        statusDot.text = "\u25cf "
        statusDot.setTextColor(state.statusColor())
        statusText.text = state.statusLabel()
        chipText.text = state.focusTypeIcon + "  " + state.focusTypeLabel

        questionSection.visibility = if (state.showQuestionControls) View.VISIBLE else View.GONE
        attemptedText.text = state.questionsAttempted.toString() +
            (if (state.targetQuestions > 0) " / ${state.targetQuestions}" else "")
        correctButton.text = "\u2713  ${state.questionsCorrect}"
        incorrectButton.text = "\u2715  ${state.questionsIncorrect}"
        skippedButton.text = "\u21b7  ${state.questionsSkipped}"
        if (state.undoAvailable != undoButton.isEnabled) undoButton.isEnabled = state.undoAvailable
        undoButton.alpha = if (state.undoAvailable) 1f else 0.4f

        val ratio = when {
            state.mode == "stopwatch" -> {
                val cycleLen = 25 * 60
                Math.min(1f, (state.displaySecondsNow() % cycleLen).toFloat() / cycleLen)
            }
            state.totalSeconds > 0 ->
                Math.max(0f, Math.min(1f, state.displaySecondsNow().toFloat() / state.totalSeconds))
            else -> 0f
        }
        progressFill.scaleX = ratio
    }

    // ───────────────────────── PiP ───────────────────────────────────────────

    private fun supportsPiP(): Boolean =
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
            packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)

    private fun maybeEnterPip() {
        if (!supportsPiP() || inPip || enteredPipForSession) return
        if (!state.isActive()) return
        enteredPipForSession = true
        enterPictureInPictureMode(
            PictureInPictureParams.Builder()
                .setAspectRatio(Rational(340, 390))
                .build())
    }

    // ───────────────────────── Actions ───────────────────────────────────────

    private fun showTargetDialog() {
        val input = EditText(this).apply {
            inputType = InputType.TYPE_CLASS_NUMBER
            setSingleLine(true)
            setText(if (state.targetQuestions > 0) state.targetQuestions.toString() else "")
            setSelectAllOnFocus(true)
            setPadding(dp(20), dp(12), dp(20), dp(12))
        }
        AlertDialog.Builder(this)
            .setTitle("Set target questions")
            .setView(input)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Set") { _, _ ->
                var v = 0
                try { v = input.text.toString().trim().toInt() } catch (ignored: Exception) {}
                PipClient.postAction("setTarget", Math.max(0, Math.min(9999, v)))
            }
            .show()
        input.requestFocus()
    }

    private fun toggleOverlay() {
        val has = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)
        if (has) {
            startService(Intent(this, FloatingTimerService::class.java))
            Toast.makeText(this, "Floating timer card started", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Grant 'Display over other apps' first", Toast.LENGTH_SHORT).show()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                startActivity(
                    Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                )
            }
        }
    }

    // ───────────────────────── Helpers ───────────────────────────────────────

    private fun text(sp: Int, bold: Boolean) = TextView(this).apply {
        textSize = sp.toFloat()
        includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
    }

    private fun pillButton(label: String) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        setPadding(dp(12), 0, dp(12), 0)
        background = GradientDrawable().apply {
            setColor(Color.rgb(139, 92, 246))
            cornerRadius = dp(16).toFloat()
        }
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(40))
    }

    private fun resultButton(glyph: String) = pillButton(glyph).apply { textSize = 13f }

    private fun stylePillBy(button: Button?, bgColor: Int, textColor: Int, strokeColor: Int) {
        if (button == null) return
        button.background = GradientDrawable().apply {
            setColor(bgColor)
            cornerRadius = dp(16).toFloat()
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
        if (days > 0) return "$days" + "d " + hours + ":" + two(minutes) + ":" + two(secs)
        if (hours > 0) return hours.toString() + ":" + two(minutes) + ":" + two(secs)
        return minutes.toString() + ":" + two(secs)
    }

    private fun dp(value: Int): Int = Math.round(value * resources.displayMetrics.density)
}