import { Check, ChevronDown } from 'lucide-react';
import { usePopover } from '../../hooks/usePopover.js';

/**
 * Свой выпадающий список вместо нативного select: на телефоне системный
 * список громоздкий и выглядит чужеродно.
 */
export default function Select({ id, value, options, placeholder, onChange, invalid }) {
  const { open, setOpen, ref } = usePopover();
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 ${
          invalid ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-primary-300 hover:border-primary-300'
        }`}
      >
        <span className={selected ? 'text-slate-700' : 'text-slate-400'}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={18} className={`flex-shrink-0 text-primary-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  option.value === value ? 'bg-primary-50 text-primary-800' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
                {option.value === value && <Check size={15} className="flex-shrink-0 text-primary-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
