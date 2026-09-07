# Промпты для генерации картинок (ChatGPT / GPT Image)

Единый стиль для всего сайта: **мягкий глянцевый 3D-рендер, объекты будто из
матового стекла и керамики, подсветка сине-бирюзовая**. От Денталии отличаемся
намеренно: там объекты стоят на сплошном синем квадрате, у нас — на прозрачном
фоне с мягкой тенью, силуэт чуть более округлый и «игрушечный».

Палитра сайта: основной синий `#2478e7`, тёмный `#1c63d4`, светлый фон `#eff8ff`,
бирюзовый акцент `#14b8a6`, белый `#ffffff`.

## Общая приписка ко всем промптам (добавлять в конец)

```
Style: soft glossy 3D render, matte ceramic and frosted-glass materials, smooth
rounded shapes, subtle blue rim light, soft ambient occlusion shadow beneath the
object. Color palette strictly: white #ffffff, blue #2478e7, deep blue #1c63d4,
teal accent #14b8a6, pale blue #eff8ff. Centered single object, 3/4 top-down
view, consistent lighting from top-left across the whole set. Transparent
background (PNG with alpha), no text, no logos, no watermark, no drop shadow on
the edges of the canvas. Square 1:1, 1024x1024.
```

---

## 1. Иконки разделов прайса (10 штук)

Класть в `public/images/services/<имя>.webp`, квадратные. Имя файла указано
в скобках — оно должно совпадать точь-в-точь, иначе картинка не подхватится.

| Раздел | Файл | Промпт (объект) |
|---|---|---|
| Консультация и диагностика | `diagnostics.webp` | `A 3D dental mirror and a small X-ray film showing a tooth, arranged together` |
| Лечение зубов — терапия | `therapy.webp` | `A clean healthy 3D molar tooth with a glossy white surface and a tiny blue shield in front of it` |
| Реставрация | `restoration.webp` | `A 3D tooth being polished, with a soft sparkle and a small composite syringe beside it` |
| Гигиена и профилактика | `hygiene.webp` | `A 3D electric toothbrush and a floating water droplet with tiny bubbles` |
| Детская стоматология | `kids.webp` | `A friendly smiling 3D cartoon tooth character with rosy cheeks, waving` |
| Протезирование — ортопедия | `prosthetics.webp` | `A 3D dental crown floating above a prepared tooth stump, ceramic material` |
| Виниры | `veneers.webp` | `Three thin glossy 3D ceramic veneer shells in a row, slightly overlapping` |
| Имплантация | `implantation.webp` | `A 3D dental implant: titanium screw post with a white ceramic crown on top` |
| Хирургия | `surgery.webp` | `A 3D dental forceps tool and a tooth, arranged neatly side by side` |
| Брекеты и элайнеры | `orthodontics.webp` | `A transparent 3D aligner tray and a small bracket with an archwire beside it` |

**Как просить у ChatGPT:** отправить одним сообщением объект + общую приписку.
Лучше генерировать по одной, начиная с `implantation` — она получается
эталонной, дальше просить «в том же стиле и освещении, что и предыдущая».

## 2. Иконки блока «Почему выбирают нас» (4 штуки)

Класть в `public/images/features/<имя>.webp`.

| Блок | Файл | Промпт (объект) |
|---|---|---|
| Гарантия качества | `guarantee.webp` | `A 3D shield with a check mark, glossy blue and white` |
| Без очередей | `no-queue.webp` | `A 3D wall clock with rounded body and a small calendar card behind it` |
| Современное оборудование | `equipment.webp` | `A 3D dental chair unit, simplified and toy-like, with a small lamp arm` |
| Семейная клиника | `family.webp` | `Three 3D tooth characters of different sizes standing together like a family` |

## 3. Картинка для главного экрана (hero)

Класть в `public/images/hero.webp`, горизонтальная 16:9 или 3:2.

```
A bright modern dental clinic interior, warm and welcoming, soft daylight from
large windows, clean white and light blue surfaces, a dental chair softly out of
focus in the background, plants near the window, no people, no text, no logos.
Photorealistic, shallow depth of field, calm and airy mood, blue-teal accents
matching #2478e7 and #14b8a6. Horizontal 3:2, high detail.
```

Нужен вариант «с людьми» — добавить: `a friendly female dentist in a light blue
uniform talking with a patient, both seen from behind or in soft focus, faces
not identifiable`.

> Осторожно: снимок не должен выглядеть как реальное фото именно этой клиники —
> у нас есть настоящие фото интерьера в галерее, а сгенерированный кадр
> используем только как фон-настроение.

## 4. Фоны для секций (2 штуки)

Класть в `public/images/bg/<имя>.webp`, широкие и очень светлые — поверх них
идёт текст.

| Где | Файл | Промпт |
|---|---|---|
| Блок записи / CTA | `cta.webp` | `Abstract soft gradient background, pale blue to white, with subtle smooth wave shapes and a few blurred light bokeh circles, very light and airy, no objects, no text. Horizontal 21:9` |
| Блок «О клинике» | `about.webp` | `Abstract background of soft rounded organic shapes in pale blue and teal on white, extremely subtle, low contrast, suitable as a background behind dark text. Horizontal 16:9` |

---

## Что сделать с готовыми картинками

1. Скинуть мне файлы (или положить в папку проекта) — я переведу в WebP,
   подрежу под нужный размер и разложу по местам.
2. Иконки разделов подхватятся автоматически, как только окажутся
   в `public/images/services/` с правильными именами: код уже умеет
   показывать картинку вместо запасной иконки.
