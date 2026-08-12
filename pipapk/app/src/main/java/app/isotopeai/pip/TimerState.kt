package app.isotopeai.pip

import android.graphics.Color
import org.json.JSONObject

data class TimerState(
    val mode: String = "pomodoro",
    val timerState: String = "idle",
    val activePhase: String = "",
    val completionAtMs: Long = 0L,
    val updatedAtMs: Long = 0L,
    val displayedSeconds: Int = 0,
    val totalSeconds: Int = 0,
    val pomodoroCycle: Int = 1,
    val pomodoroSessionsUntilLongBreak: Int = 4,
    val focusTypeLabel: String = "Focus",
    val focusTypeIcon: String = "\ud83d\udccc",
    val showQuestionControls: Boolean = false,
    val questionsAttempted: Int = 0,
    val questionsCorrect: Int = 0,
    val questionsIncorrect: Int = 0,
    val questionsSkipped: Int = 0,
    val targetQuestions: Int = 0,
    val undoAvailable: Boolean = false,
    val theme: String = "dark",
    val pipConnected: Boolean = false
) {
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
        timerState == "running" -> Color.rgb(16, 185, 129)
        timerState == "paused" -> Color.rgb(245, 158, 11)
        timerState == "break" || activePhase == "break" -> Color.rgb(56, 189, 248)
        else -> Color.rgb(113, 113, 122)
    }

    companion object {
        fun fromJson(json: String?): TimerState {
            if (json.isNullOrBlank()) return TimerState()
            return try {
                val o = JSONObject(json)
                TimerState(
                    mode = if (o.optString("mode") == "stopwatch") "stopwatch" else "pomodoro",
                    timerState = if (isTimerState(o.optString("timerState", "idle"))) o.optString("timerState", "idle") else "idle",
                    activePhase = o.optString("activePhase", ""),
                    completionAtMs = Math.max(0, o.optLong("completionAtMs", 0)),
                    updatedAtMs = Math.max(0, o.optLong("updatedAtMs", System.currentTimeMillis())),
                    displayedSeconds = clamp(o.optInt("displayedSeconds", 0), 0, 365 * 24 * 3600),
                    totalSeconds = clamp(o.optInt("totalSeconds", 0), 0, 365 * 24 * 3600),
                    pomodoroCycle = clamp(o.optInt("pomodoroCycle", 1), 1, 999),
                    pomodoroSessionsUntilLongBreak = clamp(o.optInt("pomodoroSessionsUntilLongBreak", 4), 1, 99),
                    focusTypeLabel = cleanText(o.optString("focusTypeLabel", "Focus"), 48, "Focus"),
                    focusTypeIcon = cleanText(o.optString("focusTypeIcon", "\ud83d\udccc"), 8, "\ud83d\udccc"),
                    showQuestionControls = o.optBoolean("showQuestionControls", false),
                    questionsAttempted = clamp(o.optInt("questionsAttempted", 0), 0, 999999),
                    questionsCorrect = clamp(o.optInt("questionsCorrect", 0), 0, 999999),
                    questionsIncorrect = clamp(o.optInt("questionsIncorrect", 0), 0, 999999),
                    questionsSkipped = clamp(o.optInt("questionsSkipped", 0), 0, 999999),
                    targetQuestions = clamp(o.optInt("targetQuestions", 0), 0, 9999),
                    undoAvailable = o.optBoolean("undoAvailable", false),
                    theme = if (o.optString("theme") == "light") "light" else "dark",
                    pipConnected = o.optBoolean("pipConnected", false)
                )
            } catch (ignored: Exception) {
                TimerState()
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
