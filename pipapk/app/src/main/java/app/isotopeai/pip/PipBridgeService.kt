package app.isotopeai.pip

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Foreground service owning ALL network I/O for the PiP companion.
 *
 * - Polls GET http://127.0.0.1:3000/api/pip/state every POLL_MS (10ms) against
 *   the server's cached snapshot (server rebuilds it only when the browser
 *   relay pushes changes) and publishes into StateHub.
 * - POSTs user actions to /api/pip/action instantly on demand with a
 *   per-type 200ms throttle guard; the response carries a fresh snapshot so
 *   the card re-renders without waiting for the next poll.
 * - Renders an ongoing notification (channel isotope_pip, created before
 *   startForeground so Android 13+ notification-denial never crashes us).
 *
 * Declared foregroundServiceType="specialUse"; startForeground() passes
 * FOREGROUND_SERVICE_TYPE_SPECIAL_USE on R+ (required on API 34+).
 */
class PipBridgeService : Service() {

    companion object {
        const val STATE_URL = "http://127.0.0.1:3000/api/pip/state"
        const val ACTION_URL = "http://127.0.0.1:3000/api/pip/action"
        const val POLL_MS = 10L

        const val CHANNEL_ID = "isotope_pip"
        const val NOTIF_ID = 1

        private val allowedActions = setOf("correct", "incorrect", "skipped", "undo", "setTarget", "expand", "close")

        private val actionsGuard = Any()
        private val lastActionSent = HashMap<String, Long>()
        private var lastNotifTime = 0L

        @Volatile private var instance: PipBridgeService? = null

        /** Static entry point used by the activity and the floating overlay. */
        fun postAction(type: String, value: Int) {
            instance?.postAction(type, value)
        }
    }

    /** Structured concurrency: poller + action posts, all cancelled on destroy. */
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private var pollerJob: Job? = null

    private var lastHttpCode = 0

    override fun onCreate() {
        super.onCreate()
        instance = this
        createNotificationChannel()
        startPollerIfNeeded()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForegroundCompat()
        return START_STICKY
    }

    private fun startPollerIfNeeded() {
        if (pollerJob?.isActive == true) return
        pollerJob = scope.launch {
            while (isActive) {
                val started = System.nanoTime()
                pollOnce()
                val elapsedMs = (System.nanoTime() - started) / 1_000_000L
                if (POLL_MS - elapsedMs > 0) delay(POLL_MS - elapsedMs)
            }
        }
    }

    private fun pollOnce() {
        try {
            val json = httpGet(STATE_URL, 1500)
            if (json != null) {
                try {
                    StateHub.publish(PipState.parse(json), true)
                } catch (e: Exception) {
                    StateHub.publish(null, false, "parse: ${e.message}")
                }
            } else {
                StateHub.publish(null, false, "HTTP $lastHttpCode")
            }
            updateNotificationIfDue()
        } catch (e: Exception) {
            StateHub.publish(null, false, e.message)
        }
    }

    private fun startForegroundCompat() {
        val notification = buildNotification()
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                ServiceCompat.startForeground(
                    this, NOTIF_ID, notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
                )
            } else {
                startForeground(NOTIF_ID, notification)
            }
        } catch (e: Exception) {
            // Android 15 boot restrictions or OEM variance — keep serving via
            // StateHub so the activity still works when launched manually.
            stopSelf()
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Isotope PiP timer",
                NotificationManager.IMPORTANCE_MIN
            ).apply {
                enableLights(false)
                setShowBadge(false)
                setSound(null, null)
                vibrationPattern = null
                description = "Mirrors the isotope focus timer while the PiP window or background service is active."
            }
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val st = StateHub.state.value
        val title = if (st != null) PipState.formatSeconds(st.secondsNow()) else "Connecting…"
        val text = if (st != null) st.statusLabel(StateHub.serverUp.value) else "Waiting for isotope server"
        val contentIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, PipActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Isotope PiP — $title")
            .setContentText(text)
            .setOngoing(true)
            .setSilent(true)
            .setShowWhen(false)
            .setContentIntent(contentIntent)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .build()
    }

    private fun updateNotificationIfDue() {
        val now = System.currentTimeMillis()
        if (now - lastNotifTime < 1000) return
        lastNotifTime = now
        try {
            getSystemService(NotificationManager::class.java).notify(NOTIF_ID, buildNotification())
        } catch (e: Exception) { /* permission denied — FGS still runs */ }
    }

    /** POST an action; response snapshot is republished for instant UI refresh. */
    fun postAction(type: String, value: Int) {
        if (!allowedActions.contains(type)) return
        synchronized(actionsGuard) {
            val now = System.currentTimeMillis()
            if (now - (lastActionSent[type] ?: 0L) < 200L) return
            lastActionSent[type] = now
        }
        scope.launch {
            try {
                val body = JSONObject().put("type", type).apply {
                    if (type == "setTarget") put("value", value.coerceIn(0, 9999))
                }
                val response = httpPost(ACTION_URL, body.toString())
                if (response != null) {
                    try { StateHub.publish(PipState.parse(response), true) } catch (e: Exception) { /* keep last snapshot */ }
                }
            } catch (e: Exception) {
                StateHub.publish(null, false, e.message)
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        pollerJob?.cancel()
        scope.cancel()
        instance = null
        super.onDestroy()
    }

    // ───────────────────────── HTTP ────────────────────────────────────────

    private fun httpGet(url: String, timeoutMs: Int): String? {
        var conn: HttpURLConnection? = null
        try {
            conn = URL(url).openConnection() as HttpURLConnection
            conn.connectTimeout = timeoutMs
            conn.readTimeout = timeoutMs
            conn.requestMethod = "GET"
            lastHttpCode = conn.responseCode
            if (conn.responseCode != 200) return null
            return conn.inputStream.bufferedReader().use { it.readText() }
        } finally {
            conn?.disconnect()
        }
    }

    private fun httpPost(url: String, body: String): String? {
        var conn: HttpURLConnection? = null
        try {
            conn = URL(url).openConnection() as HttpURLConnection
            conn.connectTimeout = 1500
            conn.readTimeout = 1500
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.doOutput = true
            conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            lastHttpCode = conn.responseCode
            if (conn.responseCode != 200) return null
            return conn.inputStream.bufferedReader().use { it.readText() }
        } finally {
            conn?.disconnect()
        }
    }
}
