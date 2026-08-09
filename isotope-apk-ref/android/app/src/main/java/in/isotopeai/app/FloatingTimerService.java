package in.isotopeai.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.text.InputType;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.json.JSONObject;

/**
 * IsotopeAI Floating Timer overlay service.
 *
 * Visual design mirrors the isotope-code web app Focus page:
 *   - Card: zinc-950 dark / white light, 24dp corners, subtle border
 *   - Progress strip: brand-violet (running) or sky-blue (break)
 *   - Timer: 56sp monospace bold, full width centered
 *   - Status dot: emerald (running) / sky (break) / amber (paused)
 *   - Focus chip: brand-violet/10 background
 *   - Controls: emerald correct, rose incorrect, amber skip — 16dp radius
 *   - Brand: rgb(139, 92, 246) = violet-500
 */
public class FloatingTimerService extends Service {
    public static final String ACTION_START  = "in.isotopeai.app.action.FLOATING_TIMER_START";
    public static final String ACTION_UPDATE = "in.isotopeai.app.action.FLOATING_TIMER_UPDATE";
    public static final String ACTION_STOP   = "in.isotopeai.app.action.FLOATING_TIMER_STOP";
    public static final String EXTRA_STATE_JSON = "state_json";

    // Brand / semantic colors — match isotope-code CSS variables
    private static final int BRAND_500   = Color.rgb(139,  92, 246); // violet-500
    private static final int BRAND_600   = Color.rgb(124,  58, 237); // violet-600
    private static final int EMERALD_600 = Color.rgb(  5, 150, 105); // correct
    private static final int ROSE_600    = Color.rgb(225,  29,  72); // incorrect
    private static final int AMBER_600   = Color.rgb(217, 119,   6); // skip / paused
    private static final int SKY_400     = Color.rgb( 56, 189, 248); // break

    private static final int NOTIFICATION_ID = 4107;
    private static final String CHANNEL_ID   = "isotope-floating-timer";
    private static final String PREF_X       = "overlay_x";
    private static final String PREF_Y       = "overlay_y";
    private static final String PREF_WIDTH   = "overlay_width";
    private static final String PREF_HEIGHT  = "overlay_height";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private WindowManager windowManager;
    private WindowManager.LayoutParams layoutParams;
    private View rootView;
    private LinearLayout cardView;          // outermost card (no padding)
    private LinearLayout contentView;       // padded inner container
    private LinearLayout questionSection;
    private LinearLayout targetEditorRow;
    private View         progressFill;      // brand-colored progress strip fill
    private View         progressContainer; // full-width strip container
    private TextView headingText;
    private TextView timerText;
    private TextView statusDot;
    private TextView statusText;
    private TextView focusTypeText;
    private TextView attemptedText;
    private TextView targetValueText;
    private Button   expandButton;
    private Button   closeButton;
    private Button   correctButton;
    private Button   incorrectButton;
    private Button   skippedButton;
    private Button   undoButton;
    private Button   targetButton;
    private TimerState state = TimerState.idle();
    private boolean foregroundStarted = false;
    private boolean dragging  = false;
    private boolean resizing  = false;
    private float   touchStartX = 0;
    private float   touchStartY = 0;
    private int     windowStartX = 0;
    private int     windowStartY = 0;
    private int     resizeStartWidth  = 0;
    private int     resizeStartHeight = 0;

    private final Runnable tickRunnable = new Runnable() {
        @Override public void run() {
            if (state == null || !state.isActive()) { stopSelf(); return; }
            renderDynamicFields();
            handler.postDelayed(this, 500);
        }
    };

    // ─────────────────────────── Lifecycle ───────────────────────────────────

    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : ACTION_UPDATE;
        if (ACTION_STOP.equals(action)) { stopSelf(); return START_NOT_STICKY; }

        String stateJson = intent != null ? intent.getStringExtra(EXTRA_STATE_JSON) : null;
        TimerState nextState = TimerState.fromJson(stateJson);
        if (!nextState.isActive()) { stopSelf(); return START_NOT_STICKY; }
        state = nextState;

        if (!hasOverlayPermission()) { stopSelf(); return START_NOT_STICKY; }

