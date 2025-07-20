#!/bin/bash

# Script to start development environment

echo "🚀 Starting development environment..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check container status
echo "📊 Container status:"
docker-compose ps

# Show application logs
echo "📝 Application logs:"
docker-compose logs app

echo "✅ Development environment started!"
echo "🌐 Application available at: http://localhost:3000"
echo "🗄️  PgAdmin available at: http://localhost:8080"
echo "   - Email: admin@example.com"
echo "   - Password: admin123"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f app"
echo "   - Stop environment: docker-compose down"
echo "   - Reset volumes: docker-compose down -v"
