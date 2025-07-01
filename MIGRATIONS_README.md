# Migrations - Guia Completo

## Visão Geral

Este projeto utiliza o sistema de migrations do TypeORM para gerenciar mudanças no schema do banco de dados de forma controlada e versionada.

## Configuração

### Arquivos Importantes

- `src/database/data-source.ts` - Configuração principal do DataSource
- `src/database/config.ts` - Configurações separadas para dev/prod
- `src/database/migrations/` - Pasta com todas as migrations
- `scripts/migration.sh` - Script helper para gerenciar migrations

### Scripts Disponíveis

```bash
# Criar nova migration vazia
npm run migration:create -- src/database/migrations/NomeDaMigration

# Gerar migration baseada nas mudanças das entities
npm run migration:generate -- src/database/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert

# Mostrar status das migrations
npm run migration:show
```

## Usando o Script Helper

O script `scripts/migration.sh` facilita o uso das migrations:

```bash
# Criar nova migration
./scripts/migration.sh create AddUserAvatarColumn

# Gerar migration automaticamente
./scripts/migration.sh generate AddPostsTable

# Executar migrations
./scripts/migration.sh run

# Reverter última migration
./scripts/migration.sh revert

# Ver status
./scripts/migration.sh show

# Resetar todas (CUIDADO!)
./scripts/migration.sh reset
```

## Fluxo de Trabalho

### 1. Desenvolvimento Local

1. **Faça mudanças nas entities**
   ```typescript
   // Exemplo: adicionar nova coluna na User entity
   @Column({ nullable: true })
   avatar?: string;
   ```

2. **Gere a migration**
   ```bash
   ./scripts/migration.sh generate AddUserAvatar
   ```

3. **Revise e ajuste a migration gerada**
   - Verifique se o código está correto
   - Adicione dados de seed se necessário
   - Teste o `up` e `down`

4. **Execute a migration**
   ```bash
   ./scripts/migration.sh run
   ```

### 2. Deploy para Produção

1. **No ambiente de produção, as migrations são executadas automaticamente**
   - Configurado via `migrationsRun: true` no `app.module.ts`

2. **Ou execute manualmente**
   ```bash
   NODE_ENV=production npm run migration:run
   ```

## Boas Práticas

### ✅ Faça

- **Sempre revisar migrations geradas** antes de executar
- **Testar o rollback** (`down`) de cada migration
- **Usar nomes descritivos** para migrations
- **Fazer backup** do banco antes de migrations importantes
- **Executar migrations em ambiente de teste** primeiro

### ❌ Não Faça

- **Nunca editar migrations já executadas** em produção
- **Nunca usar `synchronize: true`** em produção
- **Não fazer mudanças destrutivas** sem backup
- **Não pular etapas** de teste

## Exemplos de Migrations

### 1. Adicionando Nova Coluna

```typescript
export class AddUserAvatar1704114900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
```

### 2. Criando Nova Tabela

```typescript
export class CreatePostsTable1704115000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Adicionar foreign key
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}
```

### 3. Modificando Coluna Existente

```typescript
export class ModifyUserEmailColumn1704115100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        length: '320', // RFC 5321 max length
        isUnique: true,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
        isNullable: false,
      }),
    );
  }
}
```

## Troubleshooting

### Erro: "Migration already exists"
```bash
# Verifique quais migrations já foram executadas
./scripts/migration.sh show

# Se necessário, reverta e tente novamente
./scripts/migration.sh revert
```

### Erro: "Table already exists"
```bash
# Verifique se a migration não foi executada manualmente
# Marque a migration como executada sem rodar o código
npm run migration:run -- --fake
```

### Rollback de Emergency
```bash
# Para reverter múltiplas migrations rapidamente
./scripts/migration.sh reset
```

## Monitoramento

Use o `MigrationService` para monitorar migrations programaticamente:

```typescript
// Verificar se há migrations pendentes
const hasPending = await migrationService.hasPendingMigrations();

// Executar migrations programaticamente
await migrationService.runMigrations();
```

## Variáveis de Ambiente

```env
# Configurações de banco
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=devuser
DB_PASSWORD=devpass
DB_NAME=upload_s3_dev

# Para produção
NODE_ENV=production
DB_SSL=true
```
