#!/bin/bash

# Script to execute migrations in Docker environment
# This script must be executed before starting the application in production

set -e

echo "🚀 Starting migration process..."

# Esperar o banco estar disponível
echo "⏳ Waiting for database to be available..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "✅ Database available!"

# Executar migrations
echo "📦 Executing migrations..."
npm run migration:run

echo "✅ Migrations executed successfully!"

# Verificar se há migrations pendentes
echo "🔍 Checking for pending migrations..."
if npm run migration:show | grep -q "No migrations"; then
  echo "✅ All migrations are up to date!"
else
  echo "⚠️ There are still pending migrations. Please check manually."
fi

echo "🎉 Migration process completed!"
