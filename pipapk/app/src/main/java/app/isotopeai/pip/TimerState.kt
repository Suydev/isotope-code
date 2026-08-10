package app.isotopeai.pip

import android.graphics.Color
import org.json.JSONObject

/**
 * Focus-timer snapshot parsed from GET /api/pip/state.
 * Keys match the PIP_BRIDGE_JS relay payload 1:1 (see memory.md §4).
 */
class TimerState {
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