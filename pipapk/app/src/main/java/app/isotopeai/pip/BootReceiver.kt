package app.isotopeai.pip

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat

/**
 * Auto-starts PipBridgeService after boot. specialUse is NOT among the
 * foreground service types Android 15 blocks from BOOT_COMPLETED, but OEMs
 * vary — on failure we schedule an exact-alarm retry (SCHEDULE_EXACT_ALARM
 * is declared) so the bridge comes up a few minutes later.
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED &&
            intent.action != Intent.ACTION_LOCKED_BOOT_COMPLETED
        ) return

        val started = try {
            ContextCompat.startForegroundService(
                context,
                Intent(context, PipBridgeService::class.java)
            )
            true
        } catch (e: Exception) {
            false
        }

        if (!started) scheduleRetry(context)
    }

    private fun scheduleRetry(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pending = PendingIntent.getService(
            context, 1001,
            Intent(context, PipBridgeService::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val triggerAt = System.currentTimeMillis() + RETRY_DELAY_MS
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pending)
            }
        } catch (e: Exception) {
            runCatching { alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pending) }
        }
    }

    companion object {
        private const val RETRY_DELAY_MS = 5L * 60L * 1000L
    }
}