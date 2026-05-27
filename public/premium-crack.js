/* premium-crack.js — IsotopeAI runtime premium unlock + persistent guest mode
   Strategy (layered, no bundle modification):
   1. localStorage.getItem interception  — store initialises with "scholar" plan
   2. localStorage.setItem interception  — plan can never be downgraded to "free"
   3. fetch interception                 — Supabase REST responses patched in-flight
   4. React-fiber walk + setInterval    — calls setPlanType("scholar") after mount
   5. Guest user bootstrapping          — stable UUID + local identity; data already
      persists in isotope_* localStorage keys (app is local-first) */
(function () {
  'use strict';

  /* ── 0. STABLE GUEST IDENTITY ─────────────────────────────────────────── */
  const GUEST_KEY = 'isotope_guest_id';
  let guestId = localStorage.getItem(GUEST_KEY);
  if (!guestId) {
    const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '')
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    guestId = 'guest_' + rnd;
    localStorage.setItem(GUEST_KEY, guestId);
  }

  /* ── 1. localStorage.getItem INTERCEPTION ─────────────────────────────── */
  // Runs BEFORE Zustand's persist middleware or manual profile reads hydrate
  // the auth store — so the store boots with planType:"scholar".
  const _getItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function (key) {
    const raw = _getItem.call(this, key);

    // Cloud-profile cache: isotope:cloud-profile:{userId}
    if (key.startsWith('isotope:cloud-profile:')) {
      try {
        const d = raw ? JSON.parse(raw) : {};
        upgradePlan(d);
        return JSON.stringify(d);
      } catch (_) { return raw; }
    }

    // User profile snapshots
    if (key === 'isotope_user_profile_v2' || key === 'isotope_user_profile') {
      try {
        const d = raw ? JSON.parse(raw) : null;
        if (d) { upgradePlan(d); return JSON.stringify(d); }
      } catch (_) { return raw; }
    }

    // Auth-user-data cache: isotope:auth:user-data:{userId}
    if (key.startsWith('isotope:auth:user-data:')) {
      try {
        const d = raw ? JSON.parse(raw) : {};
        if (d) {
          upgradePlan(d);
          if (d.planType === 'free' || !d.planType) d.planType = 'scholar';
          if (d.billingStatus === 'free' || !d.billingStatus) d.billingStatus = 'grandfathered';
          return JSON.stringify(d);
        }
      } catch (_) { return raw; }
    }

    return raw;
  };

  /* ── 2. localStorage.setItem INTERCEPTION ─────────────────────────────── */
  // Prevents the app from ever writing plan:"free" to the cache.
  const _setItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (
      key.startsWith('isotope:cloud-profile:') ||
      key === 'isotope_user_profile_v2' ||
      key === 'isotope_user_profile' ||
      key.startsWith('isotope:auth:user-data:')
    ) {
      try {
        const d = JSON.parse(value);
        if (d) { upgradePlan(d); value = JSON.stringify(d); }
      } catch (_) {}
    }
    _setItem.call(this, key, value);
  };

  /* shared upgrade helper */
  function upgradePlan(d) {
    if (!d) return;
    if (!d.plan_type || d.plan_type === 'free') d.plan_type = 'scholar';
    if (!d.effective_plan || d.effective_plan === 'free') d.effective_plan = 'scholar';
    if (!d.billing_status || d.billing_status === 'free') d.billing_status = 'grandfathered';
    if (!d.plan_expires_at) d.plan_expires_at = '2099-12-31T23:59:59.000Z';
    d.access_source = 'gift_code';
    d.is_premium = true;
  }

  /* ── 3. fetch INTERCEPTION ────────────────────────────────────────────── */
  // Patches Supabase REST API responses that contain plan_type / billing_status.
  const _fetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input
      : (input instanceof Request ? input.url : '');
    const res = await _fetch.apply(window, arguments);

    // Target Supabase user_profiles table queries only
    if (url && url.includes('/rest/v1/user_profiles')) {
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('json')) {
          const body = await res.clone().json();
          const patch = r => { if (r && typeof r === 'object') upgradePlan(r); };
          if (Array.isArray(body)) body.forEach(patch); else patch(body);
          return new Response(JSON.stringify(body), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        }
      } catch (_) {}
    }
    return res;
  };

  /* ── 4. REACT FIBER WALK — call setPlanType("scholar") after mount ─────── */
  // Zustand v4 stores: when a component subscribes with
  //   useStore(state => state.setPlanType)
  // the React hook's memoizedState IS the setPlanType function itself.
  // We call it with "scholar" to force the store update.
  // Also handles full-store subscriptions where the slice has setPlanType.

  function walkFiber(node, fn, depth) {
    if (!node || depth > 600) return;
    fn(node);
    walkFiber(node.child, fn, depth + 1);
    walkFiber(node.sibling, fn, depth + 1);
  }

  function tryCallSetPlanType(v) {
    if (typeof v === 'function' && v.length <= 2 &&
        v.toString().includes('planType')) {
      try { v('scholar'); return true; } catch (_) {}
    }
    if (v && typeof v === 'object' && typeof v.setPlanType === 'function') {
      try { v.setPlanType('scholar'); return true; } catch (_) {}
    }
    return false;
  }

  function patchFiber() {
    const root = document.getElementById('root');
    if (!root) return false;
    const fk = Object.keys(root).find(k =>
      k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
    if (!fk) return false;

    let patched = 0;
    walkFiber(root[fk], fiber => {
      let s = fiber.memoizedState;
      while (s) {
        const v = s.memoizedState;
        if (tryCallSetPlanType(v)) patched++;
        // useSyncExternalStore queue may carry getSnapshot pointing to store
        if (s.queue && typeof s.queue.getSnapshot === 'function') {
          try {
            const snap = s.queue.getSnapshot();
            if (snap && typeof snap.setPlanType === 'function') {
              snap.setPlanType('scholar');
              patched++;
            }
          } catch (_) {}
        }
        s = s.next;
      }
    }, 0);

    // Also check window globals for accidental store leaks (devtools builds)
    for (const k of Object.keys(window)) {
      try {
        const w = window[k];
        if (w && typeof w.getState === 'function') {
          const st = w.getState();
          if (st && typeof st.setPlanType === 'function' &&
              (st.planType === 'free' || !st.planType)) {
            st.setPlanType('scholar');
            patched++;
          }
        }
      } catch (_) {}
    }

    return patched > 0;
  }

  let attempts = 0;
  function schedulePatch() {
    attempts++;
    const ok = patchFiber();
    if (ok) {
      // Keep patching periodically in case re-auth resets the store
      setTimeout(schedulePatch, 8000);
    } else if (attempts < 50) {
      setTimeout(schedulePatch, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(schedulePatch, 400));
  } else {
    setTimeout(schedulePatch, 400);
  }

  /* ── 5. GUEST IDENTITY EXPOSED ────────────────────────────────────────── */
  // The app is already local-first: all study data (tasks, subjects, sessions,
  // habits, timers) is saved to isotope_* localStorage keys regardless of auth.
  // This ensures the guest has a stable identity across page reloads.
  Object.defineProperty(window, '__isotopeGuest', {
    value: Object.freeze({ id: guestId, plan: 'scholar', isPremium: true }),
    writable: false,
  });

})();
