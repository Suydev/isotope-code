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
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast

/**
 * pipapk main activity — settings + overlay launcher.
 *
 * From here the user can:
 *   - Check/enable overlay permission
 *   - Start the floating timer overlay manually
 *   - Configure server URL (default localhost)
 *   - See connection status
 *
 * The overlay auto-starts when the server detects an active timer.
 * The overlay auto-stops when the timer becomes inactive.
 */
class PipActivity : Activity() {

    companion object {
        private const val PREFS_NAME = "pipapk_settings"
        private const val KEY_SERVER_URL = "server_url"
        private const val DEFAULT_SERVER_URL = "http://127.0.0.1:3000"
    }

    private val ui = Handler(Looper.getMainLooper())
    private var serverOk = false
    private var lastCheckedPermission = false

    private lateinit var statusDot: TextView
    private lateinit var statusText: TextView
    private lateinit var permissionDot: TextView
    private lateinit var permissionText: TextView
    private lateinit var overlayButton: Button
    private lateinit var permissionButton: Button

    // ───────────────────────── Lifecycle ─────────────────────────────────────

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildUi())
        checkStatus()
    }

    override fun onResume() {
        super.onResume()
        checkStatus()
    }

    // ───────────────────────── UI construction ───────────────────────────────

    private fun buildUi(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), dp(24), dp(24), dp(24))
            setBackgroundColor(Color.rgb(9, 9, 11))
        }

        // ── Header ───────────────────────────────────────────────────────────
        val header = TextView(this).apply {
            text = "pipapk"
            textSize = 20f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            letterSpacing = 0.05f
        }
        root.addView(header, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })

        val subtitle = TextView(this).apply {
            text = "Timer overlay for isotope"
            textSize = 13f
            setTextColor(Color.rgb(161, 161, 170))
        }
        root.addView(subtitle, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(24)
        })

        // ── Connection status card ───────────────────────────────────────────
        val statusCard = makeCard()
        val statusRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(16), dp(16), dp(16), dp(16))
        }
        statusDot = TextView(this).apply {
            text = "\u25cf "
            textSize = 14f
            setTextColor(Color.rgb(113, 113, 122))
        }
        statusText = TextView(this).apply {
            text = "Checking server..."
            textSize = 14f
            setTextColor(Color.rgb(161, 161, 170))
        }
        statusRow.addView(statusDot)
        statusRow.addView(statusText)
        statusCard.addView(statusRow)
        root.addView(statusCard, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(12)
        })

        // ── Permission status card ───────────────────────────────────────────
        val permCard = makeCard()
        val permRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(16), dp(16), dp(16), dp(16))
        }
        permissionDot = TextView(this).apply {
            text = "\u25cf "
            textSize = 14f
            setTextColor(Color.rgb(113, 113, 122))
        }
        permissionText = TextView(this).apply {
            text = "Checking permission..."
            textSize = 14f
            setTextColor(Color.rgb(161, 161, 170))
        }
        permRow.addView(permissionDot)
        permRow.addView(permissionText)
        permCard.addView(permRow)
        root.addView(permCard, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(12)
        })

        // ── Grant permission button ──────────────────────────────────────────
        permissionButton = makeButton("Grant Overlay Permission").apply {
            setOnClickListener { requestOverlayPermission() }
        }
        root.addView(permissionButton, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        // ── Start overlay button ─────────────────────────────────────────────
        overlayButton = makeButton("Start Overlay").apply {
            setOnClickListener { startOverlay() }
        }
        root.addView(overlayButton, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        // ── Server URL ───────────────────────────────────────────────────────
        val urlLabel = TextView(this).apply {
            text = "Server URL"
            textSize = 12f
            setTextColor(Color.rgb(161, 161, 170))
            letterSpacing = 0.08f
            isAllCaps = true
        }
        root.addView(urlLabel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(16)
            bottomMargin = dp(8)
        })

        val urlCard = makeCard()
        val urlText = TextView(this).apply {
            text = getServerUrl()
            textSize = 14f
            typeface = Typeface.MONOSPACE
            setTextColor(Color.rgb(161, 161, 170))
            setPadding(dp(16), dp(12), dp(16), dp(12))
        }
        urlCard.addView(urlText)
        root.addView(urlCard, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(16)
        })

        // ── Info text ────────────────────────────────────────────────────────
        val info = TextView(this).apply {
            text = "The overlay auto-starts when the server detects an active timer.\n" +
                   "Press 'Start Overlay' to launch manually.\n" +
                   "Overlay requires 'Display over other apps' permission."
            textSize = 12f
            setTextColor(Color.rgb(113, 113, 122))
            setLineSpacing(dp(4).toFloat(), 1f)
        }
        root.addView(info, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))

        return ScrollView(this).apply {
            addView(root, ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        }
    }

    // ───────────────────────── Status checks ─────────────────────────────────

    private fun checkStatus() {
        checkServer()
        checkPermission()
    }

    private fun checkServer() {
        val url = getServerUrl()
        Thread {
            try {
                val conn = java.net.URL("$url/api/health").openConnection() as java.net.HttpURLConnection
                conn.connectTimeout = 3000
                conn.readTimeout = 3000
                val code = conn.responseCode
                conn.disconnect()
                ui.post {
                    serverOk = code == 200
                    statusDot.setTextColor(if (serverOk) Color.rgb(16, 185, 129) else Color.rgb(239, 68, 68))
                    statusText.text = if (serverOk) "Server online" else "Server error ($code)"
                }
            } catch (e: Exception) {
                ui.post {
                    serverOk = false
                    statusDot.setTextColor(Color.rgb(239, 68, 68))
                    statusText.text = "Server unreachable"
                }
            }
        }.start()
    }

    private fun checkPermission() {
        val has = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)
        lastCheckedPermission = has
        permissionDot.setTextColor(if (has) Color.rgb(16, 185, 129) else Color.rgb(245, 158, 11))
        permissionText.text = if (has) "Overlay permission granted" else "Overlay permission required"
        permissionButton.visibility = if (has) View.GONE else View.VISIBLE
        overlayButton.alpha = if (has) 1f else 0.5f
    }

    // ───────────────────────── Actions ───────────────────────────────────────

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            startActivity(
                Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName"))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        }
    }

    private fun startOverlay() {
        if (!lastCheckedPermission) {
            Toast.makeText(this, "Grant overlay permission first", Toast.LENGTH_SHORT).show()
            requestOverlayPermission()
            return
        }
        val intent = Intent(this, FloatingTimerService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        Toast.makeText(this, "Overlay started", Toast.LENGTH_SHORT).show()
    }

    // ───────────────────────── Helpers ───────────────────────────────────────

    private fun getServerUrl(): String {
        return getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString(KEY_SERVER_URL, DEFAULT_SERVER_URL) ?: DEFAULT_SERVER_URL
    }

    private fun makeCard(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = GradientDrawable().apply {
                setColor(Color.rgb(24, 24, 27))
                cornerRadius = dp(16).toFloat()
                setStroke(dp(1), Color.argb(25, 255, 255, 255))
            }
        }
    }

    private fun makeButton(label: String): Button {
        return Button(this).apply {
            text = label
            isAllCaps = false
            textSize = 14f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = GradientDrawable().apply {
                setColor(Color.rgb(139, 92, 246))
                cornerRadius = dp(12).toFloat()
            }
        }
    }

    private fun dp(value: Int): Int = Math.round(value * resources.displayMetrics.density)
}
