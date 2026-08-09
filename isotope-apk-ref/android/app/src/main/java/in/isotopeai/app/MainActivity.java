package in.isotopeai.app;

import android.app.PictureInPictureParams;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Rational;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    public static final String ACTION_FLOATING_TIMER_ACTION = "in.isotopeai.app.action.FLOATING_TIMER_ACTION";
    public static final String PREFS_FLOATING_TIMER = "isotope_floating_timer";
    public static final String PREF_ACTION_QUEUE = "action_queue";

    private boolean androidBridgeInstalled = false;
    private boolean floatingActionReceiverRegistered = false;
    private boolean inPictureInPicture = false;

    private final BroadcastReceiver floatingActionReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent != null && ACTION_FLOATING_TIMER_ACTION.equals(intent.getAction())) {
                replayFloatingTimerActions();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        installIsotopeAndroidBridge();
        registerFloatingActionReceiver();
        // Handle cold-start deep link (app launched from invite/community link)
        handleDeepLinkIntent(getIntent(), false);
    }

    @Override
    public void onStart() {
        super.onStart();
        installIsotopeAndroidBridge();
        replayFloatingTimerActions();
    }

    @Override
    public void onResume() {
        super.onResume();
        installIsotopeAndroidBridge();
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
            webView.post(() -> {
                webView.invalidate();
                webView.evaluateJavascript(
                    "window.__isoAndroidForceRepaint&&window.__isoAndroidForceRepaint('main-activity:onResume');",
                    null
                );
            });
        }
        replayFloatingTimerActions();
    }

    /**
     * The manifest declares configChanges="orientation|screenSize|..." so the Activity is
     * NOT destroyed/recreated on rotation — Android calls this method instead. Neither
     * WebView's compositor repaint nor the JS-side 'visibilitychange'/'focus' listeners fire
     * on a pure rotation, which previously left the screen fully black after portrait &lt;-&gt;
     * landscape with no recovery until the process was killed/reinstalled. Force the same
     * invalidate + JS repaint used on onResume so rotation always leaves a rendered frame.
     */
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) return;
        webView.post(() -> {
            webView.requestLayout();
            webView.invalidate();
            webView.evaluateJavascript(
                "window.__isoAndroidForceRepaint&&window.__isoAndroidForceRepaint('main-activity:onConfigurationChanged');" +
                "window.dispatchEvent(new Event('orientationchange'));",
                null
            );
        });
        // Layout after a rotation can settle a frame or two later than the first post(); repaint
        // again shortly after so a still-black WebView gets a second forced compositor pass.
        webView.postDelayed(() -> {
            webView.requestLayout();
            webView.invalidate();
            webView.evaluateJavascript(
                "window.__isoAndroidForceRepaint&&window.__isoAndroidForceRepaint('main-activity:onConfigurationChanged-settled');",
                null
            );
        }, 350);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        replayFloatingTimerActions();
        // Handle warm-start deep link (app already running when link tapped)
        handleDeepLinkIntent(intent, true);
    }

    /**
     * Parses an incoming deep-link intent and routes the WebView to the correct page.
     * Handles:
     *   https://isotopeai.in/invite/<code>
     *   https://www.isotopeai.in/invite/<code>
     *   https://isotopeai.in/community/<path>
     *   isotopeai://invite/<code>
     *
     * @param intent    the incoming intent
     * @param immediate true on warm-start (WebView is running); false on cold-start (defer)
     */
    private void handleDeepLinkIntent(Intent intent, boolean immediate) {
        if (intent == null) return;
        String action = intent.getAction();
        if (!android.content.Intent.ACTION_VIEW.equals(action)) return;
        Uri uri = intent.getData();
        if (uri == null) return;

        String webRoute = resolveDeepLinkRoute(uri);
        if (webRoute == null) return;

        if (immediate) {
            navigateWebViewTo(webRoute);
        } else {
            // Cold start: defer until the bridge signals the app is ready
            final String route = webRoute;
            android.os.Handler handler = new android.os.Handler(android.os.Looper.getMainLooper());
            handler.postDelayed(() -> navigateWebViewTo(route), 1500);
        }
    }

    /**
     * Converts a deep-link URI into a WebView-internal route string, or null if not a
     * recognised IsotopeAI deep link.
     */
    private String resolveDeepLinkRoute(Uri uri) {
        String scheme = uri.getScheme();
        String host   = uri.getHost();
        String path   = uri.getPath();
        if (path == null) path = "";

        // Custom scheme: isotopeai://invite/<code>
        // Android Uri.parse gives host="invite", path="/<code>" for this format,
        // so we must NOT try to strip "/invite/" from path — path is already just
        // "/<code>". Use the host to detect the invite route, then read code from path.
        if ("isotopeai".equalsIgnoreCase(scheme)) {
            if ("invite".equalsIgnoreCase(host) && !path.isEmpty()) {
                // isotopeai://invite/<code>  →  host="invite", path="/<code>"
                String code = path.replaceFirst("^/+", "").trim();
                if (!code.isEmpty()) return "/invite/" + code;
            } else if (path.startsWith("/invite/")) {
                // Fallback: isotopeai:///invite/<code> or isotopeai:/invite/<code>
                String code = path.replaceFirst("^/invite/?", "").trim();
                if (!code.isEmpty()) return "/invite/" + code;
            }
            return null;
        }

        // HTTPS: isotopeai.in or www.isotopeai.in
        if ("https".equalsIgnoreCase(scheme) &&
            host != null &&
            (host.equalsIgnoreCase("isotopeai.in") || host.equalsIgnoreCase("www.isotopeai.in"))) {

            if (path.startsWith("/invite/")) {
                String code = path.replaceFirst("^/invite/?", "").trim();
                return code.isEmpty() ? "/community" : "/invite/" + code;
            }
            if (path.startsWith("/community")) {
                return path;
            }
        }
        return null;
    }

    /**
     * Safely navigates the Capacitor WebView to an internal route using the bridge's
     * navigation helper, falling back to history.pushState and location.href.
     */
    private void navigateWebViewTo(String route) {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        String safeRoute = route.replace("'", "\\'").replace("\\", "\\\\");
        String js = "(function(){"
            + "try{"
            + "if(window.__iso_navigate&&typeof window.__iso_navigate==='function'){"
            + "window.__iso_navigate('" + safeRoute + "');return;"
            + "}"
            + "if(window.history&&typeof window.history.pushState==='function'){"
            + "window.history.pushState({},'','" + safeRoute + "');"
            + "window.dispatchEvent(new PopStateEvent('popstate',{state:{}}));return;"
            + "}"
            + "window.location.href='" + safeRoute + "';"
            + "}catch(e){window.location.href='" + safeRoute + "';}"
            + "})();";
        getBridge().getWebView().post(() ->
            getBridge().getWebView().evaluateJavascript(js, null)
        );
    }

    private void installIsotopeAndroidBridge() {
        if (androidBridgeInstalled || getBridge() == null || getBridge().getWebView() == null) {
            return;
        }
        WebView webView = getBridge().getWebView();
        configureWebViewForAndroidApp(webView);
        webView.addJavascriptInterface(new IsotopeAndroidInterface(), "IsotopeAndroid");
        androidBridgeInstalled = true;
    }

    private void configureWebViewForAndroidApp(WebView webView) {
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            webView.setRendererPriorityPolicy(WebView.RENDERER_PRIORITY_IMPORTANT, true);
        }
    }

    private void registerFloatingActionReceiver() {
        if (floatingActionReceiverRegistered) {
            return;
        }
        IntentFilter filter = new IntentFilter(ACTION_FLOATING_TIMER_ACTION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(floatingActionReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(floatingActionReceiver, filter);
        }
        floatingActionReceiverRegistered = true;
    }

    private boolean hasOverlayPermissionInternal() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this);
    }

    private void requestOverlayPermissionInternal() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || hasOverlayPermissionInternal()) {
            return;
        }
        Intent intent = new Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:" + getPackageName())
        );
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    private void startFloatingTimerService(String stateJson) {
        if (!hasOverlayPermissionInternal()) {
            requestOverlayPermissionInternal();
            return;
        }
        Intent intent = new Intent(this, FloatingTimerService.class)
            .setAction(FloatingTimerService.ACTION_START)
            .putExtra(FloatingTimerService.EXTRA_STATE_JSON, stateJson);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent);
        } else {
            startService(intent);
        }
    }

    private void updateFloatingTimerService(String stateJson) {
        if (!hasOverlayPermissionInternal()) {
            return;
        }
        Intent intent = new Intent(this, FloatingTimerService.class)
            .setAction(FloatingTimerService.ACTION_UPDATE)
            .putExtra(FloatingTimerService.EXTRA_STATE_JSON, stateJson);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent);
        } else {
            startService(intent);
        }
    }

    private void stopFloatingTimerService() {
        Intent intent = new Intent(this, FloatingTimerService.class)
            .setAction(FloatingTimerService.ACTION_STOP);
        stopService(intent);
    }

    private void expandFloatingTimerInternal() {
        Intent intent = new Intent(this, MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
    }

    private boolean supportsPictureInPicture() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
            getPackageManager().hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE);
    }

    private Rational safeAspectRatio(int requestedWidth, int requestedHeight) {
        int width = Math.max(1, requestedWidth);
        int height = Math.max(1, requestedHeight);
        double ratio = (double) width / (double) height;
        if (ratio < (1.0 / 2.39)) {
            return new Rational(100, 239);
        }
        if (ratio > 2.39) {
            return new Rational(239, 100);
        }
        return new Rational(width, height);
    }

    private void enterReducedSystemPictureInPicture(int width, int height) {
        if (!supportsPictureInPicture()) {
            notifyPipMode(false);
            return;
        }
        try {
            PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder()
                .setAspectRatio(safeAspectRatio(width, height));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                builder.setSeamlessResizeEnabled(false);
            }
            boolean entered = enterPictureInPictureMode(builder.build());
            if (!entered) {
                notifyPipMode(false);
            }
        } catch (Exception error) {
            notifyPipMode(false);
        }
    }

    private void notifyPipMode(boolean active) {
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) {
            return;
        }
        String script = "window.dispatchEvent(new CustomEvent('isotope:pip-mode',{detail:{active:" + active + "}}));";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    public void replayFloatingTimerActions() {
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) {
            return;
        }
        JSONArray queue = readActionQueue(this);
        if (queue.length() == 0) {
            return;
        }
        JSONObject action = queue.optJSONObject(0);
        if (action == null) {
            removeQueuedAction(this, null);
            replayFloatingTimerActions();
            return;
        }
        String actionId = action.optString("id", "");
        String script = "(function(){try{return !!(window.__ISO_FLOATING_TIMER__&&window.__ISO_FLOATING_TIMER__.handleNativeAction(" +
            action.toString() +
            "));}catch(e){console.error('[IsotopeAI Floating Timer] native action failed',e);return false;}})();";
        webView.post(() -> webView.evaluateJavascript(script, result -> {
            if ("true".equals(result)) {
                removeQueuedAction(MainActivity.this, actionId);
                replayFloatingTimerActions();
            }
        }));
    }

    public static void enqueueFloatingTimerAction(Context context, String type, int value) {
        if (!isAllowedFloatingTimerAction(type)) {
            return;
        }
        try {
            JSONObject action = new JSONObject();
            action.put("id", System.currentTimeMillis() + "-" + Math.abs(type.hashCode()));
            action.put("type", type);
            if ("setTarget".equals(type)) {
                action.put("value", Math.max(0, Math.min(9999, value)));
            }
            JSONArray queue = readActionQueue(context);
            queue.put(action);
            writeActionQueue(context, queue);
            Intent intent = new Intent(ACTION_FLOATING_TIMER_ACTION).setPackage(context.getPackageName());
            context.sendBroadcast(intent);
        } catch (Exception ignored) {
        }
    }

    private static boolean isAllowedFloatingTimerAction(String type) {
        return "correct".equals(type)
            || "incorrect".equals(type)
            || "skipped".equals(type)
            || "undo".equals(type)
            || "setTarget".equals(type)
            || "expand".equals(type)
            || "close".equals(type);
    }

    private static JSONArray readActionQueue(Context context) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_FLOATING_TIMER, Context.MODE_PRIVATE);
            return new JSONArray(prefs.getString(PREF_ACTION_QUEUE, "[]"));
        } catch (Exception error) {
            return new JSONArray();
        }
    }

    private static void writeActionQueue(Context context, JSONArray queue) {
        context.getSharedPreferences(PREFS_FLOATING_TIMER, Context.MODE_PRIVATE)
            .edit()
            .putString(PREF_ACTION_QUEUE, queue.toString())
            .apply();
    }

    private static void removeQueuedAction(Context context, String actionId) {
        JSONArray queue = readActionQueue(context);
        JSONArray next = new JSONArray();
        for (int i = 0; i < queue.length(); i += 1) {
            JSONObject item = queue.optJSONObject(i);
            if (item == null) {
                continue;
            }
            if (actionId != null && actionId.equals(item.optString("id", ""))) {
                continue;
            }
            next.put(item);
        }
        writeActionQueue(context, next);
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
        inPictureInPicture = isInPictureInPictureMode;
        notifyPipMode(isInPictureInPictureMode);
    }

    @Override
    public void onDestroy() {
        if (floatingActionReceiverRegistered) {
            try {
                unregisterReceiver(floatingActionReceiver);
            } catch (IllegalArgumentException ignored) {
            }
            floatingActionReceiverRegistered = false;
        }
        super.onDestroy();
    }

    public class IsotopeAndroidInterface {
        @JavascriptInterface
        public boolean hasOverlayPermission() {
            return hasOverlayPermissionInternal();
        }

        @JavascriptInterface
        public void requestOverlayPermission() {
            runOnUiThread(() -> requestOverlayPermissionInternal());
        }

        @JavascriptInterface
        public void startFloatingTimer(String stateJson) {
            runOnUiThread(() -> startFloatingTimerService(stateJson));
        }

        @JavascriptInterface
        public void updateFloatingTimerState(String stateJson) {
            runOnUiThread(() -> updateFloatingTimerService(stateJson));
        }

        @JavascriptInterface
        public void stopFloatingTimer() {
            runOnUiThread(() -> stopFloatingTimerService());
        }

        @JavascriptInterface
        public void replayFloatingTimerActions() {
            runOnUiThread(() -> MainActivity.this.replayFloatingTimerActions());
        }

        @JavascriptInterface
        public void expandFloatingTimer() {
            runOnUiThread(() -> expandFloatingTimerInternal());
        }

        @JavascriptInterface
        public boolean isPipSupported() {
            return supportsPictureInPicture();
        }

        @JavascriptInterface
        public boolean isInPipMode() {
            return inPictureInPicture;
        }

        @JavascriptInterface
        public void enterFocusPip() {
            runOnUiThread(() -> enterReducedSystemPictureInPicture(340, 390));
        }

        @JavascriptInterface
        public void enterFocusPipWithSize(double width, double height) {
            int safeWidth = Math.max(1, (int) Math.round(width));
            int safeHeight = Math.max(1, (int) Math.round(height));
            runOnUiThread(() -> enterReducedSystemPictureInPicture(safeWidth, safeHeight));
        }

        @JavascriptInterface
        public void expandFocusPip() {
            runOnUiThread(() -> expandFloatingTimerInternal());
        }
    }
}
