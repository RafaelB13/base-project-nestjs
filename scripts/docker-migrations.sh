#!/bin/bash

# Script para executar migrations em ambiente Docker
# Este script deve ser executado antes de iniciar a aplicação em produção

set -e

echo "🚀 Iniciando processo de migrations..."

# Esperar o banco estar disponível
echo "⏳ Aguardando banco de dados estar disponível..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Aguardando PostgreSQL em $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "✅ Banco de dados disponível!"

# Executar migrations
echo "📦 Executando migrations..."
npm run migration:run

echo "✅ Migrations executadas com sucesso!"

# Verificar se há migrations pendentes
echo "🔍 Verificando migrations pendentes..."
if npm run migration:show | grep -q "No migrations"; then
  echo "✅ Todas as migrations estão em dia!"
else
  echo "⚠️ Ainda há migrations pendentes. Verifique manualmente."
fi

echo "🎉 Processo de migrations concluído!"
