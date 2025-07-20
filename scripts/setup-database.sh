#!/bin/bash
# filepath: /Users/rafaelborges/Dev/Node/upload-to-s3/scripts/setup-database.sh

echo "🗄️  Setting up database..."

# Aguardar o PostgreSQL estar pronto
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U devuser -d upload_s3_dev; do
  sleep 2
done

echo "🔧 Executing initialization script..."
docker-compose exec postgres psql -U devuser -d upload_s3_dev -f /docker-entrypoint-initdb.d/init.sql

echo "✅ Verifying everything was created correctly..."
echo "📊 Installed extensions:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\dx"

echo ""
echo "📋 Tables created:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\dt"

echo ""
echo "🏗️  Users table structure:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\d users"

echo ""
echo "✅ Database configured successfully!"
