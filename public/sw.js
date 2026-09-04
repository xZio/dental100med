/**
 * Service worker админки. Умеет ровно одно — показать уведомление о новой
 * заявке и открыть по нему панель. Запросы не перехватывает и не кэширует.
 */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  // Значок на иконке — число новых заявок (как у почты). Ставится даже когда
  // приложение закрыто; setAppBadge есть не везде, поэтому под guard.
  if (typeof data.badge === 'number' && self.navigator.setAppBadge) {
    if (data.badge > 0) self.navigator.setAppBadge(data.badge).catch(() => {});
    else self.navigator.clearAppBadge?.().catch(() => {});
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ДенталстоМед', {
      body: data.body || '',
      icon: '/images/logo.png',
      data: { url: data.url || '/admin/appointments' },
      // Один тег на все заявки: пачка уведомлений схлопывается в последнее
      tag: 'appointment',
      renotify: true,
      vibrate: [80, 40, 80],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin/appointments';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Панель уже открыта — не плодим второе окно
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
