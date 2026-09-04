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

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY --from=builder /app/dist ./dist

EXPOSE 5000
# При первом старте наполняем пустую базу, дальше просто поднимаем сервер
CMD ["sh", "-c", "node server/seed.js --if-empty && node server/index.js"]
