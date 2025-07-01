import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// Configuração específica para desenvolvimento
export const DevDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'devuser',
  password: process.env.DB_PASSWORD || 'devpass',
  database: process.env.DB_NAME || 'upload_s3_dev',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  logging: true,
  synchronize: false,
});

// Configuração específica para produção
export const ProdDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Export default baseado no ambiente
export default process.env.NODE_ENV === 'production'
  ? ProdDataSource
  : DevDataSource;
