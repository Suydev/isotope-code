(function() {
    var RECOVERY_KEY = 'isotope-asset-recovery-v1';
    var CACHE_RECOVERY_KEY = 'isotope-runtime-cache-recovery-v1';
    var RECOVERY_PARAM = '__isotope_reload';
    var recoveryStarted = false;

    function readSessionValue(key) {
        try {
            return window.sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function writeSessionValue(key, value) {
        try {
            window.sessionStorage.setItem(key, value);
        } catch (error) {
            // Ignore storage failures; the reload is still safer than leaving a blank app shell.
        }
    }

    function isAppAssetUrl(value) {
        if (!value) {
            return false;
        }

        try {
            var url = new URL(value, window.location.origin);
            return url.origin === window.location.origin && url.pathname.indexOf('/assets/') === 0;
        } catch (error) {
            return String(value).indexOf('/assets/') !== -1;
        }
    }

    function buildRecoveryUrl() {
        try {
            var url = new URL(window.location.href);
            url.searchParams.set(RECOVERY_PARAM, Date.now().toString());
            return url.href;
        } catch (error) {
            return window.location.href;
        }
    }

    function clearCaches() {
        if (typeof caches === 'undefined' || typeof caches.keys !== 'function') {
            return Promise.resolve();
        }
        return caches.keys().then(function(keys) {
            return Promise.all(
                keys
                    .filter(function(key) { return String(key).indexOf('isotope') !== -1; })
                    .map(function(key) { return caches.delete(key); }),
            );
        });
    }

    function clearCachesAndReload() {
        if (recoveryStarted || readSessionValue(CACHE_RECOVERY_KEY) === '1') {
            return Promise.resolve(false);
        }
        recoveryStarted = true;
        writeSessionValue(CACHE_RECOVERY_KEY, '1');
        console.info('Isotope runtime cache cleared; reloading.');
        return clearCaches()
            .catch(function() { return undefined; })
            .then(function() {
                window.location.replace(buildRecoveryUrl());
                return true;
            });
    }

    window.__isoClearCachesAndReload = clearCachesAndReload;

    function isRuntimeGlueError(message) {
        return /__iso(Login|Up) is not a function/i.test(message || '') ||
            /window\.__iso(Login|Up)/i.test(message || '');
    }

    function refreshServiceWorkers() {
        if (
            typeof navigator === 'undefined' ||
            !navigator.serviceWorker ||
            typeof navigator.serviceWorker.getRegistrations !== 'function'
        ) {
            return Promise.resolve();
        }

        return navigator.serviceWorker
            .getRegistrations()
            .then(function(registrations) {
                return Promise.all(
                    registrations.map(function(registration) {
                        return typeof registration.update === 'function' ? registration.update() : undefined;
                    }),
                );
            })
            .then(function() {
                return undefined;
            });
    }

    function recoverFromStaleAsset() {
        if (recoveryStarted || readSessionValue(RECOVERY_KEY) === '1') {
            return;
        }

        recoveryStarted = true;
        writeSessionValue(RECOVERY_KEY, '1');

        var didReload = false;
        var reload = function() {
            if (didReload) {
                return;
            }

            didReload = true;
            window.location.replace(buildRecoveryUrl());
        };

        window.setTimeout(reload, 2500);
        refreshServiceWorkers().finally(reload);
    }

    window.addEventListener(
        'error',
        function(event) {
            var target = event.target;

            if (!target || target === window) {
                if (isRuntimeGlueError(event.message || '')) {
                    clearCachesAndReload();
                }
                return;
            }

            var tagName = target.tagName;
            if (tagName !== 'SCRIPT' && tagName !== 'LINK') {
                return;
            }

            if (isAppAssetUrl(target.src || target.href)) {
                recoverFromStaleAsset();
            }
        },
        true,
    );

    window.addEventListener('unhandledrejection', function(event) {
        var reason = event.reason;
        var message = reason && reason.message ? reason.message : String(reason || '');

        if (
            isRuntimeGlueError(message) ||
            message.indexOf('Failed to fetch dynamically imported module') !== -1 ||
            message.indexOf('Importing a module script failed') !== -1 ||
            message.indexOf('ChunkLoadError') !== -1 ||
            message.indexOf('Loading chunk') !== -1
        ) {
            if (isRuntimeGlueError(message)) clearCachesAndReload();
            else recoverFromStaleAsset();
        }
    });
})();
