import { useState } from 'react';
import { ChevronDown, Loader2, Save } from 'lucide-react';

export const field =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500';

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-[12px] font-bold uppercase tracking-[0.06em] text-gray-400">
      {children}
    </label>
  );
}

export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorNote({ children }) {
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
      {children}
    </p>
  );
}

/** Кнопка «Сохранить» дискетой: при отправке крутит спиннер вместо иконки. */
export function SaveButton({ onClick, pending, label = 'Сохранить' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-600/30 bg-teal-50 text-teal-600 transition-colors hover:border-teal-600 hover:bg-teal-600 hover:text-white disabled:opacity-60"
    >
      {pending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
    </button>
  );
}

/**
 * Строка списка: свёрнута — только сводка. Раскрывать всё сразу нельзя: десятки
 * развёрнутых форм тормозят и съедают первый клик.
 */
export function Row({ summary, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        <span className="min-w-0 flex-1">{summary}</span>
        <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && <div className="border-t border-gray-200 p-4">{children}</div>}
    </div>
  );
}
