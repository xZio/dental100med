import { useEffect, useState } from 'react';
import { Bell, BellOff, Share } from 'lucide-react';
import { adminApi } from '../../api/admin';

/** VAPID-ключ приезжает base64url, а applicationServerKey хочет байты. */
function toBytes(base64url) {
  const padded = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = atob(padded);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // На iPadOS Safari прикидывается макинтошем
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

/**
 * Включение уведомлений о новых заявках на это устройство.
 * Состояния: loading | unsupported | ios-install | off | on | denied.
 */
export default function PushToggle() {
  const [state, setState] = useState('loading');
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState(null);

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

    // Apple разрешает push только установленному приложению, и разрешение
    // спрашивается уже после установки — до неё кнопка бесполезна
    if (isIOS() && !isStandalone()) return setState('ios-install');
    if (!supported) return setState('unsupported');

    adminApi.getPushKey()
      .then(({ key }) => {
        // Ключи на сервере не заданы — уведомления выключены целиком
        if (!key) return setState('unsupported');
        setKey(key);
        if (Notification.permission === 'denied') return setState('denied');

        return navigator.serviceWorker
          .register('/sw.js', { scope: '/admin' })
          .then((registration) => registration.pushManager.getSubscription())
          .then((subscription) => {
            if (!subscription) return setState('off');
            // Браузер помнит подписку, а сервер мог её потерять (пересоздали
            // базу, почистили мёртвые). Переотправляем — дублей не будет.
            adminApi.subscribePush(subscription.toJSON()).catch(() => {});
            setState('on');
          });
      })
      .catch(() => setState('unsupported'));
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toBytes(key),
      });

      await adminApi.subscribePush(subscription.toJSON());
      setState('on');
    } catch {
      setState('off');
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await adminApi.unsubscribePush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState('off');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading' || state === 'unsupported') return null;

  if (state === 'ios-install') {
    return (
      <Note>
        <Share size={15} className="mt-0.5 flex-shrink-0" />
        <span>
          Чтобы получать уведомления на айфоне, откройте «Поделиться» и выберите «На экран
          «Домой»». Apple присылает уведомления только установленному приложению.
        </span>
      </Note>
    );
  }

  if (state === 'denied') {
    return (
      <Note>
        <BellOff size={15} className="mt-0.5 flex-shrink-0" />
        <span>Уведомления запрещены в настройках браузера. Разрешите их для этого сайта и обновите страницу.</span>
      </Note>
    );
  }

  const on = state === 'on';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={on ? disable : enable}
      disabled={busy}
      className="inline-flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 disabled:opacity-60"
    >
      <Bell size={15} className={on ? 'text-teal-600' : 'text-gray-400'} />
      <span className="text-sm font-medium text-gray-700">
        {busy ? 'Секунду…' : 'Уведомления о заявках'}
      </span>
      {/* Ползунок: вправо и бирюзовый — включены, влево и серый — нет */}
      <span className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${on ? 'bg-teal-600' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

function Note({ children }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-gray-500">
      {children}
    </p>
  );
}
