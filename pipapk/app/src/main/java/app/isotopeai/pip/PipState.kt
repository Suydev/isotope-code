package app.isotopeai.pip

import org.json.JSONObject
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Mutable state hub — the only place polled state and action dispatch live.
 * The foreground service writes into it; the activity renders from it.
 * Listeners are called on the main thread.
 */
object StateHub {
    @Volatile var lastState: PipState? = null
        private set
    @Volatile var serverUp = false
        private set
    @Volatile var lastError: String? = null
        private set

    private val listeners = CopyOnWriteArrayList<(PipState?) -> Unit>()
    private val mainHandler = android.os.Handler(android.os.Looper.getMainLooper())

    fun publish(state: PipState?, up: Boolean, error: String? = null) {
        lastState = state
        serverUp = up
        lastError = error
        val snapshot = state
        mainHandler.post { listeners.forEach { it(snapshot) } }
    }

    fun addListener(l: (PipState?) -> Unit) { listeners.addIfAbsent(l) }
    fun removeListener(l: (PipState?) -> Unit) { listeners.remove(l) }
}

/** Parsed snapshot of GET /api/pip/state (schema: pipapk.md §2). */
class PipState {
    var active = false
    var timerState = "idle"
    var mode = "pomodoro"
    var activePhase: String? = null
    var displayedSeconds = 0
    var totalSeconds = 0
    var completionAtMs = 0L
    var updatedAtMs = 0L
    var pomodoroCycle = 1
    var pomodoroSessionsUntilLongBreak = 4
    var questionsAttempted = 0
    var questionsCorrect = 0
    var questionsIncorrect = 0
    var questionsSkipped = 0
    var targetQuestions = 0
    var undoAvailable = false
    var showQuestionControls = false
    var focusTypeLabel = "Focus"
    var focusTypeIcon = ""
    var theme = "dark"

    val isRunning: Boolean get() = timerState == "running"
    val isBreak: Boolean get() = timerState == "break" || activePhase == "break"

    fun secondsNow(): Int {
        val now = System.currentTimeMillis()
        return when {
            (isRunning || timerState == "break") && mode == "stopwatch" ->
                (displayedSeconds + ((now - updatedAtMs) / 1000).coerceAtLeast(0)).coerceAtMost(365 * 24 * 3600).toInt()
            (isRunning || timerState == "break") && completionAtMs > 0 ->
                Math.ceil(((completionAtMs - now).coerceAtLeast(0)) / 1000.0).toInt().coerceAtMost(365 * 24 * 3600)
            else -> displayedSeconds
        }
    }

    fun statusLabel(serverUp: Boolean): String = when {
        !serverUp -> "Server offline"
        timerState == "running" -> "FOCUSING"
        timerState == "paused" -> "PAUSED"
        isBreak -> "BREAK"
        else -> "IDLE"
    }

    companion object {
        fun parse(json: String): PipState {
            val o = JSONObject(json)
            val s = PipState()
            s.active = o.optBoolean("active", false)
            s.timerState = o.optString("timerState", "idle")
            s.mode = if (o.optString("mode") == "stopwatch") "stopwatch" else "pomodoro"
            s.activePhase = o.optString("activePhase", "")
            s.displayedSeconds = o.optInt("displayedSeconds", 0).coerceIn(0, 365 * 24 * 3600)
            s.totalSeconds = o.optInt("totalSeconds", s.displayedSeconds).coerceIn(0, 365 * 24 * 3600)
            s.completionAtMs = o.optLong("completionAtMs", 0).coerceAtLeast(0)
            s.updatedAtMs = o.optLong("updatedAtMs", System.currentTimeMillis()).coerceAtLeast(0)
            s.pomodoroCycle = o.optInt("pomodoroCycle", 1).coerceIn(1, 999)
            s.pomodoroSessionsUntilLongBreak = o.optInt("pomodoroSessionsUntilLongBreak", 4).coerceIn(1, 99)
            s.questionsAttempted = o.optInt("questionsAttempted", 0).coerceIn(0, 999999)
            s.questionsCorrect = o.optInt("questionsCorrect", 0).coerceIn(0, 999999)
            s.questionsIncorrect = o.optInt("questionsIncorrect", 0).coerceIn(0, 999999)
            s.questionsSkipped = o.optInt("questionsSkipped", 0).coerceIn(0, 999999)
            s.targetQuestions = o.optInt("targetQuestions", 0).coerceIn(0, 9999)
            s.undoAvailable = o.optBoolean("undoAvailable", false)
            s.showQuestionControls = o.optBoolean("showQuestionControls", false)
            s.focusTypeLabel = o.optString("focusTypeLabel", "Focus").take(48)
            s.focusTypeIcon = o.optString("focusTypeIcon", "").take(8)
            s.theme = if (o.optString("theme") == "light") "light" else "dark"
            return s
        }

        fun formatSeconds(total: Int): String {
            val s = total.coerceAtLeast(0)
            val days = s / 86400
            val hours = (s % 86400) / 3600
            val minutes = (s % 3600) / 60
            val secs = s % 60
            return when {
                days > 0 -> "$days d $hours:${two(minutes)}:${two(secs)}"
                hours > 0 -> "$hours:${two(minutes)}:${two(secs)}"
                else -> "$minutes:${two(secs)}"
            }
        }

        fun two(v: Int): String = if (v < 10) "0$v" else v.toString()
    }
}