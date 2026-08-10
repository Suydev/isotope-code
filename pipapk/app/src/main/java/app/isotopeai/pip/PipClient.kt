package app.isotopeai.pip

import android.os.Handler
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * Minimal HTTP client for the localhost isotope pip API (pipapk.md §5).
 *
 * GET /api/pip/state  -> latest timer snapshot (relayed by the /focus page).
 * POST /api/pip/action -> server fans the action over SSE; the /focus page's
 *                          PIP_BRIDGE_JS applies it to the REAL store.
 */
object PipClient {
    const val STATE_URL = "http://127.0.0.1:3000/api/pip/state"
    const val ACTION_URL = "http://127.0.0.1:3000/api/pip/action"

    private val io = Executors.newSingleThreadExecutor()

    /**
     * Fetch the latest snapshot. [onResult] runs on the main [ui] thread.
     * [ok] is false when the server is unreachable (caller keeps last state +
     * shows an offline badge — pipapk.md §10.6).
     */
    fun fetchState(ui: Handler, onResult: (state: TimerState, ok: Boolean, seq: Long) -> Unit) {
        io.execute {
            try {
                val conn = URL(STATE_URL).openConnection() as HttpURLConnection
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                val json = conn.inputStream.bufferedReader().use { it.readText() }
                conn.disconnect()
                val obj = JSONObject(json)
                ui.post { onResult(TimerState.fromJson(obj.toString()), true, obj.optLong("seq", -1)) }
            } catch (ignored: Exception) {
                ui.post { onResult(TimerState.fromJson(null), false, -1) }
            }
        }
    }

    /** POST an action verb (correct|incorrect|skipped|undo|setTarget|expand|close). */
    fun postAction(type: String, value: Int) {
        io.execute {
            try {
                val body =
                    if (type == "setTarget") "{\"type\":\"$type\",\"value\":$value}"
                    else "{\"type\":\"$type\"}"
                val conn = URL(ACTION_URL).openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                conn.setRequestProperty("Content-Type", "application/json")
                conn.outputStream.use { it.write(body.toByteArray()) }
                conn.inputStream.close()
                conn.disconnect()
            } catch (ignored: Exception) {
            }
        }
    }
}