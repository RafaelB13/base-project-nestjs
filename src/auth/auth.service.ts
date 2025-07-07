import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TwoFactorLoginDto } from './dto/two-factor-login.dto';
import {
  JwtPayload,
  LoginResponse,
  RegisterResponse,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>): LoginResponse {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
      },
    };
  }

  async loginWith2fa(
    twoFactorLoginDto: TwoFactorLoginDto,
  ): Promise<LoginResponse> {
    const { email, code } = twoFactorLoginDto;
    const user = await this.usersService.findUserWithSecretsByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.twoFactorAuthenticationSecret !== code) {
      throw new UnauthorizedException('Invalid two-factor authentication code');
    }

    await this.usersService.setTwoFactorAuthenticationSecret(user.id, null);

    const { password, ...userResult } = user;
    return this.login(userResult);
  }

  async register(createUserDto: CreateUserDto): Promise<RegisterResponse> {
    // Verificar se o usuário já existe
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Criar o usuário
    const user = await this.usersService.create(createUserDto);

    const { password, ...result } = user;

    // Retornar token de acesso
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'> | null> {
    return this.usersService.findById(userId);
  }

  async sendTwoFactorAuthenticationCode(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.setTwoFactorAuthenticationSecret(user.id, code);
    await this.emailService.sendTwoFactorAuthEmail(
      user.email,
      user.name || 'User',
      code,
    );
  }

  async sendTwoFactorAuthenticationEnableEmail(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = randomBytes(32).toString('hex');
    await this.usersService.setTwoFactorAuthenticationToken(user.id, token);

    await this.emailService.sendTwoFactorEnableEmail(
      user.email,
      user.name || 'User',
      token,
    );
  }

  async enableTwoFactorAuthentication(token: string): Promise<LoginResponse> {
    const user =
      await this.usersService.findByTwoFactorAuthenticationToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.usersService.setTwoFactorAuthenticationEnabled(user.id, true);
    await this.usersService.setTwoFactorAuthenticationToken(user.id, null);

    const { password, ...userResult } = user;
    return this.login(userResult);
  }

  async turnOffTwoFactorAuthentication(userId: string) {
    await this.usersService.setTwoFactorAuthenticationEnabled(userId, false);
  }
}
