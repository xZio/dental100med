import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import { Plus, Pencil, Trash2, UserRound } from 'lucide-react';

const EMPTY = { name: '', specialty: '', experience: '', description: '', photo: '', order: 0 };

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminApi.getDoctors().then(setDoctors).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setError(''); setModal(true); };
  const openEdit = (d) => { setForm({ name: d.name, specialty: d.specialty, experience: d.experience, description: d.description, photo: d.photo, order: d.order }); setEditing(d); setError(''); setModal(true); };
  const closeModal = () => setModal(false);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form, order: Number(form.order) };
      if (editing) await adminApi.updateDoctor(editing._id, data);
      else         await adminApi.createDoctor(data);
      await load();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить врача?')) return;
    await adminApi.deleteDoctor(id);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Врачи</h1>
          <p className="text-gray-500 text-sm mt-1">{doctors.length} специалистов</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.sort((a, b) => a.order - b.order).map((d) => (
          <div key={d._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {d.photo ? (
                <img src={d.photo} alt={d.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <UserRound size={20} className="text-teal-600" />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-800 text-sm leading-tight">{d.name}</div>
                <div className="text-teal-600 text-xs mt-0.5">{d.specialty}</div>
              </div>
            </div>
            {d.experience && <div className="text-gray-500 text-xs">{d.experience}</div>}
            {d.description && <p className="text-gray-600 text-xs line-clamp-2">{d.description}</p>}
            <div className="flex gap-2 pt-1 mt-auto">
              <button onClick={() => openEdit(d)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
                <Pencil size={13} /> Изменить
              </button>
              <button onClick={() => handleDelete(d._id)} className="flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Редактировать врача' : 'Новый врач'} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { key: 'name',        label: 'ФИО',             required: true },
              { key: 'specialty',   label: 'Специальность',   required: true },
              { key: 'experience',  label: 'Стаж',            required: false },
              { key: 'photo',       label: 'Фото (URL)',       required: false },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  value={form[key]}
                  onChange={f(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required={required}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                value={form.description}
                onChange={f('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
              <input
                type="number"
                value={form.order}
                onChange={f('order')}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
