#!/bin/bash
# filepath: /Users/rafaelborges/Dev/Node/upload-to-s3/scripts/setup-database.sh

echo "🗄️  Configurando banco de dados..."

# Aguardar o PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL ficar pronto..."
until docker-compose exec postgres pg_isready -U devuser -d upload_s3_dev; do
  sleep 2
done

echo "🔧 Executando script de inicialização..."
docker-compose exec postgres psql -U devuser -d upload_s3_dev -f /docker-entrypoint-initdb.d/init.sql

echo "✅ Verificando se tudo foi criado corretamente..."
echo "📊 Extensões instaladas:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\dx"

echo ""
echo "📋 Tabelas criadas:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\dt"

echo ""
echo "🏗️  Estrutura da tabela users:"
docker-compose exec postgres psql -U devuser -d upload_s3_dev -c "\d users"

echo ""
echo "✅ Banco de dados configurado com sucesso!"
