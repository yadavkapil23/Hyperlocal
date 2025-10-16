FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies for Postgres client and compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Alembic configuration
COPY alembic.ini ./
COPY alembic ./alembic

COPY app ./app

EXPOSE 5000

CMD ["gunicorn", "app.wsgi:app", "-w", "2", "-k", "gthread", "-b", "0.0.0.0:5000"]


