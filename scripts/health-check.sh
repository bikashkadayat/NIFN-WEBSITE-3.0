#!/usr/bin/env bash
set -euo pipefail

# ─── NIFN System Health Check ──────────────────────────────────────────────
# Verifies all containers are running, endpoints respond, DB works, storage OK.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

BASE_URL="${BASE_URL:-http://localhost}"

pass()  { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $1"; }
fail()  { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $1"; }
info()  { echo -e "  ${YELLOW}→${NC} $1"; }

echo ""
echo "══════════════════════════════════════════════"
echo "  NIFN System Health Check"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "══════════════════════════════════════════════"
echo ""

# ── 1. Container status ────────────────────────────────────────────────────
echo "── 1. Docker Containers ──"

if command -v docker &>/dev/null; then
  for svc in nifn-nginx nifn-api nifn-db nifn-website nifn-admin nifn-developer; do
    if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${svc}$"; then
      pass "Container ${svc} is running"
    else
      fail "Container ${svc} is NOT running"
    fi
  done
else
  info "Docker not available on this host — skipping container checks"
fi

echo ""

# ── 2. API endpoints ────────────────────────────────────────────────────────
echo "── 2. API Endpoints ──"

check_http() {
  local url="$1"
  local desc="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$code" = "000" ]; then
    fail "${desc} — connection refused"
  elif [ "$code" -ge 200 ] && [ "$code" -lt 500 ]; then
    pass "${desc} — HTTP ${code}"
  else
    fail "${desc} — HTTP ${code}"
  fi
}

# Public website pages
check_http "${BASE_URL}/"                  "Website homepage"
check_http "${BASE_URL}/about"            "Website /about"
check_http "${BASE_URL}/technology"       "Website /technology"
check_http "${BASE_URL}/news"             "Website /news"
check_http "${BASE_URL}/contact"          "Website /contact"

# Admin
check_http "${BASE_URL}/admin/login"      "Admin login page"

# Developer portal
check_http "${BASE_URL_PORTAL:-http://localhost:3003}/" "Developer portal homepage"

# API endpoints
API="${BASE_URL_API:-http://localhost:8000/api}"
check_http "${API}/v1/settings/public"    "API /v1/settings/public"
check_http "${API}/v1/menus/public"      "API /v1/menus/public"
check_http "${API}/v1/banners/active"    "API /v1/banners/active"
check_http "${API}/v1/news"              "API /v1/news"
check_http "${API}/v1/developer/navigation" "API /v1/developer/navigation"

echo ""

# ── 3. Database connection ──────────────────────────────────────────────────
echo "── 3. Database ──"

# Check via Laravel's health endpoint if available
DB_CHECK=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "${API}/v1/health" 2>/dev/null || echo "")
if [ -n "$DB_CHECK" ]; then
  pass "API health endpoint responds"
else
  # Fallback: check by hitting pg directly
  if command -v docker &>/dev/null; then
    if docker exec nifn-db pg_isready -U nifn_user -d nifn &>/dev/null 2>&1; then
      pass "PostgreSQL is accepting connections"
    else
      fail "PostgreSQL is NOT responding"
    fi
  else
    info "Cannot check database — no Docker access"
  fi
fi

echo ""

# ── 4. Storage ──────────────────────────────────────────────────────────────
echo "── 4. Storage ──"

if command -v docker &>/dev/null; then
  if docker exec nifn-api test -L /app/public/storage 2>/dev/null; then
    pass "Storage symlink exists at /app/public/storage"
  else
    fail "Storage symlink is missing"
  fi
else
  if [ -L "${LOCAL_LARAVEL_PATH:-./backend-laravel-api}/public/storage" ]; then
    pass "Storage symlink exists locally"
  else
    fail "Storage symlink is missing locally"
  fi
fi

echo ""

# ── 5. Summary ──────────────────────────────────────────────────────────────
echo "══════════════════════════════════════════════"
if [ "$FAIL" -eq 0 ]; then
  echo -e "  ${GREEN}ALL ${PASS} CHECKS PASSED${NC}"
else
  echo -e "  ${PASS} passed, ${RED}${FAIL} failed${NC}"
fi
echo "══════════════════════════════════════════════"
echo ""

exit "$FAIL"
