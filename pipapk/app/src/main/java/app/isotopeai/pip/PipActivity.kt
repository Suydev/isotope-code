package app.isotopeai.pip

import android.app.Activity
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.RippleDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

/**
 * Isotope PiP — a shell around the REAL isotope web UI, exactly like
 * isotope-apk wraps the compiled frontend. The WebView loads the actual
 * /focus app from the localhost server (the state owner) so every pixel,
 * control and behaviour is the true product — not a re-imagined card.
 *
 * Adds two small native affordances: a permission banner (system
 * "Display over other apps") and a Float button that lifts the real app
 * into a draggable window above every app (FloatingOverlayService).
 */
class PipActivity : Activity() {

    companion object {
        const val APP_URL = "http://127.0.0.1:3000/focus"
    }

    private lateinit var root: FrameLayout
    private var webView: WebView? = null
    private var permBanner: View? = null
    private var errorView: View? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        buildUi()
        loadApp()
    }

    override fun onResume() {
        super.onResume()
        webView?.onResume()
    }

    override fun onPause() {
        webView?.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView?.destroy()
        webView = null
        super.onDestroy()
    }

    override fun onBackPressed() {
        val wv = webView
        if (wv != null && wv.canGoBack()) wv.goBack() else super.onBackPressed()
    }

    // ───────────────────────── UI construction ─────────────────────────────

    private fun buildUi() {
        root = FrameLayout(this)
        root.setBackgroundColor(Color.rgb(9, 9, 11))

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.setSupportZoom(false)
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean = false

                override fun onPageFinished(view: WebView, url: String?) {
                    errorView?.visibility = View.GONE
                }

                override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                    if (request.isForMainFrame) {
                        errorView?.visibility = View.VISIBLE
                    }
                }
            }
        }
        root.addView(webView, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))

        root.addView(buildErrorView(), FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(buildPermBanner(), FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.TOP))
        root.addView(buildFloatButton(), FrameLayout.LayoutParams(dp(76), dp(48), Gravity.BOTTOM or Gravity.END))

        setContentView(root)
    }

    private fun buildErrorView(): View {
        val wrap = LinearLayout(this)
        wrap.orientation = LinearLayout.VERTICAL
        wrap.gravity = Gravity.CENTER
        wrap.setBackgroundColor(Color.rgb(9, 9, 11))
        wrap.visibility = View.GONE

        val title = text(18, true).apply { text = "Isotope is offline"; setTextColor(Color.WHITE) }
        wrap.addView(title)
        val sub = text(12, false).apply {
            text = "Start the isotope server on this device, then retry."
            setTextColor(Colors.MUTED_DARK)
        }
        val subLp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        subLp.topMargin = dp(6)
        wrap.addView(sub, subLp)
        val retry = Button(this).apply {
            text = "Retry"
            isAllCaps = false
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = ripple(Colors.BRAND_500, Color.TRANSPARENT)
            setOnClickListener { loadApp() }
        }
        val rLp = LinearLayout.LayoutParams(dp(120), dp(48))
        rLp.topMargin = dp(16)
        wrap.addView(retry, rLp)
        errorView = wrap
        return wrap
    }

    private fun buildPermBanner(): View {
        val banner = LinearLayout(this)
        banner.orientation = LinearLayout.HORIZONTAL
        banner.gravity = Gravity.CENTER_VERTICAL
        banner.setPadding(dp(16), dp(6), dp(6), dp(6))
        banner.background = ripple(Color.rgb(24, 24, 27), Color.argb(30, 255, 255, 255))
        banner.visibility = if (hasOverlayPermission()) View.GONE else View.VISIBLE

        val label = text(12, false).apply {
            text = "Floating window needs 'Display over other apps'"
            setTextColor(Colors.MUTED_DARK)
        }
        banner.addView(label, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))

        val grant = pillButton("Grant") { openOverlaySettings() }
        banner.addView(grant)
        val close = Button(this).apply {
            text = "\u00d7"
            contentDescription = "Dismiss permission banner"
            isAllCaps = false
            textSize = 16f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Colors.MUTED_DARK)
            background = ripple(Color.argb(15, 255, 255, 255), Color.TRANSPARENT)
            setOnClickListener { banner.visibility = View.GONE }
        }
        banner.addView(close, LinearLayout.LayoutParams(dp(44), dp(40)))

        permBanner = banner
        return banner
    }

    private fun buildFloatButton(): View {
        val btn = Button(this).apply {
            text = "Float"
            contentDescription = "Show Isotope in a floating window above other apps"
            isAllCaps = false
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = ripple(Colors.BRAND_500, Color.TRANSPARENT)
            setOnClickListener { toggleFloating() }
        }
        return btn
    }

    private fun loadApp() {
        errorView?.visibility = View.GONE
        webView?.loadUrl(APP_URL)
    }

    // ───────────────────────── Permissions & floating ──────────────────────

    private fun hasOverlayPermission(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)

    private fun openOverlaySettings() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return
        startActivity(
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        )
    }

    private fun toggleFloating() {
        if (hasOverlayPermission()) {
            startService(Intent(this, FloatingOverlayService::class.java))
            Toast.makeText(this, "Isotope floating window started — drag it by the top bar", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Grant 'Display over other apps' first", Toast.LENGTH_SHORT).show()
            openOverlaySettings()
        }
    }

    // ───────────────────────── View factories ──────────────────────────────

    private fun dp(v: Int): Int = Math.round(v * resources.displayMetrics.density)

    private fun text(sp: Int, bold: Boolean) = TextView(this).apply {
        textSize = sp.toFloat()
        includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
    }

    private fun pillButton(label: String, onClick: () -> Unit) = Button(this).apply {
        text = label
        isAllCaps = false
        textSize = 12f
        typeface = Typeface.DEFAULT_BOLD
        setTextColor(Color.WHITE)
        background = ripple(Colors.BRAND_500, Color.TRANSPARENT)
        setPadding(dp(12), 0, dp(12), 0)
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(40))
    }

    private fun pill(bg: Int, stroke: Int) = GradientDrawable().apply {
        setColor(bg)
        cornerRadius = dp(14).toFloat()
        if (stroke != Color.TRANSPARENT) setStroke(dp(1), stroke)
    }

    /** Pill + ripple overlay so every press gives tactile feedback (state layer). */
    private fun ripple(bg: Int, stroke: Int, overlay: Int = 0x33FFFFFF) = RippleDrawable(
        ColorStateList.valueOf(overlay),
        pill(bg, stroke),
        null
    )
}