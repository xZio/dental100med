import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePopover } from '../../hooks/usePopover.js';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

/** Дата в местном ГГГГ-ММ-ДД: toISOString() сдвинул бы день из-за часового пояса. */
const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Индекс дня недели с понедельника — getDay() считает с воскресенья. */
const weekIndex = (d) => (d.getDay() + 6) % 7;

export function formatDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS_GEN[m - 1]} ${y}`;
}

/**
 * Свой календарь вместо <input type="date">: нативный выглядит по-разному
 * в каждом браузере и на телефоне легко промахнуться мимо нужного дня.
 * Прошедшие даты выбрать нельзя.
 */
export default function DatePicker({ id, value, onChange, invalid }) {
  const { open, setOpen, ref } = usePopover();
  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const today = startOfDay(new Date());
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const lead = weekIndex(cursor);
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const canGoBack = cursor > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-[14px] border bg-white/90 px-4 py-3 text-left text-sm text-ink transition focus:outline-none focus:ring-2 ${
          invalid ? 'border-red-400 focus:ring-red-200' : 'border-[#c9e3ee] focus:border-blue focus:ring-blue/25 hover:border-blue/60'
        }`}
      >
        <span className={value ? 'text-ink' : 'text-muted/80'}>
          {value ? formatDate(value) : 'Выберите дату'}
        </span>
        <CalendarDays size={18} className="flex-shrink-0 text-blue" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Выбор даты"
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-[310px] rounded-[18px] border border-[#c9e3ee] bg-white p-4 shadow-xl shadow-blue/10"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              disabled={!canGoBack}
              aria-label="Предыдущий месяц"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ice disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-ink">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              aria-label="Следующий месяц"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ice"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-center text-[11px] font-semibold uppercase text-muted">{w}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`x${i}`} />;
              const key = toKey(d);
              const past = d < today;
              const selected = key === value;
              const isToday = key === toKey(today);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={past}
                  onClick={() => { onChange(key); setOpen(false); }}
                  aria-current={isToday ? 'date' : undefined}
                  className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-blue text-white'
                      : past
                        ? 'cursor-not-allowed text-[#b7cfdb]'
                        : isToday
                          ? 'text-blue ring-1 ring-inset ring-blue/40 hover:bg-ice'
                          : 'text-ink hover:bg-ice'
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
