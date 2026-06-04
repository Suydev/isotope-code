// Firebase messaging disabled in offline mode — push notifications not available
self.addEventListener('push', function() {});
self.addEventListener('notificationclick', function(event) { event.notification.close(); });
