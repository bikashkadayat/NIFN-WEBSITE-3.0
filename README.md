# NIFN Website 3.0

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The **Nepal Internet Foundation (NIFN)** website — a multi-service content management platform featuring a public-facing website, admin dashboard, developer portal, and a RESTful API backend.

## Architecture

```
                         ┌───────────────┐
                         │   Nginx (80)   │
                         │  Reverse Proxy │
                         └───────┬───────┘
                ┌────────────────┼────────────────────┐
                │                │                     │
         ┌──────┴──────┐  ┌─────┴──────┐  ┌───────────┴────┐
         │  Frontend   │  │   Admin    │  │  Developer     │
         │  :3000      │  │  :3002     │  │  Portal :3003  │
         │  (Next.js)  │  │  (Next.js) │  │  (Next.js)     │
         └──────┬──────┘  └─────┬──────┘  └───────────┬────┘
                │               │                      │
                └───────────────┼──────────────────────┘
                                │
                        ┌───────┴───────┐
                        │  Laravel API  │
                        │   :8000       │
                        └───────┬───────┘
                                │
                        ┌───────┴───────┐
                        │  PostgreSQL   │
                        │   :5432       │
                        └───────────────┘
```

## Services

| Service | Tech | Dev Port | Prod Port | URL |
|---|---|---|---|---|
| **API Backend** | Laravel 11 | `:8000` | `:8000` | `api.nifn.org.np` |
| **Frontend** | Next.js 14 | `:3007` | `:3000` | `nifn.org.np` |
| **Admin Dashboard** | Next.js 16 | `:3008` | `:3002` | `admin.nifn.org.np` |
| **Developer Portal** | Next.js 14 | `:3006` | `:3003` | `developers.nifn.org.np` |
| **Database** | PostgreSQL 16 | `:5432` | `:5432` | — |
| **Reverse Proxy** | Nginx | `:80` | `:80` / `:443` | — |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local dev)
- PHP 8.2+ & Composer (for local dev)

### Using Docker (recommended)

```bash
# Clone and start all services
git clone https://github.com/bikashkadayat/NIFN-WEBSITE-3.0.git
cd NIFN-WEBSITE-3.0
docker compose up -d --build

# Run migrations and seed data
docker compose exec backend php artisan migrate --seed
```

### Local Development

Each service runs independently for development:

```bash
# 1. API Backend
cd backend-laravel-api
cp .env.example .env
composer install
php artisan migrate --seed
php artisan serve --port=8000

# 2. Frontend (public website)
cd frontend
npm install
npm run dev          # → http://localhost:3007

# 3. Admin Dashboard
cd admin
npm install
npm run dev          # → http://localhost:3008

# 4. Developer Portal
cd developer-portal
npm install
npm run dev          # → http://localhost:3006
```

## API Overview

Base URL: `http://localhost:8000/api/v1`

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/v1/banners` | Hero banners |
| GET | `/v1/news` | News listing |
| GET | `/v1/news/{slug}` | Single news |
| GET | `/v1/news/categories` | News categories |
| GET | `/v1/galleries` | Photo galleries |
| GET | `/v1/galleries/{slug}` | Single gallery |
| GET | `/v1/content/{slug}` | Content pages |
| GET | `/v1/menus/{location}` | Navigation menus |
| GET | `/v1/settings/public` | Public settings |
| GET | `/v1/downloads` | Downloadable files |
| GET | `/v1/search?q=` | Search |
| POST | `/v1/contact` | Contact form |
| POST | `/v1/newsletter/subscribe` | Newsletter signup |
| GET | `/v1/developer/navigation` | Dev portal nav |
| GET | `/v1/developer/pages` | Dev portal pages |
| GET | `/v1/developer/sdks` | SDK listing |
| GET | `/v1/developer/changelog` | Changelog |

### Authentication

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@nifn.org.np",
  "password": "admin123"
}
```

Response includes a Sanctum token. Use as `Authorization: Bearer <token>` for admin endpoints.

## Credentials (Development)

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@nifn.org.np` | `admin123` |
| Admin | `testadmin@nifn.org.np` | `admin123` |
| Editor | `editor@nifn.org.np` | `admin123` |
| Viewer | `viewer@nifn.org.np` | `admin123` |

## Project Structure

```
├── backend-laravel-api/    # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/   # API controllers
│   │   ├── Models/                    # Eloquent models
│   │   └── Http/Resources/            # API resources
│   ├── database/
│   │   ├── migrations/                # Database migrations
│   │   └── seeders/                   # Seed data
│   └── routes/api.php                 # API route definitions
├── frontend/               # Public website (Next.js)
│   └── src/
│       ├── app/                       # App router pages
│       └── components/                # Shared components
├── admin/                  # Admin dashboard (Next.js)
│   └── src/
│       ├── app/admin/                 # Admin page routes
│       └── components/                # Admin UI components
├── developer-portal/       # Developer portal (Next.js)
│   └── src/
│       ├── app/                       # Portal pages
│       └── components/                # Portal components
├── nginx/
│   └── default.conf                   # Reverse proxy config
├── scripts/
│   └── health-check.sh               # System health checker
└── docker-compose.yml                # Service orchestration
```

## Features

- **Multi-lingual Content** — Content managed with locale-based translations
- **Rich Text Editing** — TipTap editor with image support
- **Media Library** — Centralized image/file management
- **Role-Based Access** — Super Admin, Admin, Editor, Viewer roles
- **Menu Builder** — Drag-and-drop menu management
- **Banner System** — Rotating hero banners with scheduling
- **News & Blog** — Categorized articles with tags
- **Photo Galleries** — Image galleries with drag-and-drop reordering
- **Developer Portal** — SDK docs, changelog, and registration
- **Contact Management** — Form submissions with read/status tracking
- **Newsletter** — Subscribe/unsubscribe management
- **Activity Logs** — Full audit trail for admin actions
- **Search** — Full-text search across published content
- **SEO** — Dynamic sitemaps and robots.txt

## Deployment

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for a complete production deployment guide.

```bash
# Production deploy
docker compose build --no-cache
docker compose up -d
bash scripts/health-check.sh
```

## Health Check

```bash
BASE_URL=http://localhost bash scripts/health-check.sh
```

Checks container status, API endpoint availability, database connectivity, and storage integrity.

## License

This project is licensed under the MIT License.
