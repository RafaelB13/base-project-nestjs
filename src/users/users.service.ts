import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      name: createUserDto.name,
      role: UserRole.USER,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserWithSecretsByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'username',
        'role',
        'name',
        'createdAt',
        'updatedAt',
        'isTwoFactorAuthenticationEnabled',
      ],
    });
  }

  async findUserWithSecretsById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      select: [
        'id',
        'email',
        'username',
        'name',
        'role',
        'createdAt',
        'updatedAt',
        'isTwoFactorAuthenticationEnabled',
      ],
    });
    return users;
  }

  async getTotalUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  async getAdminUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      where: { role: UserRole.ADMIN },
      select: [
        'id',
        'email',
        'username',
        'name',
        'role',
        'createdAt',
        'updatedAt',
        'isTwoFactorAuthenticationEnabled',
      ],
    });
    return users;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    this.usersRepository.merge(user, dto);
    const updatedUser = await this.usersRepository.save(user);

    const { password, ...result } = updatedUser;
    return result;
  }

  async setTwoFactorAuthenticationSecret(
    userId: string,
    secret: string | null,
  ) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async setTwoFactorAuthenticationEnabled(userId: string, enabled: boolean) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: enabled,
    });
  }

  async setTwoFactorAuthenticationToken(userId: string, token: string | null) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationToken: token,
    });
  }

  async findByTwoFactorAuthenticationToken(
    token: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { twoFactorAuthenticationToken: token },
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
