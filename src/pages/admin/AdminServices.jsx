import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import { Plus, Pencil, Trash2, FolderCog, GripVertical, Check, X } from 'lucide-react';

const EMPTY_SERVICE = { name: '', category: '', price: '', order: 0 };

export default function AdminServices() {
  const [services,   setServices]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Service modal
  const [serviceModal, setServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [savingService, setSavingService] = useState(false);
  const [serviceError, setServiceError] = useState('');

  // Category modal
  const [catModal, setCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState('');
  // Inline rename state: { id, value }
  const [renamingCat, setRenamingCat] = useState(null);

  // Active filter
  const [filterCat, setFilterCat] = useState('');

  const loadAll = useCallback(async () => {
    const [s, c] = await Promise.all([adminApi.getServices(), adminApi.getCategories()]);
    setServices(s);
    setCategories(c.sort((a, b) => a.order - b.order));
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── Services ── */
  const catNames = categories.map((c) => c.name);
  const filtered = filterCat ? services.filter((s) => s.category === filterCat) : services;
  const grouped  = filtered.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const openAddService  = () => {
    setServiceForm({ ...EMPTY_SERVICE, category: catNames[0] || '' });
    setEditingService(null); setServiceError(''); setServiceModal(true);
  };
  const openEditService = (s) => {
    setServiceForm({ name: s.name, category: s.category, price: s.price, order: s.order });
    setEditingService(s); setServiceError(''); setServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSavingService(true); setServiceError('');
    try {
      const data = { ...serviceForm, price: Number(serviceForm.price), order: Number(serviceForm.order) };
      if (editingService) await adminApi.updateService(editingService._id, data);
      else                await adminApi.createService(data);
      await loadAll();
      setServiceModal(false);
    } catch (err) { setServiceError(err.message); }
    finally { setSavingService(false); }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Удалить услугу?')) return;
    await adminApi.deleteService(id);
    loadAll();
  };

  /* ── Categories ── */
  const handleAddCat = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true); setCatError('');
    try {
      const order = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
      await adminApi.createCategory({ name: newCatName.trim(), order });
      setNewCatName('');
      await loadAll();
    } catch (err) { setCatError(err.message || 'Такая категория уже существует'); }
    finally { setAddingCat(false); }
  };

  const handleRenameStart = (cat) => setRenamingCat({ id: cat._id, value: cat.name });

  const handleRenameConfirm = async () => {
    if (!renamingCat || !renamingCat.value.trim()) return;
    try {
      await adminApi.updateCategory(renamingCat.id, { name: renamingCat.value.trim() });
      setRenamingCat(null);
      await loadAll();
    } catch (err) { setCatError(err.message); }
  };

  const handleDeleteCat = async (cat) => {
    const count = services.filter((s) => s.category === cat.name).length;
    if (count > 0) {
      alert(`В категории «${cat.name}» есть ${count} услуг.\nСначала удалите или перенесите их в другую категорию.`);
      return;
    }
    if (!confirm(`Удалить категорию «${cat.name}»?`)) return;
    try {
      await adminApi.deleteCategory(cat._id);
      await loadAll();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Услуги</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} позиций · {categories.length} категорий</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setCatError(''); setCatModal(true); }}
            className="flex items-center gap-2 border border-gray-200 hover:border-teal-400 text-gray-600 hover:text-teal-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <FolderCog size={16} /> Категории
          </button>
          <button
            onClick={openAddService}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Услуга
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterCat('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterCat ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'}`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setFilterCat(c.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterCat === c.name ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Services grouped by category */}
      <div className="space-y-6">
        {categories
          .filter((c) => !filterCat || c.name === filterCat)
          .map((cat) => {
            const items = (grouped[cat.name] || []).sort((a, b) => a.order - b.order);
            return (
              <div key={cat._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-700 text-sm">{cat.name}</h2>
                  <span className="text-xs text-gray-400">{items.length} услуг</span>
                </div>
                {items.length === 0 ? (
                  <div className="px-6 py-4 text-gray-400 text-sm italic">Нет услуг в этой категории</div>
                ) : (
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-50">
                      {items.map((s) => (
                        <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 text-sm text-gray-800">{s.name}</td>
                          <td className="px-6 py-3 text-sm font-semibold text-teal-700 whitespace-nowrap">
                            {s.price.toLocaleString('ru-RU')} ₽
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={() => openEditService(s)} className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => handleDeleteService(s._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
      </div>

      {/* ── Service Modal ── */}
      {serviceModal && (
        <Modal title={editingService ? 'Редактировать услугу' : 'Новая услуга'} onClose={() => setServiceModal(false)}>
          <form onSubmit={handleSaveService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              >
                <option value="">— выберите —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
                <input
                  type="number" min="0"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                <input
                  type="number"
                  value={serviceForm.order}
                  onChange={(e) => setServiceForm({ ...serviceForm, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            {serviceError && <p className="text-red-500 text-sm">{serviceError}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setServiceModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
              <button type="submit" disabled={savingService} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
                {savingService ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Category Modal ── */}
      {catModal && (
        <Modal title="Управление категориями" onClose={() => { setCatModal(false); setRenamingCat(null); }}>
          <div className="space-y-4">
            {/* List */}
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {categories.length === 0 && (
                <div className="px-4 py-3 text-gray-400 text-sm">Нет категорий</div>
              )}
              {categories.map((cat) => {
                const svcCount = services.filter((s) => s.category === cat.name).length;
                const isRenaming = renamingCat?.id === cat._id;
                return (
                  <div key={cat._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                    {isRenaming ? (
                      <>
                        <input
                          autoFocus
                          value={renamingCat.value}
                          onChange={(e) => setRenamingCat({ ...renamingCat, value: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleRenameConfirm(); if (e.key === 'Escape') setRenamingCat(null); }}
                          className="flex-1 px-2 py-1 border border-teal-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button onClick={handleRenameConfirm} className="p-1 text-teal-600 hover:text-teal-700">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setRenamingCat(null)} className="p-1 text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-gray-800">{cat.name}</span>
                        <span className="text-xs text-gray-400 mr-2">{svcCount} усл.</span>
                        <button onClick={() => handleRenameStart(cat)} className="p-1 text-gray-400 hover:text-teal-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteCat(cat)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add new */}
            <form onSubmit={handleAddCat} className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Название новой категории"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={addingCat || !newCatName.trim()}
                className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
              >
                <Plus size={15} /> Добавить
              </button>
            </form>
            {catError && <p className="text-red-500 text-sm">{catError}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
