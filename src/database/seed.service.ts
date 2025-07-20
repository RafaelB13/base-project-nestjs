import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seedAdmin(): Promise<void> {
    try {
      // Verificar se já existe um admin
      const existingAdmin = await this.usersRepository.findOne({
        where: { email: 'admin@sistema.com' },
      });

      if (existingAdmin) {
        this.logger.log('Admin user already exists');
        return;
      }

      // Criar usuário admin com senha mais segura
      const adminPassword = 'Admin@2025!';
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      const adminUser = this.usersRepository.create({
        email: 'admin@sistema.com',
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.usersRepository.save(adminUser);

      this.logger.log('✅ Admin user created successfully');
      this.logger.log('📧 Email: admin@sistema.com');
      this.logger.log('🔐 Password: Admin@2025!');
      this.logger.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    } catch (error) {
      this.logger.error('❌ Error creating admin user:', error);
    }
  }

  async runSeed(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');
    await this.seedAdmin();
    this.logger.log('✅ Database seeding completed');
  }
}
