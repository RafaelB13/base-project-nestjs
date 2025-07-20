#!/bin/bash

# Script to manage migrations
# Usage: ./scripts/migration.sh [command] [migration_name]

set -e

COMMAND=$1
MIGRATION_NAME=$2

case $COMMAND in
  "create")
    if [ -z "$MIGRATION_NAME" ]; then
      echo "❌ Migration name is required to create"
      echo "Usage: ./scripts/migration.sh create MigrationName"
      exit 1
    fi
    echo "🚀 Creating new migration: $MIGRATION_NAME"
    npm run migration:create -- src/database/migrations/$MIGRATION_NAME
    ;;

  "generate")
    if [ -z "$MIGRATION_NAME" ]; then
      echo "❌ Migration name is required to generate"
      echo "Usage: ./scripts/migration.sh generate MigrationName"
      exit 1
    fi
    echo "🔄 Generating migration based on changes: $MIGRATION_NAME"
    npm run migration:generate -- src/database/migrations/$MIGRATION_NAME
    ;;

  "run")
    echo "▶️ Executing pending migrations..."
    npm run migration:run
    ;;

  "revert")
    echo "◀️ Reverting last migration..."
    npm run migration:revert
    ;;

  "show")
    echo "📋 Showing migration status..."
    npm run migration:show
    ;;

  "reset")
    echo "⚠️ WARNING: This will revert ALL migrations!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "🔄 Reverting all migrations..."
      # Continua revertendo até não haver mais migrations
      while npm run migration:revert 2>/dev/null; do
        echo "Migration reverted..."
      done
      echo "✅ All migrations have been reverted"
    else
      echo "❌ Operation cancelled"
    fi
    ;;

  *)
    echo "📚 Available commands:"
    echo "  create [name]   - Create new empty migration"
    echo "  generate [name] - Generate migration based on changes"
    echo "  run            - Execute pending migrations"
    echo "  revert         - Revert last migration"
    echo "  show           - Show migration status"
    echo "  reset          - Revert all migrations (CAUTION!)"
    echo ""
    echo "Examples:"
    echo "  ./scripts/migration.sh create AddUserAvatarColumn"
    echo "  ./scripts/migration.sh generate AddPostsTable"
    echo "  ./scripts/migration.sh run"
    ;;
esac
