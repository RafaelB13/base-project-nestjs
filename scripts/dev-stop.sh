#!/bin/bash

# Script para parar ambiente de desenvolvimento

echo "🛑 Parando ambiente de desenvolvimento..."

# Parar e remover containers
docker-compose down

echo "✅ Ambiente parado!"
echo ""
echo "💡 Para remover dados persistentes, use: docker-compose down -v"
