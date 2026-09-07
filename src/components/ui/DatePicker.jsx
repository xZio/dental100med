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
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 ${
          invalid ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-primary-300 hover:border-primary-300'
        }`}
      >
        <span className={value ? 'text-slate-700' : 'text-slate-400'}>
          {value ? formatDate(value) : 'Выберите дату'}
        </span>
        <CalendarDays size={18} className="flex-shrink-0 text-primary-600" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Выбор даты"
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-[310px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              disabled={!canGoBack}
              aria-label="Предыдущий месяц"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              aria-label="Следующий месяц"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-center text-[11px] font-semibold uppercase text-slate-400">{w}</span>
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
                      ? 'bg-primary-700 text-white'
                      : past
                        ? 'cursor-not-allowed text-slate-300'
                        : isToday
                          ? 'text-primary-700 ring-1 ring-inset ring-primary-300 hover:bg-primary-50'
                          : 'text-slate-700 hover:bg-slate-100'
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
