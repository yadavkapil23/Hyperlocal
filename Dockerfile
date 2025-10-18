# Multi-stage build for single deployment
FROM node:20-alpine as frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

# Backend stage
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["gunicorn", "app.wsgi:app", "-w", "2", "-k", "gthread", "-b", "0.0.0.0:5000"]
