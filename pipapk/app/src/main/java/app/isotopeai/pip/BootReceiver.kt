package app.isotopeai.pip

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != Intent.ACTION_BOOT_COMPLETED) return

        val prefs = context.getSharedPreferences("pipapk_settings", Context.MODE_PRIVATE)
        val autoStart = prefs.getBoolean("auto_start", true)
        if (!autoStart) return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) return

        Handler(Looper.getMainLooper()).postDelayed({
            Thread {
                if (PipClient.checkHealth(context)) {
                    val state = try {
                        val url = PipClient.stateUrl(context)
                        val conn = java.net.URL(url).openConnection() as java.net.HttpURLConnection
                        conn.connectTimeout = 2000
                        conn.readTimeout = 2000
                        val json = conn.inputStream.bufferedReader().use { it.readText() }
                        conn.disconnect()
                        TimerState.fromJson(json)
                    } catch (e: Exception) {
                        null
                    }

                    if (state != null && state.isActive()) {
                        Handler(Looper.getMainLooper()).post {
                            val serviceIntent = Intent(context, FloatingTimerService::class.java).apply {
                                putExtra("MANUAL_START", false)
                            }
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                context.startForegroundService(serviceIntent)
                            } else {
                                context.startService(serviceIntent)
                            }
                        }
                    }
                }
            }.start()
        }, 10000)
    }
}
