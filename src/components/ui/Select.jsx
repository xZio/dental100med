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
        className={`flex w-full items-center justify-between gap-3 rounded-[14px] border bg-white/90 px-4 py-3 text-left text-sm text-ink transition focus:outline-none focus:ring-2 ${
          invalid ? 'border-red-400 focus:ring-red-200' : 'border-[#c9e3ee] focus:border-blue focus:ring-blue/25 hover:border-blue/60'
        }`}
      >
        <span className={selected ? 'text-ink' : 'text-muted/80'}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={18} className={`flex-shrink-0 text-blue transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-64 w-full overflow-y-auto rounded-[14px] border border-[#c9e3ee] bg-white p-1.5 shadow-xl shadow-blue/10"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  option.value === value ? 'bg-ice text-ink' : 'text-[#3d6a83] hover:bg-ice/70'
                }`}
              >
                {option.label}
                {option.value === value && <Check size={15} className="flex-shrink-0 text-blue" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
