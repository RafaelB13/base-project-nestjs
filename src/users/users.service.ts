import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Usar salt rounds mais alto para maior segurança
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async getTotalUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  async getAdminUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      where: { role: UserRole.ADMIN },
      select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
