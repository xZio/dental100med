import webpush from 'web-push';
import { db, now } from './db.js';

let ready = false;

/** Без ключей уведомления просто выключены — сайт от этого не ломается. */
const configure = () => {
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;

  if (!ready) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    ready = true;
  }
  return true;
};

export const pushEnabled = () => configure();

export const saveSubscription = ({ endpoint, keys }) => {
  const ts = now();
  // Endpoint уникален: переподписка того же устройства обновляет ключи, а не плодит строки
  db.prepare(`INSERT INTO push_subscriptions (endpoint, p256dh, auth, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh,
                                                  auth = excluded.auth,
                                                  updatedAt = excluded.updatedAt`)
    .run(endpoint, keys.p256dh, keys.auth, ts, ts);
};

export const removeSubscription = (endpoint) =>
  db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);

/**
 * Уведомление о новой заявке всем подписанным устройствам.
 * Никогда не бросает: заявка уже в базе, и падать из-за уведомления ей незачем.
 */
export const notifyNewAppointment = async ({ name, phone, message }) => {
  if (!configure()) return;

  // Число новых — чтобы service worker выставил значок на иконке
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM appointments WHERE status = 'new'").get();

  const payload = JSON.stringify({
    title: 'Новая заявка',
    body: [name, phone, message].filter(Boolean).join(' · '),
    url: '/admin/appointments',
    badge: count,
  });

  const subscriptions = db.prepare('SELECT * FROM push_subscriptions').all();

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (err) {
        // 404/410 — подписка мертва: приложение снесли или разрешение отозвали
        if (err.statusCode === 404 || err.statusCode === 410) removeSubscription(sub.endpoint);
      }
    })
  );
};
