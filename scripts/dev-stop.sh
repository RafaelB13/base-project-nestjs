#!/bin/bash

# Script to stop development environment

echo "🛑 Stopping development environment..."

# Stop and remove containers
docker-compose down

echo "✅ Environment stopped!"
echo ""
echo "💡 To remove persistent data, use: docker-compose down -v"
