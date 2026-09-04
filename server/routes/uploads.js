import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { uploadDir } from '../config/uploads.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const MAX_BYTES = 15 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES } });

/** Любой снимок → WebP 1600px. rotate() чинит EXIF-поворот телефонных фото. */
const toWebp = (input) =>
  sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

// POST /api/uploads — приём фото из админки (multipart, поле file)
//
// По MIME-типу не режем: телефоны нередко отдают снимок с пустым или
// octet-stream типом. Настоящая проверка — попытка раскодировать.
// iPhone снимает в HEIC, который sharp не читает (валится на HEVC-кадрах),
// поэтому на неудаче декодируем HEIC отдельно и сжимаем повторно.
router.post('/', protect, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл не получен' });

  const type = req.file.mimetype || '';
  if (type && !type.startsWith('image/') && type !== 'application/octet-stream')
    return res.status(415).json({ message: 'Это не изображение' });

  let output;
  try {
    output = await toWebp(req.file.buffer);
  } catch {
    try {
      const jpeg = await heicConvert({ buffer: req.file.buffer, format: 'JPEG', quality: 0.92 });
      output = await toWebp(Buffer.from(jpeg));
    } catch {
      return res.status(400).json({ message: 'Не удалось прочитать изображение' });
    }
  }

  // Имя выдаём сами — заодно отсекает попытки вылезти из каталога
  const name = `${randomUUID()}.webp`;
  await fs.writeFile(path.join(uploadDir, name), output);

  res.status(201).json({ src: `/uploads/${name}`, bytes: output.byteLength });
});

export default router;
