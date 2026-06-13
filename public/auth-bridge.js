/* IsotopeAI runtime auth bridge.
   Defines login/signup globals early so patched or stale Auth bundles cannot
   crash with "window.__isoLogin is not a function". */
(function () {
  'use strict';

  var DEFAULT_SUPA_URL = 'https://vteqquoqvksshmfhuepu.supabase.co';
  var DEFAULT_SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZXFxdW9xdmtzc2htZmh1ZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODU2NzUsImV4cCI6MjA5NTY2MTY3NX0.ZkRislOhJRQUjVa1y5ixu-xBhlgkXWWyZKI_CClWj64';
  function supaUrl() {
    return String(window.__ISO_SUPA_URL__ || DEFAULT_SUPA_URL).replace(/\/+$/, '');
  }

  function supaAnon() {
    return String(window.__ISO_ANON__ || DEFAULT_SUPA_ANON);
  }

  function projectRef() {
    try { return new URL(supaUrl()).hostname.split('.')[0] || ''; }
    catch (e) { return ''; }
  }

  function asErrorMessage(data, fallback) {
    if (!data) return fallback;
    return data.error_description || data.msg || data.message || data.error || fallback;
  }

  function normalizeSession(data) {
    if (!data) return null;
    var session = data.session || data.currentSession || data;
    if (!session || !session.access_token) return null;
    if (!session.user && data.user) session.user = data.user;
    if (!session.expires_at && session.expires_in) {
      session.expires_at = Math.floor(Date.now() / 1000) + Number(session.expires_in || 0);
    }
    return session;
  }

  function writeSession(session) {
    if (!session || !session.access_token) return;
    var raw = JSON.stringify(session);
    try {
      var ref = projectRef();
      localStorage.setItem('isotope-auth-token', raw);
      if (ref) localStorage.setItem('sb-' + ref + '-auth-token', raw);
      localStorage.setItem('isotope-last-jwt', session.access_token);
      if (session.refresh_token) localStorage.setItem('isotope-last-rt', session.refresh_token);
      localStorage.setItem('isotope-last-session-raw', raw);
    } catch (e) {}
  }

  function jsonFetch(url, options) {
    return fetch(url, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        return { response: response, data: data };
      });
    });
  }

  function authHeaders(token) {
    var anon = supaAnon();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'apikey': anon,
      'Authorization': 'Bearer ' + (token || anon),
      'x-client-info': 'isotope-auth-bridge'
    };
  }

  function supabaseAuth(path, body) {
    return jsonFetch(supaUrl() + path, {
      method: 'POST',
      headers: authHeaders(supaAnon()),
      body: JSON.stringify(body || {}),
      credentials: 'omit',
      cache: 'no-store'
    });
  }

  function bootstrap(session) {
    if (!session || !session.access_token) return Promise.resolve(null);
    return jsonFetch('/__auth/bootstrap', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + session.access_token
      },
      cache: 'no-store'
    }).then(function (result) {
      if (!result.response.ok || !result.data || !result.data.ok) return null;
      try {
        localStorage.setItem('isotope-bootstrap-cache', JSON.stringify({
          ok: true,
          cached_at: Date.now(),
          user_id: result.data.user_id,
          profile: result.data.profile || result.data.profile_data || null,
          onboarding_completed: result.data.onboarding_completed
        }));
      } catch (e) {}
      return result.data;
    }).catch(function () { return null; });
  }

  function notifyAuth(session, bootstrapData) {
    try { if (typeof window.__isoSyncAuthUnblock === 'function') window.__isoSyncAuthUnblock(); } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('isotope:auth-session', {
        detail: { session: session, bootstrap: bootstrapData || null }
      }));
    } catch (e) {}
    try { window.dispatchEvent(new Event('isotope:auth-unblock')); } catch (e) {}
    try { window.dispatchEvent(new Event('isotope:sync_refresh')); } catch (e) {}
  }

  async function login(email, password) {
    try {
      var cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password) return { ok: false, success: false, err: 'Email and password are required.' };
      var result = await supabaseAuth('/auth/v1/token?grant_type=password', {
        email: cleanEmail,
        password: password
      });
      if (!result.response.ok) {
        return { ok: false, success: false, err: asErrorMessage(result.data, 'Login failed') };
      }
      var session = normalizeSession(result.data);
      if (!session) return { ok: false, success: false, err: 'Login did not return a Supabase session.' };
      writeSession(session);
      var boot = await bootstrap(session);
      notifyAuth(session, boot);
      return {
        ok: true,
        success: true,
        session: session,
        user: session.user || result.data.user || null,
        bootstrap: boot,
        onboarding_completed: boot && typeof boot.onboarding_completed === 'boolean' ? boot.onboarding_completed : undefined
      };
    } catch (e) {
      return { ok: false, success: false, err: e && e.message ? e.message : 'Network error' };
    }
  }

  async function signUp(email, password) {
    try {
      var cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password) return { ok: false, success: false, err: 'Email and password are required.' };
      var result = await supabaseAuth('/auth/v1/signup', {
        email: cleanEmail,
        password: password
      });
      if (!result.response.ok) {
        return { ok: false, success: false, err: asErrorMessage(result.data, 'Signup failed') };
      }
      var session = normalizeSession(result.data);
      var boot = null;
      if (session) {
        writeSession(session);
        boot = await bootstrap(session);
        notifyAuth(session, boot);
      }
      return {
        ok: true,
        success: true,
        session: session,
        user: (session && session.user) || result.data.user || null,
        bootstrap: boot,
        onboarding_completed: false
      };
    } catch (e) {
      return { ok: false, success: false, err: e && e.message ? e.message : 'Network error' };
    }
  }

  window.__isoLogin = login;
  window.__isoUp = signUp;
  var bridgeApi = {
    version: 1,
    login: login,
    signUp: signUp,
    writeSession: writeSession
  };
  try {
    Object.defineProperty(bridgeApi, 'project_ref', { get: projectRef });
  } catch (e) {
    bridgeApi.project_ref = projectRef();
  }
  window.__ISO_AUTH_BRIDGE__ = bridgeApi;
})();
