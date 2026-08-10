package app.isotopeai.pip

import android.app.Service
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.RippleDrawable
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

/**
 * Floating "display over other apps" window. Shows the REAL isotope web app
 * (same /focus UI PipActivity renders, mirroring isotope-apk's wrapper
 * approach) above every other app, in a draggable window with a top drag
 * bar + close button. Refuses to start without SYSTEM_ALERT_WINDOW.
 */
class FloatingOverlayService : Service() {

    companion object {
        const val APP_URL = PipActivity.APP_URL
    }

    private var windowManager: WindowManager? = null
    private var windowView: View? = null
    private var layoutParams: WindowManager.LayoutParams? = null
    private var webView: WebView? = null
    private var messageView: TextView? = null
    private var dragging = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return
        }
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        addWindow()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }
        return START_STICKY
    }

    override fun onDestroy() {
        webView?.destroy()
        webView = null
        windowView?.let { runCatching { windowManager?.removeView(it) } }
        windowView = null
        super.onDestroy()
    }

    // ───────────────────────── Window construction ─────────────────────────

    private fun dp(v: Int): Int = Math.round(v * resources.displayMetrics.density)

    private fun addWindow() {
        val windowWidth = Math.min(resources.displayMetrics.widthPixels - dp(16), dp(400))
        val windowHeight = Math.min(resources.displayMetrics.heightPixels - dp(160), dp(720))
        val view = buildContent()
        windowView = view

        layoutParams = WindowManager.LayoutParams(
            windowWidth,
            windowHeight,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            android.graphics.PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.END
            x = -dp(16)
            y = dp(64)
        }

        try {
            windowManager?.addView(view, layoutParams)
            loadApp()
        } catch (e: Exception) {
            stopSelf()
        }
    }

    private fun buildContent(): View {
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.background = roundedCard()

        // Drag bar: handle + title + close
        val bar = LinearLayout(this)
        bar.orientation = LinearLayout.HORIZONTAL
        bar.gravity = Gravity.CENTER_VERTICAL
        bar.setPadding(dp(12), 0, dp(4), 0)
        val title = TextView(this).apply {
            textSize = 11f
            typeface = Typeface.DEFAULT_BOLD
            letterSpacing = 0.08f
            setTextColor(Color.rgb(161, 161, 170))
            text = "ISOTOPE"
        }
        bar.addView(title, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        val close = Button(this).apply {
            text = "\u00d7"
            contentDescription = "Close floating window"
            isAllCaps = false
            textSize = 15f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(161, 161, 170))
            background = ripple(Color.argb(15, 255, 255, 255), Color.TRANSPARENT)
            setOnClickListener { stopSelf() }
        }
        bar.addView(close, LinearLayout.LayoutParams(dp(44), dp(36)))
        makeDraggable(bar)
        root.addView(bar, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)))

        // The real isotope web app
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.setSupportZoom(false)
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean = false

                override fun onPageFinished(view: WebView, url: String?) {
                    messageView?.visibility = View.GONE
                }

                override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                    if (request.isForMainFrame) {
                        messageView?.visibility = View.VISIBLE
                        messageView?.text = "Isotope server offline — tap to retry"
                    }
                }
            }
            setOnClickListener {
                messageView?.visibility = View.GONE
                loadApp()
            }
        }
        root.addView(webView, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))

        messageView = TextView(this).apply {
            text = "Loading isotope\u2026"
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(9, 9, 11))
            visibility = View.GONE
        }
        root.addView(messageView, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40)))

        return root
    }

    private fun loadApp() {
        messageView?.visibility = View.GONE
        webView?.loadUrl(APP_URL)
    }

    private fun makeDraggable(view: View) {
        view.setOnTouchListener { v, event ->
            val params = layoutParams ?: return@setOnTouchListener false
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    dragging = false
                    v.tag = floatArrayOf(event.rawX, event.rawY, params.x.toFloat(), params.y.toFloat())
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val start = v.tag as FloatArray
                    val dx = event.rawX - start[0]
                    val dy = event.rawY - start[1]
                    if (Math.abs(dx) > dp(4) || Math.abs(dy) > dp(4)) dragging = true
                    if (dragging) {
                        params.x = (start[2] + dx).toInt()
                        params.y = (start[3] + dy).toInt().coerceIn(dp(16), resources.displayMetrics.heightPixels - dp(160))
                        runCatching { windowManager?.updateViewLayout(v, params) }
                    }
                    true
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    if (dragging) v.performClick()
                    true
                }
                else -> false
            }
        }
    }

    private fun roundedCard() = GradientDrawable().apply {
        setColor(Color.rgb(14, 14, 17))
        cornerRadius = dp(16).toFloat()
        setStroke(dp(1), Color.argb(35, 255, 255, 255))
    }

    /** Pill + ripple overlay so every press gives tactile feedback (state layer). */
    private fun ripple(bg: Int, stroke: Int, overlay: Int = 0x33FFFFFF) = RippleDrawable(
        ColorStateList.valueOf(overlay),
        GradientDrawable().apply {
            setColor(bg)
            cornerRadius = dp(14).toFloat()
            if (stroke != Color.TRANSPARENT) setStroke(dp(1), stroke)
        },
        null
    )
}