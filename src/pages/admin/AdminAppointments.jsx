import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import DeleteButton from '../../components/admin/DeleteButton';
import PushToggle from '../../components/admin/PushToggle';
import { Phone, MessageSquare, Clock, Stethoscope, CalendarDays } from 'lucide-react';

const STATUS = {
  new:    { label: 'Новая',       cls: 'bg-blue-100 text-blue-700' },
  called: { label: 'Позвонили',   cls: 'bg-yellow-100 text-yellow-700' },
  done:   { label: 'Выполнена',   cls: 'bg-green-100 text-green-700' },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // Пока в полёте наша правка, ответ автообновления игнорируем: сервер может
  // ответить состоянием ДО неё и перетереть только что нажатый статус
  const pending = useRef(0);

  const load = () =>
    adminApi
      .getAppointments()
      .then((data) => { if (pending.current === 0) setAppointments(data); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);
  useAutoRefresh(load);

  const mutate = async (fn) => {
    pending.current += 1;
    try {
      await fn();
    } finally {
      pending.current -= 1;
    }
  };

  const filtered = filter ? appointments.filter((a) => a.status === filter) : appointments;

  const handleStatus = (id, status) =>
    mutate(async () => {
      const before = appointments;
      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      try {
        await adminApi.updateAppointmentStatus(id, status);
      } catch {
        setAppointments(before);
      }
    });

  const handleDelete = (id) =>
    mutate(async () => {
      await adminApi.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    });

  // Дата визита приходит как ГГГГ-ММ-ДД — показываем по-русски
  const formatVisitDate = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    return `${d} ${months[m - 1]} ${y}`;
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  const counts = {
    new:    appointments.filter((a) => a.status === 'new').length,
    called: appointments.filter((a) => a.status === 'called').length,
    done:   appointments.filter((a) => a.status === 'done').length,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Заявки</h1>
          <p className="text-gray-500 text-sm mt-1">{appointments.length} всего</p>
        </div>
        <PushToggle />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[['', 'Все', appointments.length], ['new', 'Новые', counts.new], ['called', 'Позвонили', counts.called], ['done', 'Выполнены', counts.done]].map(([val, label, count]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === val ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'}`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === val ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-gray-400 text-sm">Нет заявок</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold text-gray-800">{a.name}</div>
                  <div className="flex items-center gap-1.5 text-teal-600 text-sm mt-1">
                    <Phone size={13} />
                    <a href={`tel:${a.phone}`} className="hover:underline">{a.phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS[a.status].cls}`}>
                    {STATUS[a.status].label}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={11} />
                    {formatDate(a.createdAt)}
                  </div>
                </div>
              </div>

              {(a.service || a.date) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-sm text-gray-600">
                  {a.service && (
                    <span className="flex items-center gap-1.5">
                      <Stethoscope size={13} className="text-gray-400" />
                      {a.service}
                    </span>
                  )}
                  {a.date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-gray-400" />
                      {formatVisitDate(a.date)}
                    </span>
                  )}
                </div>
              )}

              {a.message && (
                <div className="flex items-start gap-2 text-gray-600 text-sm bg-gray-50 rounded-xl px-3 py-2 mb-3">
                  <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  {a.message}
                </div>
              )}

              {/* Status buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(STATUS).map(([val, { label, cls }]) => (
                  <button
                    key={val}
                    onClick={() => handleStatus(a._id, val)}
                    disabled={a.status === val}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                      a.status === val
                        ? `${cls} border-transparent cursor-default`
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <div className="ml-auto">
                  <DeleteButton label="Удалить заявку" onConfirm={() => handleDelete(a._id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
