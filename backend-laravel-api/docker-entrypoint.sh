#!/bin/sh

set -e

if [ ! -f /app/.env ]; then
    cp /app/.env.example /app/.env
fi

php artisan key:generate --force

php artisan storage:link

if [ "$APP_ENV" != "testing" ]; then
    php artisan migrate --force || true
fi

# Start nginx in background, then php-fpm in foreground
nginx -g "daemon off;" &
NGINX_PID=$!

# Ensure nginx stops if php-fpm exits
trap "kill $NGINX_PID 2>/dev/null" EXIT

exec "$@"