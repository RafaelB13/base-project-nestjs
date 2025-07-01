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

  async seedUsers(): Promise<void> {
    try {
      // Criar alguns usuários de exemplo
      const testUsers = [
        {
          email: 'user1@exemplo.com',
          username: 'usuario1',
          password: 'User123!',
          role: UserRole.USER,
        },
        {
          email: 'user2@exemplo.com',
          username: 'usuario2',
          password: 'User123!',
          role: UserRole.USER,
        },
      ];

      for (const userData of testUsers) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: userData.email },
        });

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(userData.password, 12);
          const user = this.usersRepository.create({
            email: userData.email,
            username: userData.username,
            password: hashedPassword,
            role: userData.role,
          });

          await this.usersRepository.save(user);
          this.logger.log(`✅ User ${userData.username} created successfully`);
        }
      }
    } catch (error) {
      this.logger.error('❌ Error seeding users:', error);
    }
  }

  async runSeed(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');
    await this.seedAdmin();
    await this.seedUsers();
    this.logger.log('✅ Database seeding completed');
  }
}
