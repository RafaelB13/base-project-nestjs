import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/database/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);

  try {
    console.log('🌱 Executing database seed...');
    await seedService.runSeed();
    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error executing seed:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
