# Managing Migrations with TypeORM

This guide describes how to create and run database migrations using TypeORM in this project.

## Overview

Migrations are TypeScript files containing SQL queries to alter the database schema in an incremental and versioned way. They are essential for maintaining database consistency across different environments (development, production) and when working in a team.

## File Locations

- **Configuration**: `src/database/data-source.ts`
- **Migration Files**: `src/database/migrations/`

## Available Commands (via `npm run`)

- **`npm run migration:create -- --name=MyNewMigration`**
  - **What it does**: Creates a new migration file in `src/database/migrations/`.
  - **Example**: `npm run migration:create -- --name=AddUserRoles`
  - **Important**: The `--` is necessary to pass the `--name` argument to the underlying TypeORM script.

- **`npm run migration:run`**
  - **What it does**: Runs all pending migrations (those that have not yet been executed).
  - **When to use**: After updating the code (e.g., `git pull`) or after creating a new migration.

- **`npm run migration:revert`**
  - **What it does**: Reverts the last executed migration.
  - **Caution**: Use with caution, as it can lead to data loss.

- **`npm run migration:show`**
  - **What it does**: Shows the status of all migrations (executed and pending).

## Structure of a Migration File

Each migration file exports a class that implements `MigrationInterface`.

- **`up(queryRunner: QueryRunner): Promise<void>`**
  - Contains the logic to apply the migration (e.g., `CREATE TABLE`, `ALTER TABLE`).

- **`down(queryRunner: QueryRunner): Promise<void>`**
  - Contains the logic to revert the migration (e.g., `DROP TABLE`, reverting changes).

## Migration Example

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoles1625304988345 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "roles" text[] NOT NULL DEFAULT ARRAY['user']::text[]`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "roles"`
        );
    }
}
```

## Recommended Workflow

1.  Make the necessary changes to your entities (e.g., add a new column in `src/users/entities/user.entity.ts`).
2.  Create a new migration: `npm run migration:create -- --name=AddAvatarUrlToUsers`.
3.  Edit the generated file in `src/database/migrations/` and add the SQL queries in the `up` and `down` methods.
4.  Run the migration: `npm run migration:run`.
5.  Check the status: `npm run migration:show`.
6.  Commit both the entity change and the new migration file.

## Best Practices

- **Never edit an already executed migration**: If you need to change something, create a new migration.
- **Keep migrations small and focused**: Each migration should make a single logical change.
- **Always implement the `down` method**: This ensures you can safely revert changes.