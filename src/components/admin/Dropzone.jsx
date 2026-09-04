import { useRef, useState } from 'react';
import { ImageUp, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/admin';

/**
 * Перетащил файл — загрузилось. Отдаёт наверх готовый путь /uploads/....
 * Сам ничего не показывает: превью рисует тот, кто им пользуется.
 */
export default function Dropzone({ onUploaded, hint = 'Перетащите фото сюда или нажмите' }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setBusy(true);
    setError('');
    try {
      const data = await adminApi.uploadPhoto(file);
      await onUploaded(data.src);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить');
    } finally {
      setBusy(false);
    }
  };

  // Файлов может быть несколько — грузим по очереди, чтобы не забить канал
  const pick = async (files) => {
    for (const file of Array.from(files ?? [])) await upload(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          // Без preventDefault браузер просто откроет файл вместо загрузки
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center text-xs font-medium transition-colors ${
          over ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-teal-400'
        }`}
      >
        {busy ? <Loader2 size={20} className="animate-spin" /> : <ImageUp size={20} />}
        {busy ? 'Загружаем…' : hint}
      </div>

      {error && <p className="mt-2 text-center text-xs font-medium text-red-500">{error}</p>}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          pick(e.target.files);
          // Иначе повторный выбор того же файла не вызовет change
          e.target.value = '';
        }}
      />
    </div>
  );
}
