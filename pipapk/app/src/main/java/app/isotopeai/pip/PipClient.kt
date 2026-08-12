package app.isotopeai.pip

import android.content.Context
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
    private const val PREFS_NAME = "pipapk_settings"
    private const val KEY_SERVER_URL = "server_url"
    private const val DEFAULT_SERVER_URL = "http://127.0.0.1:3000"

    private val io = Executors.newSingleThreadExecutor()
    private var lastCachedState: TimerState? = null
    private var lastCachedSeq: Long = -1L

    private fun baseUrl(ctx: Context?): String {
        val url = ctx?.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            ?.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL)
        return if (url.isNullOrBlank()) DEFAULT_SERVER_URL else url
    }

    fun stateUrl(ctx: Context?): String = "${baseUrl(ctx)}/api/pip/state"
    fun actionUrl(ctx: Context?): String = "${baseUrl(ctx)}/api/pip/action"
    fun healthUrl(ctx: Context?): String = "${baseUrl(ctx)}/api/health"

    /**
     * Fetch the latest snapshot with retry and caching.
     * Retries once after 500ms on failure. Caches last successful state.
     * [onResult] runs on the main [ui] thread.
     */
    fun fetchState(ctx: Context?, ui: Handler, onResult: (state: TimerState, ok: Boolean, seq: Long) -> Unit) {
        io.execute {
            var success = false
            var result: TimerState = lastCachedState ?: TimerState()
            var resultSeq: Long = lastCachedSeq

            for (attempt in 0..1) {
                try {
                    val conn = URL(stateUrl(ctx)).openConnection() as HttpURLConnection
                    conn.connectTimeout = 3000
                    conn.readTimeout = 3000
                    val json = conn.inputStream.bufferedReader().use { it.readText() }
                    conn.disconnect()
                    val obj = JSONObject(json)
                    result = TimerState.fromJson(obj.toString())
                    resultSeq = obj.optLong("seq", -1)
                    lastCachedState = result
                    lastCachedSeq = resultSeq
                    success = true
                    break
                } catch (ignored: Exception) {
                    if (attempt == 0) {
                        try { Thread.sleep(500) } catch (ignored2: Exception) {}
                    }
                }
            }

            ui.post { onResult(result, success, resultSeq) }
        }
    }

    /** POST an action verb (correct|incorrect|skipped|undo|setTarget|expand|close). */
    fun postAction(ctx: Context?, type: String, value: Int) {
        io.execute {
            try {
                val body =
                    if (type == "setTarget") "{\"type\":\"$type\",\"value\":$value}"
                    else "{\"type\":\"$type\"}"
                val conn = URL(actionUrl(ctx)).openConnection() as HttpURLConnection
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

    /** Quick health check. Returns true if server responds 200. */
    fun checkHealth(ctx: Context?): Boolean {
        return try {
            val conn = URL(healthUrl(ctx)).openConnection() as HttpURLConnection
            conn.connectTimeout = 2000
            conn.readTimeout = 2000
            val ok = conn.responseCode == 200
            conn.disconnect()
            ok
        } catch (e: Exception) {
            false
        }
    }
}
