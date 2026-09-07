import { useEffect, useRef, useState } from 'react';
import { loadYandexMaps } from '../lib/yandex-maps.js';

/** Клиника: пр-т Юных Ленинцев, 82В, ТЦ «Максимум». */
const CENTER = [55.484551, 37.567411];
const MAPS_URL = 'https://yandex.ru/maps/org/dentalstomed/159190759541/';
/** Насколько метка поднимается над точкой — на столько же сдвигаем балун. */
const PIN_HEIGHT = 54;

/**
 * Живая карта (JS API 2.1, без ключа) со знаком клиники вместо стандартной метки.
 * Копирайты, логотип Яндекса и его кнопки не перекрываем — этого требуют правила
 * использования API.
 */
export default function ClinicMap({ address, className = '' }) {
  const holder = useRef(null);
  const map = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    loadYandexMaps()
      .then((ymaps) => {
        if (!alive || !holder.current || map.current) return;

        map.current = new ymaps.Map(
          holder.current,
          { center: CENTER, zoom: 16, controls: ['zoomControl'] },
          { yandexMapDisablePoiInteractivity: true }
        );
        map.current.controls.get('zoomControl').options.set({ size: 'small' });

        const PinLayout = ymaps.templateLayoutFactory.createClass(
          '<div class="clinic-pin"><span class="clinic-pin__body"><img src="/icons/icon-192.png" alt="" /></span><span class="clinic-pin__tip"></span></div>'
        );

        const BalloonLayout = ymaps.templateLayoutFactory.createClass(
          `<div class="clinic-balloon">
             <button type="button" class="clinic-balloon__close" aria-label="Закрыть">&times;</button>
             <p class="clinic-balloon__title">$[properties.balloonHeader]</p>
             <p class="clinic-balloon__body">$[properties.balloonContent]</p>
             <span class="clinic-balloon__tail"></span>
           </div>`,
          {
            build: function () {
              this.constructor.superclass.build.call(this);
              this._el = this.getElement().querySelector('.clinic-balloon');
              this._onClose = () => this.events.fire('userclose');
              this._el.querySelector('.clinic-balloon__close').addEventListener('click', this._onClose);
              this.applyOffset();
            },
            clear: function () {
              this._el.querySelector('.clinic-balloon__close').removeEventListener('click', this._onClose);
              this.constructor.superclass.clear.call(this);
            },
            onSublayoutSizeChange: function () {
              this.constructor.superclass.onSublayoutSizeChange.apply(this, arguments);
              this.applyOffset();
              this.events.fire('shapechange');
            },
            applyOffset: function () {
              if (!this._el) return;
              this._el.style.left = `-${this._el.offsetWidth / 2}px`;
              this._el.style.top = `-${this._el.offsetHeight + PIN_HEIGHT}px`;
            },
            getShape: function () {
              if (!this._el) return null;
              return new ymaps.shape.Rectangle(
                new ymaps.geometry.pixel.Rectangle([
                  [0, 0],
                  [this._el.offsetWidth, this._el.offsetHeight + PIN_HEIGHT],
                ])
              );
            },
          }
        );

        const placemark = new ymaps.Placemark(
          CENTER,
          {
            balloonHeader: 'Стоматология «ДенталстоМед»',
            balloonContent: address,
          },
          {
            iconLayout: PinLayout,
            iconShape: { type: 'Circle', coordinates: [0, -28], radius: 20 },
            balloonLayout: BalloonLayout,
            balloonPanelMaxMapArea: 0,
            hideIconOnBalloonOpen: false,
          }
        );

        map.current.geoObjects.add(placemark);
      })
      .catch(() => alive && setFailed(true));

    return () => {
      alive = false;
      if (map.current) {
        map.current.destroy();
        map.current = null;
      }
    };
  }, [address]);

  return (
    <div className={`card overflow-hidden p-0 relative ${className}`}>
      <div ref={holder} className="clinic-map h-full w-full" />

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-500">
          Карта не загрузилась.
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="ml-1 underline">
            Открыть в Яндекс.Картах
          </a>
        </div>
      )}
    </div>
  );
}
