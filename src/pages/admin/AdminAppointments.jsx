import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { Phone, MessageSquare, Clock } from 'lucide-react';

const STATUS = {
  new:    { label: 'Новая',       cls: 'bg-blue-100 text-blue-700' },
  called: { label: 'Позвонили',   cls: 'bg-yellow-100 text-yellow-700' },
  done:   { label: 'Выполнена',   cls: 'bg-green-100 text-green-700' },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => adminApi.getAppointments().then(setAppointments).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = filter ? appointments.filter((a) => a.status === filter) : appointments;

  const handleStatus = async (id, status) => {
    await adminApi.updateAppointmentStatus(id, status);
    load();
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Заявки</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} всего</p>
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

              {a.message && (
                <div className="flex items-start gap-2 text-gray-600 text-sm bg-gray-50 rounded-xl px-3 py-2 mb-3">
                  <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  {a.message}
                </div>
              )}

              {/* Status buttons */}
              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
