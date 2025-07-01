import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'devuser',
  password: process.env.DB_PASSWORD || 'devpass',
  database: process.env.DB_NAME || 'upload_s3_dev',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV === 'development',
  synchronize: false, // Nunca usar true em produção
});
