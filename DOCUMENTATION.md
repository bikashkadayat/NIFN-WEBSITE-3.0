# NIFN Website 3.0 - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [API Documentation](#api-documentation)
6. [Development Setup](#development-setup)
7. [Working Flow](#working-flow)
8. [Database Schema](#database-schema)
9. [Components](#components)
10. [Authentication](#authentication)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **Nepal Internet Foundation (NIFN)** website is a multi-service content management platform built with a microservices architecture. It features:

- **Public Website** - Main landing page with news, galleries, and content
- **Admin Dashboard** - Content management system for administrators
- **Developer Portal** - Documentation and SDK resources for developers
- **REST API Backend** - Laravel-based API serving all frontends

---

## Architecture

```
                          ┌───────────────┐
                          │   Nginx (80)   │
                          │  Reverse Proxy │
                          └───────┬───────┘
                 ┌────────────────┼─────────────────┐
                 │                │                  │
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

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend API** | Laravel | 11 |
| **Frontend** | Next.js | 14.2.0 |
| **Admin** | Next.js | 14 |
| **Developer Portal** | Next.js | 14 |
| **Database** | PostgreSQL | 16 |
| **Reverse Proxy** | Nginx | Alpine |
| **Containerization** | Docker Compose | Latest |
| **Frontend UI** | TailwindCSS | 3.4.0 |
| **State Mgmt** | React Query | 5.28.0 |
| **Rich Text** | TipTap | 2.2.4 |
| **Auth** | Laravel Sanctum | - |

---

## Project Structure

### Root Directory
```
NIFNWEBSITE/
├── backend-laravel-api/    # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/   # API controllers
│   │   │   ├── Middleware/            # Custom middleware
│   │   │   ├── Requests/              # Form request validation
│   │   │   └── Resources/             # API resources
│   │   ├── Models/                    # Eloquent models
│   │   ├── Observers/                 # Model observers
│   │   └── Services/                  # Custom services
│   ├── config/                        # Configuration files
│   ├── database/
│   │   ├── migrations/                # Database migrations
│   │   ├── seeders/                   # Seed data
│   │   └── factories/                 # Model factories
│   ├── routes/
│   │   ├── api.php                    # API routes
│   │   └── web.php                    # Web routes
│   ├── resources/
│   │   └── views/                     # Blade templates
│   └── public/                         # Public entry point
├── frontend/               # Public website (Next.js)
│   └── src/
│       ├── app/                       # App router pages
│       │   ├── page.tsx               # Homepage
│       │   ├── news/                  # News pages
│       │   ├── gallery/               # Gallery pages
│       │   ├── blog/                  # Blog pages
│       │   ├── contact/               # Contact page
│       │   ├── downloads/             # Downloads page
│       │   └── admin/                 # Admin routes (if any)
│       ├── components/                # Shared components
│       │   ├── home/                  # Homepage components
│       │   ├── layout/                # Layout components
│       │   ├── ui/                    # UI primitives
│       │   └── forms/                 # Form components
│       ├── hooks/                     # Custom React hooks
│       ├── lib/                       # Utilities & API client
│       └── types/                     # TypeScript types
├── admin/                  # Admin dashboard (Next.js)
│   └── src/
│       ├── app/
│       │   ├── admin/                 # Admin pages
│       │   └── login/                 # Login page
│       ├── components/                # Admin UI components
│       └── providers/                 # Auth & query providers
├── developer-portal/       # Developer portal (Next.js)
│   └── src/
│       ├── app/
│       │   ├── (docs)/                # Documentation routes
│       │   ├── register/              # Developer registration
│       │   ├── changelog/             # Changelog page
│       │   └── sdks/                  # SDKs page
│       ├── components/                # Portal components
│       └── lib/                       # API utilities
├── nginx/
│   └── default.conf                   # Reverse proxy config
├── scripts/
│   └── health-check.sh               # Health check script
├── docker-compose.yml                # Service orchestration
├── README.md                         # Project readme
└── DEPLOYMENT_CHECKLIST.md           # Deployment guide
```

---

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

**Login Endpoint:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@nifn.org.np",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "sanctum-token-here",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@nifn.org.np",
    "role": "super_admin"
  }
}
```

**Use Token:**
```
Authorization: Bearer <token>
```

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/v1/banners` | Hero banners list |
| GET | `/v1/news` | News listing (supports `?featured=1&limit=N`) |
| GET | `/v1/news/{slug}` | Single news article |
| GET | `/v1/news/categories` | News categories |
| GET | `/v1/galleries` | Gallery listings |
| GET | `/v1/galleries/{slug}` | Single gallery |
| GET | `/v1/content/{slug}` | Content page by slug |
| GET | `/v1/menus/{location}` | Navigation menus |
| GET | `/v1/settings/public` | Public settings |
| GET | `/v1/downloads` | Downloadable files |
| GET | `/v1/search?q=` | Full-text search |
| POST | `/v1/contact` | Contact form submission |
| POST | `/v1/newsletter/subscribe` | Newsletter signup |
| POST | `/v1/newsletter/unsubscribe` | Newsletter unsubscribe |
| GET | `/v1/sitemap/news` | News sitemap |
| GET | `/v1/sitemap/galleries` | Galleries sitemap |

### Developer Portal Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/developer/navigation` | Portal navigation |
| GET | `/v1/developer/pages` | Documentation pages |
| GET | `/v1/developer/pages/{slug}` | Single doc page |
| GET | `/v1/developer/sdks` | SDK listings |
| GET | `/v1/developer/changelog` | Changelog entries |
| GET | `/v1/developer/settings` | Portal settings |
| POST | `/v1/developer/register` | Developer registration |

### Admin Endpoints (Authenticated)

| Resource | Endpoints |
|----------|-----------|
| Contents | GET/POST/PUT/DELETE `/admin/contents` |
| News | GET/POST/PUT/DELETE `/admin/news` |
| News Categories | GET/POST/PUT/DELETE `/admin/news-categories` |
| Tags | GET/POST/PUT/DELETE `/admin/tags` |
| Galleries | GET/POST/PUT/DELETE `/admin/galleries` |
| Gallery Images | GET/POST/DELETE `/admin/galleries/{id}/images` |
| Banners | GET/POST/PUT/DELETE `/admin/banners` |
| Downloads | GET/POST/PUT/DELETE `/admin/downloads` |
| Download Categories | GET/POST/PUT/DELETE `/admin/download-categories` |
| Popup Notices | GET/POST/PUT/DELETE `/admin/popup-notices` |
| Menus | GET/POST/PUT/DELETE `/admin/menus` |
| Menu Items | GET/POST/PUT/DELETE `/admin/menus/{id}/items` |
| Settings | GET/PUT `/admin/settings` |
| Users | GET/POST/PUT/DELETE `/admin/users` |
| Media | GET/POST/PUT/DELETE `/admin/media` |
| Contact Submissions | GET/PUT/DELETE `/admin/contact-submissions` |
| Newsletter Subscribers | GET/DELETE `/admin/newsletter-subscribers` |
| Developer Registrations | GET/POST/DELETE `/admin/developer-registrations` |
| Activity Logs | GET `/admin/activity-logs` |

---

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local dev)
- PHP 8.2+ & Composer (for local dev)

### Using Docker (Recommended)

```bash
# Clone and start all services
git clone <repo-url>
cd NIFNWEBSITE
docker compose up -d --build

# Run migrations and seed data
docker compose exec backend php artisan migrate --seed
```

### Local Development (Separate Terminals)

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

---

## Working Flow

### Request Lifecycle

```
Visitor → Nginx → Frontend (Next.js) → API Fetch → Laravel → PostgreSQL
Admin   → Nginx → Admin Panel → Axios → Laravel API → PostgreSQL
```

### Frontend Data Flow

1. **Homepage (`frontend/src/app/page.tsx`)**
   - Fetches banners from `/api/v1/banners`
   - Fetches featured news from `/api/v1/news?featured=1&limit=3`
   - Fetches content sections via `fetchContent()` helper
   - Uses `HeroBanner`, `VideoSection`, `LatestNews`, `Partners`, `CallToAction` components

2. **API Client (`frontend/src/lib/api.ts`)**
   - Axios instance with request/response interceptors
   - Adds Bearer token automatically
   - Handles 401 auto-logout

3. **Content Fetch (`frontend/src/lib/content-fetch.ts`)**
   - `fetchContent(slug, locale)` - Fetch page content by slug
   - `fetchSettings()` - Get public settings

4. **Types (`frontend/src/types/index.ts`)**
   - TypeScript interfaces for all entities
   - Translation types, PaginatedResponse, etc.

### Admin Dashboard Flow

1. **API Client (`admin/src/lib/api.ts`)**
   - Axios instance with full API coverage
   - Helper functions: `apiGet`, `apiPost`, `apiPut`, `apiDelete`
   - Organized by resource: `contentsApi`, `newsApi`, `galleriesApi`, etc.

2. **Auth Provider (`admin/src/providers/auth-provider.tsx`)**
   - Manages authentication state
   - Provides `login()`, `logout()`, `user` to components

3. **Login (`admin/src/app/login/page.tsx`)**
   - POST credentials to `/api/v1/auth/login`
   - Stores token in localStorage
   - Redirects to `/admin` on success

4. **Dashboard (`admin/src/app/admin/page.tsx`)**
   - Fetches stats from `/admin/dashboard/stats`
   - Displays cards, charts, recent activities

5. **Content Management**
   - List: `admin/src/app/admin/contents/page.tsx`
   - Create/Edit: `admin/src/app/admin/contents/create/page.tsx`, `admin/src/app/admin/contents/[id]/page.tsx`
   - Delete with confirmation dialog

6. **Media Library**
   - Upload: `admin/src/components/ui/file-upload.tsx`, `admin/src/components/ui/image-upload.tsx`
   - List: `admin/src/app/admin/media/page.tsx`
   - Uses `rich-text-editor.tsx` for content editing

### Developer Portal Flow

1. **API Client (`developer-portal/src/lib/api.ts`)**
   - Server-side fetch functions
   - `fetchNavigation()`, `getDeveloperPages()`, `getDeveloperSdks()`
   - `fetchDeveloperChangelog()`, `searchDeveloperDocs()`
   - Registration: `submitDeveloperRegistration()`

2. **Homepage (`developer-portal/src/app/page.tsx`)**
   - Fetches settings, pages, SDKs, changelog in parallel
   - Renders hero, features, SDKs, changelog sections

3. **Registration (`developer-portal/src/app/register/page.tsx`)**
   - Form validation with Zod
   - POST to `/api/v1/developer-registrations`

4. **Documentation (`developer-portal/src/app/(docs)/`)**
   - Dynamic routes: `/(docs)/docs/[slug]/page.tsx`
   - Search: `/(docs)/search/page.tsx`
   - Changelog: `/(docs)/changelog/page.tsx`
   - SDKs: `/(docs)/sdks/page.tsx`

---

## Database Schema

### Core Tables

| Table | Purpose | Key Model File |
|-------|---------|----------------|
| `users` | Admin users with roles | `backend-laravel-api/app/Models/User.php` |
| `roles` | Role definitions | `backend-laravel-api/app/Models/Role.php` |
| `contents` | CMS content pages | `backend-laravel-api/app/Models/Content.php` |
| `news` | News articles | `backend-laravel-api/app/Models/News.php` |
| `galleries` | Image galleries | `backend-laravel-api/app/Models/Gallery.php` |
| `banners` | Hero banner images | `backend-laravel-api/app/Models/Banner.php` |
| `media` | File uploads | `backend-laravel-api/app/Models/Media.php` |
| `downloads` | Downloadable files | `backend-laravel-api/app/Models/Download.php` |
| `menus` | Navigation menus | `backend-laravel-api/app/Models/Menu.php` |
| `settings` | Key-value settings | `backend-laravel-api/app/Models/Setting.php` |
| `contact_submissions` | Contact form data | `backend-laravel-api/app/Models/ContactSubmission.php` |
| `newsletter_subscribers` | Email subscriptions | `backend-laravel-api/app/Models/NewsletterSubscriber.php` |
| `developer_registrations` | Developer signups | `backend-laravel-api/app/Models/DeveloperRegistration.php` |
| `activity_logs` | Admin action logs | `backend-laravel-api/app/Models/ActivityLog.php` |

### Translation Tables

Each translatable model has a corresponding `{model}_translations` table:
- `content_translations` - title, body, excerpt, SEO fields
- `news_translations` - localized news content  
- `news_category_translations` - category names
- `gallery_translations` - gallery titles/descriptions
- `banner_translations` - banner text
- `download_translations` - download titles/descriptions
- `developer_page_translations` - dev portal page content
- `developer_sdk_translations` - SDK descriptions
- `developer_changelog_translations` - changelog entries
- `menu_item_translations` - menu item labels
- `popup_notice_translations` - popup text

---

## Components

### Frontend Components

**Home Components (`frontend/src/components/home/`):**
- `HeroBanner.tsx` - Carousel hero with auto-rotation (6s interval), touch swipe support
- `VideoSection.tsx` - Video embed section
- `LatestNews.tsx` - News listing display with category filtering
- `Partners.tsx` - Partner logos display
- `CallToAction.tsx` - CTA section with dynamic content

**UI Components (`frontend/src/components/ui/`):**
- `Button.tsx` - Reusable button with variants
- `Card.tsx` - Card container component
- `Pagination.tsx` - Pagination controls
- `SearchModal.tsx` - Search overlay modal
- `Skeleton.tsx` - Loading placeholders
- `Lightbox.tsx` - Image lightbox for galleries
- `Breadcrumb.tsx` - Navigation breadcrumbs

**Layout Components (`frontend/src/components/layout/`):**
- `Navbar.tsx` - Top navigation with mobile menu
- `Footer.tsx` - Site footer with links
- `PopupNotice.tsx` - Popup notification display
- `NewsletterForm.tsx` - Newsletter subscription form

**Forms (`frontend/src/components/forms/`):**
- `ContactForm.tsx` - Contact page form with validation

### Admin Components

**UI Components (`admin/src/components/ui/`):**
- `rich-text-editor.tsx` - TipTap editor wrapper for content
- `data-table.tsx` - Data listing with sorting, filtering, pagination
- `file-upload.tsx` - File upload component with progress
- `image-upload.tsx` - Image upload with preview
- `locale-tabs.tsx` - Multi-language content tabs
- `form-field.tsx` - Form input wrapper
- `confirm-dialog.tsx` - Confirmation dialog
- `spinner.tsx` - Loading spinner
- `modal.tsx` - Modal dialog

---

## Authentication

### Sanctum SPA Authentication

1. **Login** - POST credentials → returns token
2. **Token Storage** - Stored in localStorage
3. **Request Interception** - Axios adds `Authorization: Bearer` header
4. **Auto Logout** - On 401 response, token removed and redirect to login
5. **Role-Based Access** - User has `role` property (super_admin, admin, editor, viewer)

### Auth Provider (`admin/src/providers/auth-provider.tsx`)
- Manages user state via React context
- Provides `login()`, `logout()`, `user` to components
- Integrates with localStorage for token persistence

### Revalidation Service (`backend-laravel-api/app/Services/RevalidationService.php`)
- Triggers cache invalidation after content changes
- Calls Next.js revalidation endpoints
- Supports multiple portal types (website, admin, developer)

## Most Important Files

| File | Purpose |
|------|---------|
| `backend-laravel-api/routes/api.php` | All API route definitions |
| `backend-laravel-api/app/Models/User.php` | User model with Sanctum |
| `backend-laravel-api/app/Http/Controllers/Api/V1/AuthController.php` | Authentication logic |
| `backend-laravel-api/app/Http/Controllers/Api/V1/Admin/ContentController.php` | Content CRUD operations |
| `frontend/src/app/page.tsx` | Homepage with parallel data fetching |
| `frontend/src/lib/api.ts` | API client for frontend |
| `frontend/src/lib/content-fetch.ts` | Content fetching utility |
| `admin/src/app/login/page.tsx` | Admin login page |
| `admin/src/app/admin/page.tsx` | Admin dashboard |
| `admin/src/lib/api.ts` | Full admin API client |
| `admin/src/providers/auth-provider.tsx` | Auth context provider |
| `developer-portal/src/app/page.tsx` | Developer portal homepage |
| `developer-portal/src/lib/api.ts` | Developer API client |
| `docker-compose.yml` | Service orchestration |
| `nginx/default.conf` | Reverse proxy configuration |
| `scripts/health-check.sh` | System health verification |

### API Controllers (Most Important)

**Frontend Controllers:**
- `BannerController.php` - Public banner listing
- `NewsController.php` - News listing and detail
- `GalleryController.php` - Gallery listing and images
- `ContentController.php` - Content page fetch
- `SearchController.php` - Full-text search
- `DeveloperPortalController.php` - Developer docs API

**Admin Controllers:**
- `Admin/ContentController.php` - CRUD for content
- `Admin/NewsController.php` - CRUD for news
- `Admin/GalleryController.php` - Gallery management
- `Admin/MediaController.php` - File uploads
- `Admin/UserController.php` - User management
- `Admin/SettingController.php` - Site settings

---

## Deployment

### Production Build

```bash
# Build all containers
docker compose build --no-cache

# Start services
docker compose up -d

# Check health
BASE_URL=http://localhost bash scripts/health-check.sh
```

### Environment Variables

**Backend:**
```
APP_ENV=production
APP_URL=https://api.nifn.org.np
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=nifn
DB_USERNAME=nifn
DB_PASSWORD=nifn_secret
```

**Frontend/Admin/DevPortal:**
```
NEXT_PUBLIC_API_URL=https://api.nifn.org.np/api
NEXT_PUBLIC_SITE_URL=https://nifn.org.np
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `backend-laravel-api/config/cors.php`
   - Verify `NEXT_PUBLIC_API_URL` matches expected origin

2. **401 Unauthorized**
   - Token expired - re-login required
   - Check user `is_active` status in database

3. **Images Not Loading**
   - Check storage symlink: `php artisan storage:link`
   - Verify `storage_data` volume mounted in Docker

4. **Database Connection Failed**
   - Ensure PostgreSQL container is healthy
   - Check database credentials in `.env`

5. **Build Failures**
    - Clear Next.js cache: `rm -rf .next`
    - Clear Laravel cache: `php artisan config:clear`

---

## Scripts

### Health Check (`scripts/health-check.sh`)

Verifies system health in 4 steps:

1. **Docker Containers** - Checks all 6 services are running
2. **API Endpoints** - Tests HTTP responses for all key URLs  
3. **Database** - Confirms PostgreSQL connectivity
4. **Storage** - Validates storage symlink exists

**Usage:**
```bash
BASE_URL=http://localhost bash scripts/health-check.sh
```

**Exit codes:** 0 on success, non-zero on failures

---

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Environment (local/production) | production |
| `APP_DEBUG` | Debug mode | false |
| `APP_URL` | API base URL | https://api.nifn.org.np |
| `DB_CONNECTION` | Database driver | pgsql |
| `DB_HOST` | Database host | postgres |
| `DB_PORT` | Database port | 5432 |
| `DB_DATABASE` | Database name | nifn |
| `DB_USERNAME` | Database user | nifn |
| `DB_PASSWORD` | Database password | nifn_secret |
| `SESSION_DRIVER` | Session storage | file |
| `FILESYSTEM_DISK` | File storage disk | public |
| `CACHE_STORE` | Cache driver | file |
| `QUEUE_CONNECTION` | Queue driver | sync |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API endpoint | http://localhost:8000/api |
| `NEXT_PUBLIC_SITE_URL` | Site URL | http://localhost:3007 |

---

## License

MIT License - See LICENSE file for details.