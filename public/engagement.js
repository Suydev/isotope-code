/**
 * IsotopeAI — Engagement Engine
 * Runs deferred. Adds gamification, celebration effects, and
 * motivational micro-interactions without touching the React bundle.
 */
(function () {
  'use strict';

  /* ── Utilities ─────────────────────────────────────────────────────── */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ── Confetti Engine ────────────────────────────────────────────────── */
  var CONFETTI_COLORS = [
    '#f97316','#fb923c','#fdba74',   // orange family
    '#fbbf24','#facc15',             // gold
    '#34d399','#6ee7b7',             // green
    '#60a5fa','#a78bfa',             // blue/purple
    '#f9a8d4',                       // pink
  ];

  function launchConfetti(opts) {
    opts = opts || {};
    var count   = opts.count  || 80;
    var origin  = opts.origin || { x: 0.5, y: 0.4 };
    var power   = opts.power  || 1.0;
    var el      = document.createElement('canvas');
    el.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
    document.body.appendChild(el);
    var ctx = el.getContext('2d');
    el.width  = window.innerWidth;
    el.height = window.innerHeight;

    var particles = [];
    for (var i = 0; i < count; i++) {
      var angle  = rnd(-Math.PI * 0.7, -Math.PI * 0.3) + (Math.random() > 0.5 ? -0.4 : 0.4) * Math.random();
      var speed  = rnd(4, 14) * power;
      var shape  = Math.random() > 0.3 ? 'rect' : 'circle';
      particles.push({
        x:   el.width  * origin.x + rnd(-60, 60),
        y:   el.height * origin.y,
        vx:  Math.cos(angle) * speed,
        vy:  Math.sin(angle) * speed,
        ax:  rnd(-0.2, 0.2),
        ay:  rnd(0.28, 0.45),
        rot: rnd(0, Math.PI * 2),
        rv:  rnd(-0.2, 0.2),
        w:   rnd(6, 13),
        h:   rnd(4, 8),
        r:   rnd(3, 7),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        alpha: 1,
        life:  rnd(0.008, 0.016),
        shape: shape,
      });
    }

    var alive = true;
    function frame() {
      if (!alive) return;
      ctx.clearRect(0, 0, el.width, el.height);
      var any = false;
      particles.forEach(function (p) {
        if (p.alpha <= 0) return;
        any = true;
        p.x  += p.vx;  p.y  += p.vy;
        p.vx += p.ax;  p.vy += p.ay;
        p.rot += p.rv;
        p.alpha -= p.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });
      if (any) requestAnimationFrame(frame);
      else { alive = false; el.remove(); }
    }
    requestAnimationFrame(frame);
  }

  /* ── Floating XP Label ─────────────────────────────────────────────── */
  function floatXP(text, originEl) {
    var label = document.createElement('div');
    label.textContent = text;
    var rect  = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
    label.style.cssText = [
      'position:fixed',
      'left:' + (rect.left + rect.width / 2) + 'px',
      'top:'  + rect.top + 'px',
      'transform:translateX(-50%)',
      'font-size:1.1rem',
      'font-weight:700',
      'color:#f97316',
      'text-shadow:0 2px 8px rgba(249,115,22,0.45)',
      'pointer-events:none',
      'z-index:99998',
      'user-select:none',
      'transition:transform 1.2s cubic-bezier(0.22,1,0.36,1),opacity 1.2s ease',
    ].join(';');
    document.body.appendChild(label);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        label.style.transform = 'translateX(-50%) translateY(-70px)';
        label.style.opacity   = '0';
      });
    });
    setTimeout(function () { label.remove(); }, 1300);
  }

  /* ── Motivational Messages ─────────────────────────────────────────── */
  var MESSAGES = [
    'Keep it up! 🔥', 'You\'re on fire!', 'Great session!',
    'Consistency wins!', 'Champion mindset!', 'One more!',
    'Elite focus!', 'You\'re crushing it!', 'Study beast!',
  ];
  var msgIdx = 0;
  function nextMessage() { return MESSAGES[(msgIdx++) % MESSAGES.length]; }

  function showMotivation(text, durationMs) {
    var existing = qs('#__iso_motivation__');
    if (existing) existing.remove();

    var el = document.createElement('div');
    el.id = '__iso_motivation__';
    el.textContent = text || nextMessage();
    el.style.cssText = [
      'position:fixed',
      'bottom:88px',
      'left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'background:linear-gradient(135deg,rgba(249,115,22,0.92),rgba(234,88,12,0.96))',
      'color:#fff',
      'font-size:0.92rem',
      'font-weight:600',
      'padding:10px 22px',
      'border-radius:9999px',
      'box-shadow:0 4px 24px rgba(249,115,22,0.50),inset 0 1px 0 rgba(255,255,255,0.25)',
      'pointer-events:none',
      'z-index:99997',
      'opacity:0',
      'transition:transform 0.36s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease',
      'white-space:nowrap',
      'backdrop-filter:blur(10px)',
    ].join(';');
    document.body.appendChild(el);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity   = '1';
        el.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(function () {
      el.style.opacity   = '0';
      el.style.transform = 'translateX(-50%) translateY(-12px)';
      setTimeout(function () { el.remove(); }, 400);
    }, durationMs || 2800);
  }

  /* ── Ripple on click ───────────────────────────────────────────────── */
  function createRipple(e) {
    var target = e.currentTarget;
    var r = document.createElement('span');
    var rect = target.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 1.4;
    r.style.cssText = [
      'position:absolute',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'left:'   + (e.clientX - rect.left - size / 2) + 'px',
      'top:'    + (e.clientY - rect.top  - size / 2) + 'px',
      'border-radius:50%',
      'background:rgba(249,115,22,0.18)',
      'pointer-events:none',
      'transform:scale(0)',
      'transition:transform 0.55s ease-out,opacity 0.55s ease-out',
      'opacity:1',
    ].join(';');
    target.style.position = target.style.position || 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(r);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        r.style.transform = 'scale(1)';
        r.style.opacity   = '0';
      });
    });
    setTimeout(function () { r.remove(); }, 600);
  }

  function attachRipples() {
    var sel = 'button,[role="button"],[class*="btn"],[class*="cursor-pointer"][class*="rounded"]';
    qsa(sel).forEach(function (el) {
      if (el.__ripple__) return;
      el.__ripple__ = true;
      el.addEventListener('mousedown', createRipple);
    });
  }

  /* ── Timer Completion Detection ────────────────────────────────────── */
  var lastTimerText = '';
  function checkTimerComplete() {
    var timerEls = qsa('[class*="timer"]:not(button):not(span):not([class*="timer-btn"])');
    timerEls.forEach(function (el) {
      var text = el.textContent || '';
      var match = text.match(/(\d+):(\d+)/);
      if (!match) return;
      var mins = parseInt(match[1], 10);
      var secs = parseInt(match[2], 10);
      var key = el.offsetParent + text;
      if ((mins === 0 && secs === 0) && lastTimerText !== key) {
        lastTimerText = key;
        setTimeout(function () {
          launchConfetti({ count: 120, power: 1.3 });
          showMotivation('Session complete! 🏆', 3500);
        }, 300);
      }
    });
  }

  /* ── Streak Celebration ────────────────────────────────────────────── */
  var STREAK_MILESTONES = [3, 5, 7, 10, 14, 21, 30, 50, 100];
  var celebratedStreaks  = new Set();

  function checkStreakMilestone() {
    var streakEls = qsa('[class*="streak"],[class*="day-streak"],[class*="streak-count"]');
    streakEls.forEach(function (el) {
      var n = parseInt(el.textContent, 10);
      if (isNaN(n)) return;
      if (STREAK_MILESTONES.indexOf(n) !== -1 && !celebratedStreaks.has(n)) {
        celebratedStreaks.add(n);
        launchConfetti({ count: 150, power: 1.5, origin: { x: 0.5, y: 0.35 } });
        showMotivation(n + '-day streak! You\'re legendary! 🔥', 4000);
      }
    });
  }

  /* ── Task / Topic Completion ───────────────────────────────────────── */
  var completedCount = 0;
  var COMPLETION_XP   = ['+10 XP', '+15 XP', '+20 XP', '+25 XP', '+50 XP 🎯'];

  function onCheckboxChange(e) {
    if (!e.target.checked) return;
    completedCount++;
    floatXP(COMPLETION_XP[Math.min(Math.floor(completedCount / 3), COMPLETION_XP.length - 1)], e.target);
    if (completedCount % 5 === 0) {
      launchConfetti({ count: 60, power: 0.9, origin: { x: 0.5, y: 0.5 } });
      showMotivation(nextMessage(), 2500);
    }
  }

  function attachCheckboxListeners() {
    qsa('input[type="checkbox"]').forEach(function (cb) {
      if (cb.__xp__) return;
      cb.__xp__ = true;
      cb.addEventListener('change', onCheckboxChange);
    });
  }

  /* ── Study Time Milestone Toasts ────────────────────────────────────── */
  var studyTimeMins      = 0;
  var STUDY_MILESTONES   = [25, 50, 90, 120, 180];
  var reachedMilestones  = new Set();
  var studyInterval      = null;

  function startStudyTimer() {
    if (studyInterval) return;
    studyInterval = setInterval(function () {
      studyTimeMins++;
      STUDY_MILESTONES.forEach(function (m) {
        if (studyTimeMins >= m && !reachedMilestones.has(m)) {
          reachedMilestones.add(m);
          var msg = m === 25  ? '25 min focus! Pomodoro champ! 🍅'
                  : m === 50  ? '50 minutes! Half-century! ⚡'
                  : m === 90  ? '90 minutes! Deep work hero! 🧠'
                  : m === 120 ? '2 hours! Unstoppable! 🚀'
                  : m + ' min of pure focus! Legend! 🏆';
          showMotivation(msg, 3500);
          if (m >= 50) launchConfetti({ count: 80, power: 1.1 });
        }
      });
    }, 60000);
  }

  /* ── Inactivity → Motivate ──────────────────────────────────────────── */
  var INACTIVITY_MS = 5 * 60 * 1000;
  var inactivityTimer;
  var INACTIVITY_MSGS = [
    "You still there? Let's get back to it! 💪",
    'Your future self thanks you for studying now. 📚',
    'Every minute counts. Keep going! ⏱️',
    'Consistency is a superpower. Start now! ⚡',
  ];
  var inactMsgIdx = 0;

  function resetInactivity() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function () {
      showMotivation(INACTIVITY_MSGS[(inactMsgIdx++) % INACTIVITY_MSGS.length], 4000);
    }, INACTIVITY_MS);
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(function (evt) {
    document.addEventListener(evt, resetInactivity, { passive: true });
  });
  resetInactivity();

  /* ── Scroll-based Reveal ─────────────────────────────────────────────── */
  var revealObserver;
  function setupReveal() {
    if (typeof IntersectionObserver === 'undefined') return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '';
          entry.target.style.transform = '';
          entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    qsa('[class*="card"],[class*="rounded-2xl"][class*="border"]').forEach(function (el) {
      if (el.__reveal__) return;
      el.__reveal__ = true;
      var rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';
        revealObserver.observe(el);
      }
    });
  }

  /* ── MutationObserver — watch for dynamic content ──────────────────── */
  var domObserver = new MutationObserver(function (mutations) {
    var changed = mutations.some(function (m) { return m.addedNodes.length > 0; });
    if (changed) {
      attachRipples();
      attachCheckboxListeners();
      checkTimerComplete();
      checkStreakMilestone();
      setupReveal();
    }
  });

  /* ── Keyboard Shortcut: Ctrl+Shift+C → confetti ────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      launchConfetti({ count: 200, power: 1.8, origin: { x: 0.5, y: 0.35 } });
    }
  });

  /* ── Init ───────────────────────────────────────────────────────────── */
  function init() {
    attachRipples();
    attachCheckboxListeners();
    checkStreakMilestone();
    setupReveal();
    startStudyTimer();

    domObserver.observe(document.body, {
      childList: true,
      subtree:   true,
    });

    // Welcoming XP burst after 1.5s
    setTimeout(function () {
      floatXP('Welcome back! ✨', document.body);
    }, 1500);

    // Periodic timer checks (every 3s)
    setInterval(checkTimerComplete, 3000);
    // Periodic streak checks (every 10s)
    setInterval(checkStreakMilestone, 10000);
    // Refresh ripples every 5s for dynamic content
    setInterval(attachRipples, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
