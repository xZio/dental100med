# Сборка фронта (Vite)
FROM node:24-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Рантайм: Express раздаёт API и собранный фронт
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
ENV DB_PATH=/data/app.db
# Фото из админки — на том же volume, что и база
ENV UPLOAD_DIR=/data/uploads

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY --from=builder /app/dist ./dist

EXPOSE 5000
# Coolify перезапускает контейнер, если API перестал отвечать
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
# При первом старте наполняем пустую базу, дальше поднимаем сервер.
# exec — чтобы node был PID 1 и получал SIGTERM при остановке (иначе Docker ждёт таймаут и шлёт SIGKILL)
CMD ["sh", "-c", "node server/seed.js --if-empty && exec node server/index.js"]
