import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Dropzone from '../../components/admin/Dropzone';
import DeleteButton from '../../components/admin/DeleteButton';

const TABS = [
  { id: 'clinic', label: 'Наша клиника', hint: 'Интерьер клиники — эти фото видны и на главной' },
  { id: 'works', label: 'Наши работы', hint: 'Примеры выполненных работ' },
];

/**
 * Только фотографии, без описаний: подпись подставляется автоматически по
 * вкладке. Поэтому не раскрывающиеся строки, а плотная сетка миниатюр.
 */
export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('clinic');

  const load = () => adminApi.getGallery().then(setImages).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const current = images.filter((p) => p.tab === tab);

  const add = async (src) => {
    const alt = tab === 'works' ? 'Работа клиники ДенталстоМед' : 'Интерьер клиники ДенталстоМед';
    await adminApi.createGalleryImage({ src, alt, tab, order: current.length + 1 });
    await load();
  };

  const remove = async (id) => {
    await adminApi.deleteGalleryImage(id);
    await load();
  };

  if (loading) return <div className="text-gray-400 text-sm">Загрузка...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Галерея</h1>
        <p className="text-gray-500 text-sm mt-1">{images.length} фото</p>
      </div>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400'
            }`}
          >
            {t.label}
            <span className="ml-2 text-xs opacity-70">
              {images.filter((p) => p.tab === t.id).length}
            </span>
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm mb-4">{TABS.find((t) => t.id === tab)?.hint}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Dropzone onUploaded={add} hint="Перетащите фото сюда или нажмите" />

        {current.map((photo) => (
          <div
            key={photo._id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-100"
          >
            <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" loading="lazy" />
            <DeleteButton variant="floating" label="Удалить фото" onConfirm={() => remove(photo._id)} />
          </div>
        ))}
      </div>

      {current.length === 0 && (
        <p className="text-gray-400 text-sm mt-4">В этом разделе пока нет фотографий.</p>
      )}
    </div>
  );
}
