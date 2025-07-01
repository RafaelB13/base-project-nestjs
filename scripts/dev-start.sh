#!/bin/bash

# Script para iniciar ambiente de desenvolvimento

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

# Mostrar logs da aplicação
echo "📝 Logs da aplicação:"
docker-compose logs app

echo "✅ Ambiente de desenvolvimento iniciado!"
echo "🌐 Aplicação disponível em: http://localhost:3000"
echo "🗄️  PgAdmin disponível em: http://localhost:8080"
echo "   - Email: admin@example.com"
echo "   - Senha: admin123"
echo ""
echo "📋 Comandos úteis:"
echo "   - Ver logs: docker-compose logs -f app"
echo "   - Parar ambiente: docker-compose down"
echo "   - Resetar volumes: docker-compose down -v"
