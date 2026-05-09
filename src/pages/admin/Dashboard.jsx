import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { Stethoscope, UserRound, Tag, CalendarClock, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value ?? '—'}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [newAppointments, setNewAppointments] = useState([]);

  useEffect(() => {
    Promise.all([
      adminApi.getServices(),
      adminApi.getDoctors(),
      adminApi.getPromotions(),
      adminApi.getAppointments(),
    ]).then(([services, doctors, promotions, appointments]) => {
      setStats({
        services: services.length,
        doctors: doctors.length,
        promotions: promotions.length,
        appointments: appointments.length,
      });
      setNewAppointments(appointments.filter((a) => a.status === 'new').slice(0, 5));
    }).catch(console.error);
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Дашборд</h1>
        <p className="text-gray-500 text-sm mt-1">Обзор сайта Dental100med</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Stethoscope} label="Услуг"     value={stats.services}    color="bg-teal-500" />
        <StatCard icon={UserRound}   label="Врачей"    value={stats.doctors}     color="bg-blue-500" />
        <StatCard icon={Tag}         label="Акций"     value={stats.promotions}  color="bg-orange-500" />
        <StatCard icon={CalendarClock} label="Заявок"  value={stats.appointments} color="bg-purple-500" />
      </div>

      {/* New appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-teal-600" />
          <h2 className="font-semibold text-gray-800">Новые заявки</h2>
          {newAppointments.length > 0 && (
            <span className="ml-auto bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {newAppointments.length}
            </span>
          )}
        </div>
        {newAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">Новых заявок нет</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {newAppointments.map((a) => (
              <div key={a._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{a.name}</div>
                  <div className="text-gray-500 text-xs">{a.phone}</div>
                </div>
                <div className="text-gray-400 text-xs">{formatDate(a.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
