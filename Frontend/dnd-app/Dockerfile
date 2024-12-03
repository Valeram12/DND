# Використовуємо базовий образ з Node.js 20
FROM node:20 AS build
# Встановлюємо робочу директорію
WORKDIR /app
# Копіюємо package.json та package-lock.json у контейнер
COPY ./package*.json ./
# Копіюємо весь проєкт у контейнер
COPY . .
# Встановлюємо залежності
RUN npm install
# Будуємо застосунок для продакшн
RUN npm run build
# Використовуємо базовий образ Nginx
FROM nginx:alpine

# Видаліть стандартну конфігурацію Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копіюйте свою конфігурацію до контейнера
COPY nginx.conf /etc/nginx/conf.d/


# Копіюємо побудований React застосунок до Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Виставляємо порт для Nginx
EXPOSE 80
# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]