# NIFN Deployment Checklist

## Pre-Deployment

- [ ] All secrets/credentials are stored in a password manager (not in code)
- [ ] `.env` files for all services are backed up
- [ ] Server has Docker + Docker Compose installed
- [ ] Domain DNS records point to server IP:
  - `nifn.org.np` → server IP
  - `admin.nifn.org.np` → server IP
  - `developers.nifn.org.np` → server IP
  - `api.nifn.org.np` → server IP
- [ ] SSL certificates obtained (Let's Encrypt via Certbot)
- [ ] Firewall allows ports 80, 443 (and 22 for SSH)
- [ ] PostgreSQL volume (`pgdata`) has sufficient disk space
- [ ] Storage volume for uploads is backed up

## Build & Deploy

- [ ] Pull latest code from repository
- [ ] Checkout correct branch (main/production)
- [ ] Run `docker compose build --no-cache` for clean builds
- [ ] Run `docker compose up -d` to start all services
- [ ] Wait 30s for services to initialize

## Verification

### Backend
- [ ] API responds: `curl http://localhost:8000/api/v1/settings/public`
- [ ] Database migrations ran (check for 200 response)
- [ ] Storage symlink exists at `/app/public/storage`
- [ ] CORS headers are set correctly

### Website
- [ ] Homepage loads at `https://nifn.org.np`
- [ ] All public pages return 200 (about, technology, news, contact, etc.)
- [ ] Banner carousel is visible and auto-rotates
- [ ] Footer renders with correct social links

### Admin Dashboard
- [ ] Admin login loads at `https://admin.nifn.org.np/login`
- [ ] Can authenticate with admin credentials
- [ ] CRUD operations work for all modules (news, banners, galleries, etc.)
- [ ] File uploads work correctly
- [ ] Media library shows uploaded images

### Developer Portal
- [ ] Homepage loads at `https://developers.nifn.org.np`
- [ ] Sidebar navigation renders from API
- [ ] Documentation pages render with syntax highlighting
- [ ] SDKs page lists published SDKs
- [ ] Changelog timeline renders correctly
- [ ] Search functionality works

### Infrastructure
- [ ] Nginx reverse-proxies all subdomains correctly
- [ ] SSL/TLS certificates are valid (not expired)
- [ ] Static assets are cached with proper Cache-Control headers
- [ ] Client body size limit is 100M (for uploads)

## Post-Deployment

- [ ] Run `bash scripts/health-check.sh` — all checks pass
- [ ] Monitor logs: `docker compose logs --tail=50 -f`
- [ ] Verify no error logs in Laravel `storage/logs/`
- [ ] Test end-to-end: create a news post in admin → verify it appears on website
- [ ] Test file upload: upload an image → verify it displays on frontend
- [ ] Set up log rotation for Docker container logs
- [ ] Configure automated database backups
- [ ] Configure SSL auto-renewal (certbot cron job)

## Rollback

- [ ] Previous Docker images are tagged and available
- [ ] Database backup exists before any migration
- [ ] Rollback command: `docker compose down && git checkout <previous-tag> && docker compose up -d --build`
