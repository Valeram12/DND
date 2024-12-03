# Використовуємо офіційний образ Python 3.12
FROM python:3.12-slim

# Встановлюємо змінні середовища
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файл requirements.txt
# COPY Backend/DND/requirements.txt .
COPY requirements.txt .

# Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо весь код програми в контейнер
# COPY Backend/DND /app
COPY . /app

# Експортуємо порт для Flask
EXPOSE 5000

# Встановлюємо змінну FLASK_APP
# ENV FLASK_APP=DND.app
ENV FLASK_APP=app

# Запускаємо сервер Flask
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
