#!/bin/sh

# Run migrations if they exist
echo "Running migrations..."
php spark migrate --all

# Start Apache in foreground
echo "Starting Apache..."
exec apache2-foreground
