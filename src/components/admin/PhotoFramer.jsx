import { useRef, useState } from 'react';
import { ImageUp, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { DEFAULT_FRAMING, framingStyle } from '../../lib/framing';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Фото врача и его кадр в той же рамке, что на сайте: что видно здесь, то и
 * будет на странице врачей. Фото таскается мышью или пальцем БЕЗ привязки
 * к краям, масштаб — ползунком. Сюда же перетаскивается файл.
 *
 * framing — { photoScale, photoPosX, photoPosY }.
 */
export default function PhotoFramer({ photo, framing, onPhotoChange, onFramingChange }) {
  const frame = useRef(null);
  const input = useRef(null);
  const drag = useRef(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Только что загруженное фото нужно один раз навести на лицо в onLoad
  const autofit = useRef(false);

  const upload = async (file) => {
    setBusy(true);
    setError('');
    try {
      const data = await adminApi.uploadPhoto(file);
      autofit.current = true;
      onPhotoChange(data.src);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить');
    } finally {
      setBusy(false);
    }
  };

  /**
   * Наводим кадр на лицо, как только новое фото загрузилось: телефонные снимки
   * вертикальные и в полный рост — по центру в круг попадает туловище.
   */
  const onImgLoad = (e) => {
    if (!autofit.current) return;
    autofit.current = false;
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const posY = h / w > 1.15 ? 18 : 0;
    onFramingChange({ ...DEFAULT_FRAMING, photoPosY: posY });
  };

  const pick = (files) => {
    const file = files?.[0];
    if (file) upload(file);
  };

  const onPointerDown = (e) => {
    if (!photo) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, posX: framing.photoPosX, posY: framing.photoPosY };
  };

  const onPointerMove = (e) => {
    if (!drag.current || !frame.current) return;
    // Тянешь фото вниз — хочешь увидеть верх, значит точка обзора едет к 0
    const k = 90 / frame.current.offsetWidth;
    onFramingChange({
      ...framing,
      photoPosX: clamp(drag.current.posX - (e.clientX - drag.current.x) * k, 0, 100),
      photoPosY: clamp(drag.current.posY - (e.clientY - drag.current.y) * k, 0, 100),
    });
  };

  const onPointerUp = () => { drag.current = null; };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={frame}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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
        onClick={() => { if (!photo) input.current?.click(); }}
        className={`relative h-[190px] w-[190px] touch-none overflow-hidden rounded-3xl border-2 border-dashed transition-colors ${
          over ? 'border-teal-500 bg-teal-50' : photo ? 'border-transparent bg-gray-100' : 'border-gray-300 bg-gray-50'
        } ${photo ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            draggable={false}
            onLoad={onImgLoad}
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={framingStyle(framing)}
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center text-xs font-medium text-gray-500">
            {busy ? <Loader2 size={20} className="animate-spin" /> : <ImageUp size={20} />}
            {busy ? 'Загружаем…' : 'Перетащите фото сюда или нажмите'}
          </span>
        )}

        {photo && busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-white">
            <Loader2 size={22} className="animate-spin" />
          </span>
        )}
      </div>

      {photo && (
        <>
          <p className="text-center text-xs leading-snug text-gray-500">
            Потяните фото, чтобы поймать лицо в кадр — так оно будет выглядеть на сайте
          </p>

          <div className="flex w-full max-w-[220px] items-center gap-2">
            <span className="text-xs font-medium text-gray-500">−</span>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.01}
              value={framing.photoScale}
              onChange={(e) => onFramingChange({ ...framing, photoScale: Number(e.target.value) })}
              aria-label="Масштаб фото"
              className="w-full accent-teal-600"
            />
            <span className="text-sm font-medium text-gray-500">+</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={busy}
              className="text-xs font-medium text-teal-600 hover:underline disabled:opacity-60"
            >
              Заменить фото
            </button>
            <button
              type="button"
              onClick={() => onFramingChange({ ...DEFAULT_FRAMING })}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline"
            >
              Сбросить кадр
            </button>
          </div>
        </>
      )}

      {error && <p className="text-center text-xs font-medium text-red-500">{error}</p>}

      <input
        ref={input}
        type="file"
        accept="image/*"
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
