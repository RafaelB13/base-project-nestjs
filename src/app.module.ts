import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SeedService } from './database/seed.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'devuser',
      password: process.env.DB_PASSWORD || 'devpass',
      database: process.env.DB_NAME || 'upload_s3_dev',
      entities: [User],
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: process.env.NODE_ENV === 'production',
      synchronize: false, // Desabilitado para usar migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    // Executar seed apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      await this.seedService.runSeed();
    }
  }
}
