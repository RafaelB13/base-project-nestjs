#!/bin/bash

# Script para gerenciar migrations
# Uso: ./scripts/migration.sh [comando] [nome_da_migration]

set -e

COMMAND=$1
MIGRATION_NAME=$2

case $COMMAND in
  "create")
    if [ -z "$MIGRATION_NAME" ]; then
      echo "❌ Nome da migration é obrigatório para criar"
      echo "Uso: ./scripts/migration.sh create NomeDaMigration"
      exit 1
    fi
    echo "🚀 Criando nova migration: $MIGRATION_NAME"
    npm run migration:create -- src/database/migrations/$MIGRATION_NAME
    ;;

  "generate")
    if [ -z "$MIGRATION_NAME" ]; then
      echo "❌ Nome da migration é obrigatório para gerar"
      echo "Uso: ./scripts/migration.sh generate NomeDaMigration"
      exit 1
    fi
    echo "🔄 Gerando migration baseada nas mudanças: $MIGRATION_NAME"
    npm run migration:generate -- src/database/migrations/$MIGRATION_NAME
    ;;

  "run")
    echo "▶️ Executando migrations pendentes..."
    npm run migration:run
    ;;

  "revert")
    echo "◀️ Revertendo última migration..."
    npm run migration:revert
    ;;

  "show")
    echo "📋 Mostrando status das migrations..."
    npm run migration:show
    ;;

  "reset")
    echo "⚠️ ATENÇÃO: Isso irá reverter TODAS as migrations!"
    read -p "Tem certeza? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
      echo "🔄 Revertendo todas as migrations..."
      # Continua revertendo até não haver mais migrations
      while npm run migration:revert 2>/dev/null; do
        echo "Migration revertida..."
      done
      echo "✅ Todas as migrations foram revertidas"
    else
      echo "❌ Operação cancelada"
    fi
    ;;

  *)
    echo "📚 Comandos disponíveis:"
    echo "  create [nome]   - Criar nova migration vazia"
    echo "  generate [nome] - Gerar migration baseada nas mudanças"
    echo "  run            - Executar migrations pendentes"
    echo "  revert         - Reverter última migration"
    echo "  show           - Mostrar status das migrations"
    echo "  reset          - Reverter todas as migrations (CUIDADO!)"
    echo ""
    echo "Exemplos:"
    echo "  ./scripts/migration.sh create AddUserAvatarColumn"
    echo "  ./scripts/migration.sh generate AddPostsTable"
    echo "  ./scripts/migration.sh run"
    ;;
esac
