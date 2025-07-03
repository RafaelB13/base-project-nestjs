import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async getProfile(userId: number): Promise<Omit<User, 'password'> | null> {
    return this.usersService.findById(userId);
  }

  async generateTwoFactorAuthenticationSecret(userId: number) {
    const secret = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.setTwoFactorAuthenticationSecret(userId, secret);
    return secret;
  }

  async sendTwoFactorAuthenticationCode(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const code = await this.generateTwoFactorAuthenticationSecret(user.id);
    await this.emailService.sendMail(
      user.email,
      'Seu código de autenticação de dois fatores',
      `Seu código de autenticação é: ${code}`,
    );
  }

  async turnOnTwoFactorAuthentication(userId: number, code: string) {
    const user = await this.usersService.findUserWithSecretsById(userId);
    if (!user || user.twoFactorAuthenticationSecret !== code) {
      throw new UnauthorizedException('Código de autenticação inválido');
    }
    await this.usersService.setTwoFactorAuthenticationEnabled(userId, true);
    await this.usersService.setTwoFactorAuthenticationSecret(userId, null);
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    await this.usersService.setTwoFactorAuthenticationEnabled(userId, false);
  }
}
