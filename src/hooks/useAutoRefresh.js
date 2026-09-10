import { useEffect, useRef } from 'react';

/**
 * Держит список свежим, пока вкладка открыта: обновляет при возврате к ней
 * (свернул-развернул, тапнул по уведомлению) и тихо раз в минуту. Иначе
 * администратор, оставивший экран заявок открытым, новых просто не увидит.
 */
export function useAutoRefresh(refresh, intervalMs = 60000) {
  const saved = useRef(refresh);
  useEffect(() => { saved.current = refresh; }, [refresh]);

  useEffect(() => {
    const run = () => saved.current();
    const onVisible = () => { if (document.visibilityState === 'visible') run(); };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', run);
    const id = window.setInterval(onVisible, intervalMs);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', run);
      window.clearInterval(id);
    };
  }, [intervalMs]);
}
