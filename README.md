Third-Place (Hyperlocal Social Discovery App)
A map-centric web app to discover local, community-driven events and hangouts. This repository provides local development with Docker for a Vite React frontend, an Express backend, and PostgreSQL + PostGIS.

Stack
- Frontend: React (Vite)
- Backend: Node.js (Express)
- Database: PostgreSQL with PostGIS
- Orchestration: Docker Compose

Quick Start

Prerequisites: Docker Desktop

```bash
# From repo root
docker compose up --build
```

Services
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- DB: localhost:5432 (db: thirdplace / user: thirdplace / pass: thirdplace)

Health
- Backend health: GET http://localhost:5000/health

Environment
- frontend/.env
  - VITE_API_BASE_URL=http://localhost:5000
- backend/.env
  - PORT=5000
  - DATABASE_URL=postgres://thirdplace:thirdplace@db:5432/thirdplace

Notes
- PostGIS enabled via db/init/01-postgis.sql
- Frontend calls GET /api/v1/hello to verify connectivity


