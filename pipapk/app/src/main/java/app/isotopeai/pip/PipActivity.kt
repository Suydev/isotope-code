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

class PipActivity : Activity() {

    companion object {
        private const val PREFS_NAME = "pipapk_settings"
        private const val KEY_SERVER_URL = "server_url"
        private const val KEY_AUTO_START = "auto_start"
        private const val DEFAULT_SERVER_URL = "http://127.0.0.1:3000"
        private const val AUTO_POLL_MS = 5000L
    }

    private val ui = Handler(Looper.getMainLooper())
    private var serverOk = false
    private var lastCheckedPermission = false
    private var autoStartEnabled = true
    private var overlayRunning = false
    private var lastActiveSeen = false

    private lateinit var statusDot: TextView
    private lateinit var statusText: TextView
    private lateinit var permissionDot: TextView
    private lateinit var permissionText: TextView
    private lateinit var overlayButton: Button
    private lateinit var permissionButton: Button
    private lateinit var autoStartToggle: Button
    private lateinit var urlEditText: EditText

    private val autoStartPoll = object : Runnable {
        override fun run() {
            if (!autoStartEnabled || !serverOk || !lastCheckedPermission) {
                ui.postDelayed(this, AUTO_POLL_MS)
                return
            }
            Thread {
                val s = fetchTimerState()
                val isActive = s?.isActive() == true
                ui.post {
                    if (isActive && !lastActiveSeen && !overlayRunning) {
                        launchOverlay(false)
                        overlayRunning = true
                    }
                    if (!isActive) {
                        overlayRunning = false
                    }
                    lastActiveSeen = isActive
                }
            }.start()
            ui.postDelayed(this, AUTO_POLL_MS)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        autoStartEnabled = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getBoolean(KEY_AUTO_START, true)
        setContentView(buildUi())
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 1001)
            }
        }
        checkStatus()
        ui.postDelayed(autoStartPoll, AUTO_POLL_MS)
    }

    override fun onResume() {
        super.onResume()
        checkStatus()
    }

    override fun onDestroy() {
        ui.removeCallbacks(autoStartPoll)
        super.onDestroy()
    }

    private fun buildUi(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), dp(24), dp(24), dp(24))
            setBackgroundColor(Color.rgb(9, 9, 11))
        }

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

        permissionButton = makeButton("Grant Overlay Permission").apply {
            setOnClickListener { requestOverlayPermission() }
        }
        root.addView(permissionButton, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        overlayButton = makeButton("Start Overlay").apply {
            setOnClickListener { startOverlay() }
        }
        root.addView(overlayButton, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        autoStartToggle = makeButton(if (autoStartEnabled) "Auto-Start: ON" else "Auto-Start: OFF").apply {
            setOnClickListener {
                autoStartEnabled = !autoStartEnabled
                getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                    .putBoolean(KEY_AUTO_START, autoStartEnabled).apply()
                text = if (autoStartEnabled) "Auto-Start: ON" else "Auto-Start: OFF"
            }
        }
        root.addView(autoStartToggle, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(16)
        })

        // ── Customization Section ──────────────────────────────────────────
        val customLabel = TextView(this).apply {
            text = "Customization"
            textSize = 12f
            setTextColor(Color.rgb(161, 161, 170))
            letterSpacing = 0.08f
            isAllCaps = true
        }
        root.addView(customLabel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })

        // Theme picker — three options: Dark / Glass / Apple Glass
        val themeLabel = TextView(this).apply {
            text = "Theme"
            textSize = 14f
            setTextColor(Color.rgb(200, 200, 210))
        }
        root.addView(themeLabel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })

        val currentTheme = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString("overlay_theme", "dark") ?: "dark"
        val themeRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val themePresets = listOf(
            "Dark" to "dark",
            "Glass" to "glass",
            "Apple" to "apple"
        )
        themePresets.forEachIndexed { idx, (label, value) ->
            val isActive = currentTheme == value
            val btn = Button(this).apply {
                text = label
                isAllCaps = false
                textSize = 12f
                typeface = Typeface.DEFAULT_BOLD
                setTextColor(if (isActive) Color.WHITE else Color.rgb(161, 161, 170))
                background = GradientDrawable().apply {
                    setColor(if (isActive) Color.rgb(139, 92, 246) else Color.rgb(38, 38, 42))
                    cornerRadius = dp(10).toFloat()
                }
                setPadding(dp(12), dp(4), dp(12), dp(4))
                setOnClickListener {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putString("overlay_theme", value).apply()
                    // Apply to running overlay service immediately
                    val svcIntent = Intent(this@PipActivity, FloatingTimerService::class.java).apply {
                        action = "SET_THEME"
                        putExtra("THEME_VALUE", value)
                    }
                    try { startService(svcIntent) } catch (ignored: Exception) {}
                    Toast.makeText(this@PipActivity, "Theme: $label", Toast.LENGTH_SHORT).show()
                    // Refresh all three buttons
                    (parent as? LinearLayout)?.let { row ->
                        for (i in 0 until row.childCount) {
                            val child = row.getChildAt(i) as? Button
                            child?.let {
                                val (_, v) = themePresets[i]
                                val active = v == value
                                it.setTextColor(if (active) Color.WHITE else Color.rgb(161, 161, 170))
                                (it.background as? GradientDrawable)?.setColor(
                                    if (active) Color.rgb(139, 92, 246) else Color.rgb(38, 38, 42))
                            }
                        }
                    }
                }
            }
            val params = LinearLayout.LayoutParams(0, dp(36), 1f).apply {
                setMargins(if (idx > 0) dp(6) else 0, 0, 0, 0)
            }
            themeRow.addView(btn, params)
        }
        root.addView(themeRow, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        // Overlay size presets
        val sizeLabel = TextView(this).apply {
            text = "Default Overlay Size"
            textSize = 14f
            setTextColor(Color.rgb(200, 200, 210))
        }
        root.addView(sizeLabel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })

        val sizeRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        val sizePresets = listOf(
            "Small" to intArrayOf(dp(240), dp(280)),
            "Medium" to intArrayOf(dp(300), dp(340)),
            "Large" to intArrayOf(dp(400), dp(440))
        )
        val currentW = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).getInt("overlay_width", dp(300))
        sizePresets.forEachIndexed { idx, (label, dims) ->
            val btn = Button(this).apply {
                text = label
                isAllCaps = false
                textSize = 11f
                typeface = Typeface.DEFAULT_BOLD
                setTextColor(if (Math.abs(currentW - dims[0]) < dp(20)) Color.WHITE else Color.rgb(161, 161, 170))
                background = GradientDrawable().apply {
                    setColor(if (Math.abs(currentW - dims[0]) < dp(20)) Color.rgb(139, 92, 246) else Color.rgb(38, 38, 42))
                    cornerRadius = dp(10).toFloat()
                }
                setPadding(dp(12), dp(4), dp(12), dp(4))
                setOnClickListener {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putInt("overlay_width", dims[0])
                        .putInt("overlay_height", dims[1])
                        .apply()
                    Toast.makeText(this@PipActivity, "Size: $label (${dims[0]}x${dims[1]})", Toast.LENGTH_SHORT).show()
                    // Refresh button states
                    (parent as? LinearLayout)?.let { row ->
                        for (i in 0 until row.childCount) {
                            val child = row.getChildAt(i) as? Button
                            child?.let {
                                val isCurrent = it.text == label
                                it.setTextColor(if (isCurrent) Color.WHITE else Color.rgb(161, 161, 170))
                                (it.background as? GradientDrawable)?.setColor(
                                    if (isCurrent) Color.rgb(139, 92, 246) else Color.rgb(38, 38, 42))
                            }
                        }
                    }
                }
            }
            val params = LinearLayout.LayoutParams(0, dp(36), 1f).apply {
                setMargins(if (idx > 0) dp(6) else 0, 0, 0, 0)
            }
            sizeRow.addView(btn, params)
        }
        root.addView(sizeRow, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(12)
        })

        val urlLabel = TextView(this).apply {
            text = "Server URL"
            textSize = 12f
            setTextColor(Color.rgb(161, 161, 170))
            letterSpacing = 0.08f
            isAllCaps = true
        }
        root.addView(urlLabel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            topMargin = dp(8)
            bottomMargin = dp(8)
        })

        urlEditText = EditText(this).apply {
            setText(getServerUrl())
            textSize = 14f
            typeface = Typeface.MONOSPACE
            setTextColor(Color.rgb(200, 200, 210))
            setBackgroundColor(Color.rgb(24, 24, 27))
            setPadding(dp(16), dp(12), dp(16), dp(12))
            setSingleLine(true)
            inputType = InputType.TYPE_TEXT_VARIATION_URI
        }
        root.addView(urlEditText, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(8)
        })

        val saveUrlBtn = makeButton("Save URL").apply {
            setOnClickListener {
                val newUrl = urlEditText.text.toString().trim().trimEnd('/')
                if (newUrl.isNotBlank()) {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putString(KEY_SERVER_URL, newUrl).apply()
                    Toast.makeText(this@PipActivity, "URL saved: $newUrl", Toast.LENGTH_SHORT).show()
                    checkServer()
                }
            }
        }
        root.addView(saveUrlBtn, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(16)
        })

        val info = TextView(this).apply {
            text = "Auto-start: overlay launches when server detects an active timer.\n" +
                   "Press 'Start Overlay' to launch manually.\n" +
                   "Overlay requires 'Display over other apps' permission.\n" +
                   "Theme: tap the snowflake icon in the overlay to toggle glass mode."
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
            AlertDialog.Builder(this)
                .setTitle("Permission Required")
                .setMessage("Display over other apps permission is needed for the timer overlay.")
                .setPositiveButton("Grant") { _, _ -> requestOverlayPermission() }
                .setNegativeButton("Cancel", null)
                .show()
            return
        }
        if (!serverOk) {
            AlertDialog.Builder(this)
                .setTitle("Server Unreachable")
                .setMessage("Cannot reach the server at ${getServerUrl()}. The overlay will show stale data or won't work.")
                .setPositiveButton("Start Anyway") { _, _ -> launchOverlay(true) }
                .setNegativeButton("Cancel", null)
                .show()
            return
        }
        launchOverlay(true)
    }

    private fun launchOverlay(manual: Boolean) {
        val intent = Intent(this, FloatingTimerService::class.java).apply {
            putExtra("MANUAL_START", manual)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        overlayRunning = true
        Toast.makeText(this, "Overlay started", Toast.LENGTH_SHORT).show()
    }

    private fun fetchTimerState(): TimerState? {
        return try {
            val url = PipClient.stateUrl(this)
            val conn = java.net.URL(url).openConnection() as java.net.HttpURLConnection
            conn.connectTimeout = 2000
            conn.readTimeout = 2000
            val json = conn.inputStream.bufferedReader().use { it.readText() }
            conn.disconnect()
            TimerState.fromJson(json)
        } catch (e: Exception) {
            null
        }
    }

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
