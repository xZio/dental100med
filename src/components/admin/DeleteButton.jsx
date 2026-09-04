import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';

/**
 * Удаление в два клика вместо системного confirm(): первый клик раскрывает
 * «Точно?», второй удаляет. На телефоне это заметно надёжнее — системный
 * диалог там легко смахнуть мимо.
 *
 * variant "floating" — для миниатюр: кнопка висит в углу фото.
 */
export default function DeleteButton({ onConfirm, label = 'Удалить', variant = 'inline' }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      setAsking(false);
    }
  };

  const floating = variant === 'floating';

  if (asking) {
    return (
      <div className={floating ? 'absolute right-1.5 top-1.5 flex gap-1' : 'flex items-center gap-1'}>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label="Подтвердить удаление"
          className="flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        >
          <Check size={13} /> {busy ? '…' : 'Точно'}
        </button>
        <button
          type="button"
          onClick={() => setAsking(false)}
          aria-label="Отменить удаление"
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      aria-label={label}
      title={label}
      className={
        floating
          ? 'absolute right-1.5 top-1.5 rounded-lg bg-white/90 p-1.5 text-gray-600 shadow-sm transition-colors hover:text-red-500'
          : 'flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-red-400 hover:text-red-500'
      }
    >
      <Trash2 size={13} />
    </button>
  );
}
