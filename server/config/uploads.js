import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Загруженные фото живут вне репозитория: в проде это тот же volume, что и база
export const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../data/uploads');

fs.mkdirSync(uploadDir, { recursive: true });