        ensureForeground();
        ensureOverlay();
        renderAll();
        handler.removeCallbacks(tickRunnable);
        handler.post(tickRunnable);
        return START_STICKY;
    }

    @Override public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        removeOverlay();
        foregroundStarted = false;
        super.onDestroy();
    }

    // ─────────────────────────── Foreground / overlay setup ──────────────────

    private boolean hasOverlayPermission() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this);
    }

    private void ensureForeground() {
        if (foregroundStarted) return;
        startForeground(NOTIFICATION_ID, buildNotification());
        foregroundStarted = true;
    }

    private Notification buildNotification() {
        Intent openIntent = new Intent(this, MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(
            this, 4108, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, CHANNEL_ID)
            : new Notification.Builder(this);
        return builder
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Focus Timer")
            .setContentText("IsotopeAI focus session is running")
            .setContentIntent(contentIntent)
            .setOngoing(true)
            .setShowWhen(false)
            .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel ch = new NotificationChannel(
            CHANNEL_ID, "Floating Timer", NotificationManager.IMPORTANCE_LOW);
        ch.setDescription("Keeps the IsotopeAI Floating Timer active.");
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.createNotificationChannel(ch);
    }

    private void ensureOverlay() {
        if (rootView != null) return;
        buildOverlayView();
        SharedPreferences prefs = getSharedPreferences(MainActivity.PREFS_FLOATING_TIMER, MODE_PRIVATE);
        layoutParams = new WindowManager.LayoutParams(
            clampOverlayWidth(prefs.getInt(PREF_WIDTH, dp(300))),
            clampOverlayHeight(prefs.getInt(PREF_HEIGHT, dp(340))),
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT);
        layoutParams.gravity = Gravity.TOP | Gravity.START;
        layoutParams.x = prefs.getInt(PREF_X, dp(18));
        layoutParams.y = prefs.getInt(PREF_Y, dp(72));
        try {
            windowManager.addView(rootView, layoutParams);
        } catch (Exception e) {
            rootView = null;
            stopSelf();
        }
    }

    private void removeOverlay() {
        if (rootView != null && windowManager != null) {
            try { windowManager.removeView(rootView); } catch (Exception ignored) {}
        }
        rootView = null;
    }

    // ─────────────────────────── View construction ───────────────────────────

    private void buildOverlayView() {
        // Root transparent frame — drag target
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.TRANSPARENT);

        // ── Card (outermost, no padding — progress bar must be edge-to-edge) ─
        cardView = new LinearLayout(this);
        cardView.setOrientation(LinearLayout.VERTICAL);
        cardView.setOnTouchListener(this::handleDragTouch);

        // ── Progress strip container (full width, 4dp tall) ──────────────────
        progressContainer = new FrameLayout(this);
        FrameLayout progressFrame = (FrameLayout) progressContainer;

        // background track (zinc/5)
        progressFrame.setBackgroundColor(Color.argb(13, 139, 92, 246)); // brand/5

        // fill (scales from left)
        progressFill = new View(this);
        progressFill.setScaleX(0f);
        progressFill.setPivotX(0f);
        progressFill.setPivotY(0f);
        progressFill.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT));
        progressFrame.addView(progressFill);

        cardView.addView(progressContainer,
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(4)));

        // ── Padded content ───────────────────────────────────────────────────
        contentView = new LinearLayout(this);
        contentView.setOrientation(LinearLayout.VERTICAL);
        contentView.setPadding(dp(16), dp(12), dp(16), dp(16));

        // Header row: heading  [expand] [close]
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);

        headingText = makeText(11, true);
        headingText.setLetterSpacing(0.08f);
        headingText.setAllCaps(true);
        header.addView(headingText,
            new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

        expandButton = makeIconButton("↗", () -> {
            dispatchAction("expand", -1);
            openMainActivity();
            stopSelf();
        });
        closeButton = makeIconButton("×", () -> {
            dispatchAction("close", -1);
            stopSelf();
        });
        header.addView(expandButton);
        header.addView(closeButton);

        // Focus type chip: emoji + label inside a pill
        focusTypeText = makeText(13, true);
        focusTypeText.setGravity(Gravity.CENTER);
        focusTypeText.setPadding(dp(12), dp(5), dp(12), dp(5));
        LinearLayout.LayoutParams chipParams =
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        chipParams.gravity = Gravity.CENTER_HORIZONTAL;
        chipParams.topMargin    = dp(6);
        chipParams.bottomMargin = dp(4);

        // Timer text — large, monospace, centered
        timerText = makeText(56, true);
        timerText.setGravity(Gravity.CENTER);
        timerText.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        timerText.setLetterSpacing(-0.02f);
        LinearLayout.LayoutParams timerParams =
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        timerParams.topMargin    = dp(2);
        timerParams.bottomMargin = dp(4);

        // Status row: ● Focusing...
        LinearLayout statusRow = new LinearLayout(this);
        statusRow.setOrientation(LinearLayout.HORIZONTAL);
        statusRow.setGravity(Gravity.CENTER);
        statusDot  = makeText(10, true);
        statusText = makeText(11, false);
        statusText.setLetterSpacing(0.05f);
        statusText.setAllCaps(true);
        statusRow.addView(statusDot);
        statusRow.addView(statusText);

        // ── Question tracking section ─────────────────────────────────────────
        questionSection = new LinearLayout(this);
        questionSection.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams qsParams =
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        qsParams.topMargin = dp(10);

        // Attempts row
        LinearLayout attemptRow = new LinearLayout(this);
        attemptRow.setGravity(Gravity.CENTER_VERTICAL);
        attemptRow.setOrientation(LinearLayout.HORIZONTAL);
        attemptedText = makeText(26, true);
        targetButton  = makePillButton("Target");
        targetButton.setOnClickListener(v -> showTargetDialog());
        attemptRow.addView(attemptedText,
            new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        attemptRow.addView(targetButton);

        // Target quick-editor
        targetValueText = makeText(12, false);
        targetEditorRow = new LinearLayout(this);
        targetEditorRow.setGravity(Gravity.CENTER);
        targetEditorRow.setOrientation(LinearLayout.HORIZONTAL);
        Button minus = makePillButton("−5");
        Button plus  = makePillButton("+5");
        Button zero  = makePillButton("0");
        minus.setOnClickListener(v -> updateTargetBy(-5));
        plus.setOnClickListener(v -> updateTargetBy(5));
        zero.setOnClickListener(v -> setTarget(0));
        targetEditorRow.addView(minus);
        targetEditorRow.addView(targetValueText);
        targetEditorRow.addView(plus);
        targetEditorRow.addView(zero);
        targetEditorRow.setVisibility(View.GONE);

        // Result buttons: Correct / Incorrect / Skip — rounded-2xl style
        LinearLayout resultRow = new LinearLayout(this);
        resultRow.setOrientation(LinearLayout.HORIZONTAL);
        resultRow.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams rrParams =
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        rrParams.topMargin = dp(6);

        correctButton   = makeResultButton("✓");
        incorrectButton = makeResultButton("✕");
        skippedButton   = makeResultButton("↷");
        correctButton.setOnClickListener(v -> dispatchAction("correct", -1));
        incorrectButton.setOnClickListener(v -> dispatchAction("incorrect", -1));
        skippedButton.setOnClickListener(v -> dispatchAction("skipped", -1));

        int btnH = dp(44);
        int gap  = dp(6);
        LinearLayout.LayoutParams bpL = new LinearLayout.LayoutParams(0, btnH, 1f);
        LinearLayout.LayoutParams bpM = new LinearLayout.LayoutParams(0, btnH, 1f);
        LinearLayout.LayoutParams bpR = new LinearLayout.LayoutParams(0, btnH, 1f);
        bpL.setMargins(0, 0, gap, 0);
        bpM.setMargins(0, 0, gap, 0);
        resultRow.addView(correctButton,   bpL);
        resultRow.addView(incorrectButton, bpM);
        resultRow.addView(skippedButton,   bpR);

        // Undo button
        undoButton = makePillButton("Undo last");
        undoButton.setOnClickListener(v -> dispatchAction("undo", -1));
        LinearLayout.LayoutParams undoParams =
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(36));
        undoParams.topMargin = dp(6);

        questionSection.addView(attemptRow);
        questionSection.addView(targetEditorRow);
        questionSection.addView(resultRow, rrParams);
        questionSection.addView(undoButton, undoParams);

        // Assemble content
        contentView.addView(header);
        contentView.addView(focusTypeText, chipParams);
        contentView.addView(timerText, timerParams);
        contentView.addView(statusRow);
        contentView.addView(questionSection, qsParams);

        cardView.addView(contentView,
            new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));

        root.addView(cardView,
            new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        // Resize handle (bottom-right)
        TextView resizeHandle = makeText(16, true);
        resizeHandle.setText("◢");
        resizeHandle.setGravity(Gravity.CENTER);
        resizeHandle.setTextColor(Color.argb(60, 255, 255, 255));
        resizeHandle.setOnTouchListener(this::handleResizeTouch);
        root.addView(resizeHandle,
            new FrameLayout.LayoutParams(dp(36), dp(36), Gravity.BOTTOM | Gravity.RIGHT));

        rootView = root;
    }

    // ─────────────────────────── Rendering ───────────────────────────────────

    private void renderAll() {
        if (cardView == null || state == null) return;

        boolean dark    = "dark".equals(state.theme);
        boolean isBreak = "break".equals(state.timerState) || "break".equals(state.activePhase);

        // Semantic colors
        int cardBgColor = dark ? Color.rgb(14, 14, 17) : Color.WHITE;   // zinc-950 / white
        int textColor   = dark ? Color.WHITE : Color.rgb(24, 24, 27);    // white / zinc-900
        int mutedColor  = dark ? Color.rgb(161, 161, 170)                // zinc-400
                               : Color.rgb(113, 113, 122);               // zinc-500
        int borderAlpha = dark ? 25  : 30; // white/10 dark, zinc/12 light
        int borderColor = dark ? Color.argb(borderAlpha, 255, 255, 255)
                               : Color.argb(borderAlpha,  24,  24,  27);

        // ── Card background + border ─────────────────────────────────────────
        GradientDrawable cardBg = new GradientDrawable();
        cardBg.setColor(cardBgColor);
        cardBg.setCornerRadius(dp(24));
        cardBg.setStroke(dp(1), borderColor);
        cardView.setBackground(cardBg);

        // ── Progress strip color ─────────────────────────────────────────────
        int stripColor = isBreak ? SKY_400 : BRAND_500;
        GradientDrawable fillBg = new GradientDrawable();
        fillBg.setColor(stripColor);
        if (progressFill != null) progressFill.setBackground(fillBg);

        // Progress container top-corners must match card to avoid visible overhang
        GradientDrawable trackBg = new GradientDrawable();
        trackBg.setColor(dark ? Color.argb(20, 139, 92, 246) : Color.argb(12, 139, 92, 246));
        // top-left and top-right corners match card
        trackBg.setCornerRadii(new float[]{dp(24), dp(24), dp(24), dp(24), 0, 0, 0, 0});
        if (progressContainer != null) progressContainer.setBackground(trackBg);

        // ── Focus type chip ──────────────────────────────────────────────────
        GradientDrawable chipBg = new GradientDrawable();
        chipBg.setColor(dark ? Color.argb(30, 139, 92, 246) : Color.argb(18, 139, 92, 246));
        chipBg.setCornerRadius(dp(999));
        chipBg.setStroke(dp(1), dark ? Color.argb(50, 139, 92, 246) : Color.argb(35, 139, 92, 246));
        focusTypeText.setBackground(chipBg);
        focusTypeText.setTextColor(dark ? Color.rgb(196, 181, 253) : Color.rgb(109, 40, 217)); // brand-300 / brand-700

        // ── Text colors ──────────────────────────────────────────────────────
        headingText.setTextColor(mutedColor);
        timerText.setTextColor(textColor);
        statusText.setTextColor(mutedColor);
        attemptedText.setTextColor(textColor);
        targetValueText.setTextColor(mutedColor);

        // ── Expand button (brand accent) ─────────────────────────────────────
        GradientDrawable expandBg = new GradientDrawable();
        expandBg.setColor(dark ? Color.argb(30, 139, 92, 246) : Color.argb(15, 139, 92, 246));
        expandBg.setCornerRadius(dp(10));
        expandButton.setBackground(expandBg);
        expandButton.setTextColor(BRAND_500);

        // ── Close button (subtle) ────────────────────────────────────────────
        GradientDrawable closeBg = new GradientDrawable();
        closeBg.setColor(dark ? Color.argb(15, 255, 255, 255) : Color.argb(8, 24, 24, 27));
        closeBg.setCornerRadius(dp(10));
        closeButton.setBackground(closeBg);
        closeButton.setTextColor(mutedColor);

        // ── Target / question-section buttons ────────────────────────────────
        int targetBg     = dark ? Color.argb(20, 255, 255, 255) : Color.argb(10, 24, 24, 27);
        int targetBorder = dark ? Color.argb(45, 255, 255, 255) : Color.argb(30, 24, 24, 27);
        styleButton(targetButton,    targetBg,     textColor,    targetBorder);
        styleButton(correctButton,   EMERALD_600,  Color.WHITE,  Color.TRANSPARENT);
        styleButton(incorrectButton, ROSE_600,     Color.WHITE,  Color.TRANSPARENT);
        styleButton(skippedButton,   AMBER_600,    Color.WHITE,  Color.TRANSPARENT);
        styleButton(undoButton,      Color.TRANSPARENT, mutedColor,
                    dark ? Color.argb(36, 255, 255, 255) : Color.argb(36, 24, 24, 27));

        renderDynamicFields();
    }

    private void renderDynamicFields() {
        if (state == null || timerText == null) return;

        boolean isBreak = "break".equals(state.timerState) || "break".equals(state.activePhase);
        int seconds = state.displaySecondsNow();

        // Timer digits
        timerText.setText(formatSeconds(seconds));

        // Heading: mode label + pomodoro cycle
        String heading;
        if ("stopwatch".equals(state.mode)) {
            heading = "Stopwatch";
        } else if (state.pomodoroCycle > 0 && state.pomodoroSessionsUntilLongBreak > 0) {
            heading = "Pomodoro  " + state.pomodoroCycle + " / " + state.pomodoroSessionsUntilLongBreak;
        } else {
            heading = "Pomodoro";
        }
        headingText.setText(heading);

        // Status dot + text
        statusDot.setText("● ");
        statusDot.setTextColor(state.statusColor());
        statusText.setText(state.statusLabel());

        // Focus type chip
        String chip = state.focusTypeIcon + "  " + state.focusTypeLabel;
        focusTypeText.setText(chip);

        // Question section
        questionSection.setVisibility(state.showQuestionControls ? View.VISIBLE : View.GONE);
        attemptedText.setText(
            state.questionsAttempted
            + (state.targetQuestions > 0 ? " / " + state.targetQuestions : ""));
        targetValueText.setText("  Target " + state.targetQuestions + "  ");
        correctButton.setText("✓  " + state.questionsCorrect);
        incorrectButton.setText("✕  " + state.questionsIncorrect);
        skippedButton.setText("↷  " + state.questionsSkipped);
        undoButton.setEnabled(state.undoAvailable);
        undoButton.setAlpha(state.undoAvailable ? 1f : 0.4f);

        // Progress strip — fraction of time remaining
        if (progressFill != null) {
            float ratio;
            if ("stopwatch".equals(state.mode)) {
                // Stopwatch: fill grows — cap at a rolling 25-min cycle
                int cycleLen = 25 * 60;
                ratio = Math.min(1f, (float)(seconds % cycleLen) / cycleLen);
            } else if (state.totalSeconds > 0) {
                // Countdown: fraction of time remaining
                ratio = Math.max(0f, Math.min(1f, (float) seconds / state.totalSeconds));
            } else {
                ratio = 0f;
            }
            final float finalRatio = ratio;
            progressFill.post(() -> progressFill.setScaleX(finalRatio));
        }

        if (!state.isActive()) stopSelf();
    }

    // ─────────────────────────── Touch handling ──────────────────────────────

    private boolean handleDragTouch(View view, MotionEvent event) {
        if (layoutParams == null || windowManager == null) return false;
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                dragging    = false;
                touchStartX = event.getRawX();
                touchStartY = event.getRawY();
                windowStartX = layoutParams.x;
                windowStartY = layoutParams.y;
                return true;
            case MotionEvent.ACTION_MOVE:
                int dx = Math.round(event.getRawX() - touchStartX);
                int dy = Math.round(event.getRawY() - touchStartY);
                if (Math.abs(dx) > dp(3) || Math.abs(dy) > dp(3)) {
                    dragging = true;
                    layoutParams.x = windowStartX + dx;
                    layoutParams.y = Math.max(0, windowStartY + dy);
                    try { windowManager.updateViewLayout(rootView, layoutParams); }
                    catch (Exception ignored) {}
                }
                return true;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (dragging) {
                    getSharedPreferences(MainActivity.PREFS_FLOATING_TIMER, MODE_PRIVATE)
                        .edit()
                        .putInt(PREF_X, layoutParams.x)
                        .putInt(PREF_Y, layoutParams.y)
                        .apply();
                }
                dragging = false;
                return false;
            default:
                return false;
        }
    }

    private boolean handleResizeTouch(View view, MotionEvent event) {
        if (layoutParams == null || windowManager == null) return false;
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                resizing = true;
                touchStartX      = event.getRawX();
                touchStartY      = event.getRawY();
                resizeStartWidth  = layoutParams.width;
                resizeStartHeight = layoutParams.height;
                return true;
            case MotionEvent.ACTION_MOVE:
                if (!resizing) return true;
                layoutParams.width  = clampOverlayWidth(resizeStartWidth  + Math.round(event.getRawX() - touchStartX));
                layoutParams.height = clampOverlayHeight(resizeStartHeight + Math.round(event.getRawY() - touchStartY));
                try { windowManager.updateViewLayout(rootView, layoutParams); }
                catch (Exception ignored) {}
                return true;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (resizing) {
                    getSharedPreferences(MainActivity.PREFS_FLOATING_TIMER, MODE_PRIVATE)
                        .edit()
                        .putInt(PREF_WIDTH,  layoutParams.width)
                        .putInt(PREF_HEIGHT, layoutParams.height)
                        .apply();
                }
                resizing = false;
                return true;
            default:
                return false;
        }
    }

    // ─────────────────────────── User actions ────────────────────────────────

    private void updateTargetBy(int delta) {
        setTarget(Math.max(0, Math.min(9999, state.targetQuestions + delta)));
    }

    private void showTargetDialog() {
        EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_NUMBER);
        input.setSingleLine(true);
        input.setText(state.targetQuestions > 0 ? String.valueOf(state.targetQuestions) : "");
        input.setSelectAllOnFocus(true);
        input.setPadding(dp(20), dp(12), dp(20), dp(12));

        AlertDialog dialog = new AlertDialog.Builder(this)
            .setTitle("Set target questions")
            .setView(input)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Set", (d, which) -> {
                int value = 0;
                try { value = Integer.parseInt(input.getText().toString().trim()); }
                catch (Exception ignored) {}
                setTarget(Math.max(0, Math.min(9999, value)));
            })
            .create();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && dialog.getWindow() != null) {
            dialog.getWindow().setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY);
        }
        dialog.setOnShowListener(d -> {
            if (dialog.getWindow() != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                dialog.getWindow().setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY);
            }
            input.requestFocus();
        });
        try { dialog.show(); } catch (Exception ignored) { updateTargetBy(5); }
    }

    private void setTarget(int value) {
        state.targetQuestions = Math.max(0, Math.min(9999, value));
        dispatchAction("setTarget", state.targetQuestions);
        renderDynamicFields();
    }

    private void dispatchAction(String type, int value) {
        MainActivity.enqueueFloatingTimerAction(getApplicationContext(), type, value);
    }

    private void openMainActivity() {
        Intent intent = new Intent(this, MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
    }

    // ─────────────────────────── View helpers ────────────────────────────────

    private TextView makeText(int sp, boolean bold) {
        TextView view = new TextView(this);
        view.setTextSize(sp);
        view.setIncludeFontPadding(false);
        if (bold) view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return view;
    }

    private Button makeIconButton(String text, Runnable action) {
        Button button = new Button(this);
        button.setText(text);
        button.setAllCaps(false);
        button.setTextSize(16);
        button.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        button.setPadding(dp(8), dp(2), dp(8), dp(2));
        button.setOnClickListener(v -> action.run());
        // Background set in renderAll()
        LinearLayout.LayoutParams lp =
            new LinearLayout.LayoutParams(dp(36), dp(28));
        lp.setMargins(dp(4), 0, 0, 0);
        button.setLayoutParams(lp);
        return button;
    }

    private Button makeResultButton(String text) {
        Button button = makePillButton(text);
        button.setTextSize(13);
        return button;
    }

    private Button makePillButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setAllCaps(false);
        button.setTextSize(12);
        button.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        button.setTextColor(Color.WHITE);
        button.setPadding(dp(10), 0, dp(10), 0);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(BRAND_500);
        bg.setCornerRadius(dp(16)); // rounded-2xl
        button.setBackground(bg);
        return button;
    }

    private void styleButton(Button button, int bgColor, int textColor, int strokeColor) {
        if (button == null) return;
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(bgColor);
        bg.setCornerRadius(dp(16)); // rounded-2xl — matches isotope-code control buttons
        if (strokeColor != Color.TRANSPARENT) bg.setStroke(dp(1), strokeColor);
        button.setTextColor(textColor);
        button.setBackground(bg);
    }

    // ─────────────────────────── Formatting ──────────────────────────────────

    private String formatSeconds(int totalSeconds) {
        int s = Math.max(0, totalSeconds);
        int days    = s / 86400;
        int hours   = (s % 86400) / 3600;
        int minutes = (s % 3600) / 60;
        int secs    = s % 60;
        if (days > 0)  return days  + "d " + hours + ":" + two(minutes) + ":" + two(secs);
        if (hours > 0) return hours + ":" + two(minutes) + ":" + two(secs);
        return minutes + ":" + two(secs);
    }

    private String two(int v) { return v < 10 ? "0" + v : String.valueOf(v); }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private int clampOverlayWidth(int value) {
        int config = getResources().getConfiguration().orientation;
        int screenW = getResources().getDisplayMetrics().widthPixels;
        boolean landscape = (config == Configuration.ORIENTATION_LANDSCAPE);
        // Landscape on tablet: cap at 36% of screen width to avoid covering content
        // Portrait/phone: cap at 440dp or screen width – 24dp
        int max = landscape
            ? Math.max(dp(280), (int)(screenW * 0.36f))
            : Math.max(dp(280), Math.min(dp(440), screenW - dp(24)));
        return Math.max(dp(240), Math.min(max, value));
    }

    private int clampOverlayHeight(int value) {
        int screenH = getResources().getDisplayMetrics().heightPixels;
        // Never exceed 70% of screen height so content remains visible behind overlay
        int max = Math.max(dp(240), (int)(screenH * 0.70f));
        return Math.max(dp(200), Math.min(max, value));
    }

    // ─────────────────────────── TimerState ──────────────────────────────────

    private static class TimerState {
        String mode       = "pomodoro";
        String timerState = "idle";
        String activePhase = "";
        long   completionAtMs = 0;
        long   updatedAtMs    = System.currentTimeMillis();
        int    displayedSeconds = 0;
        int    totalSeconds     = 0;
        int    pomodoroCycle    = 1;
        int    pomodoroSessionsUntilLongBreak = 4;
        String focusTypeLabel = "Focus";
        String focusTypeIcon  = "📌";
        boolean showQuestionControls = false;
        int     questionsAttempted   = 0;
        int     questionsCorrect     = 0;
        int     questionsIncorrect   = 0;
        int     questionsSkipped     = 0;
        int     targetQuestions      = 0;
        boolean undoAvailable        = false;
        String  theme = "dark";

        static TimerState idle() { return new TimerState(); }

        static TimerState fromJson(String json) {
            TimerState s = new TimerState();
            if (json == null || json.trim().isEmpty()) return s;
            try {
                JSONObject o = new JSONObject(json);
                s.mode         = "stopwatch".equals(o.optString("mode")) ? "stopwatch" : "pomodoro";
                String raw     = o.optString("timerState", "idle");
                s.timerState   = isTimerState(raw) ? raw : "idle";
                s.activePhase  = o.optString("activePhase", "");
                s.completionAtMs   = Math.max(0, o.optLong("completionAtMs", 0));
                s.updatedAtMs      = Math.max(0, o.optLong("updatedAtMs", System.currentTimeMillis()));
                s.displayedSeconds = clamp(o.optInt("displayedSeconds", 0),     0, 365 * 24 * 3600);
                s.totalSeconds     = clamp(o.optInt("totalSeconds", s.displayedSeconds), 0, 365 * 24 * 3600);
                s.pomodoroCycle    = clamp(o.optInt("pomodoroCycle", 1), 1, 999);
                s.pomodoroSessionsUntilLongBreak = clamp(o.optInt("pomodoroSessionsUntilLongBreak", 4), 1, 99);
                s.focusTypeLabel   = cleanText(o.optString("focusTypeLabel", "Focus"), 48, "Focus");
                s.focusTypeIcon    = cleanText(o.optString("focusTypeIcon",  "📌"),     8,  "📌");
                s.showQuestionControls = o.optBoolean("showQuestionControls", false);
                s.questionsAttempted   = clamp(o.optInt("questionsAttempted",  0), 0, 999999);
                s.questionsCorrect     = clamp(o.optInt("questionsCorrect",    0), 0, 999999);
                s.questionsIncorrect   = clamp(o.optInt("questionsIncorrect",  0), 0, 999999);
                s.questionsSkipped     = clamp(o.optInt("questionsSkipped",    0), 0, 999999);
                s.targetQuestions      = clamp(o.optInt("targetQuestions",     0), 0, 9999);
                s.undoAvailable = o.optBoolean("undoAvailable", false);
                s.theme         = "light".equals(o.optString("theme")) ? "light" : "dark";
            } catch (Exception ignored) {}
            return s;
        }

        boolean isActive() {
            if (!("running".equals(timerState) || "paused".equals(timerState) || "break".equals(timerState)))
                return false;
            return "stopwatch".equals(mode) || displaySecondsNow() > 0 || "paused".equals(timerState);
        }

        int displaySecondsNow() {
            long now = System.currentTimeMillis();
            if (("running".equals(timerState) || "break".equals(timerState)) && "stopwatch".equals(mode))
                return clamp(displayedSeconds + (int) Math.max(0, (now - updatedAtMs) / 1000), 0, 365 * 24 * 3600);
            if (("running".equals(timerState) || "break".equals(timerState)) && completionAtMs > 0)
                return clamp((int) Math.ceil(Math.max(0, completionAtMs - now) / 1000.0), 0, 365 * 24 * 3600);
            return displayedSeconds;
        }

        String statusLabel() {
            if ("running".equals(timerState)) return "Focusing";
            if ("paused".equals(timerState))  return "Paused";
            if ("break".equals(timerState) || "break".equals(activePhase)) return "Break";
            return "Idle";
        }

        int statusColor() {
            // emerald-500 running / sky-400 break / amber-500 paused / zinc-500 idle
            if ("running".equals(timerState)) return Color.rgb( 16, 185, 129); // emerald-500
            if ("paused".equals(timerState))  return Color.rgb(245, 158,  11); // amber-500
            if ("break".equals(timerState) || "break".equals(activePhase)) return Color.rgb(56, 189, 248); // sky-400
            return Color.rgb(113, 113, 122); // zinc-500
        }

        private static boolean isTimerState(String v) {
            return "idle".equals(v) || "running".equals(v) || "paused".equals(v) || "break".equals(v);
        }

        private static int clamp(int value, int min, int max) {
            return Math.max(min, Math.min(max, value));
        }

        private static String cleanText(String value, int max, String fallback) {
            if (value == null) return fallback;
            String t = value.trim();
            if (t.isEmpty()) return fallback;
            return t.length() > max ? t.substring(0, max) : t;
        }
    }
}
