import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { TwoFactorLoginDto } from './dto/two-factor-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  LoginResponse,
  RegisterResponse,
  RequestUser,
} from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: Omit<User, 'password'> }): Promise<
    | LoginResponse
    | {
        message: string;
        isTwoFactorAuthenticationEnabled: boolean;
        email: string;
      }
  > {
    const user = req.user;

    if (user.isTwoFactorAuthenticationEnabled) {
      await this.authService.sendTwoFactorAuthenticationCode(user.id);
      return {
        message: 'Two-factor authentication required',
        isTwoFactorAuthenticationEnabled: true,
        email: user.email,
      };
    }

    return this.authService.login(req.user);
  }

  @Post('login/2fa')
  @HttpCode(HttpStatus.OK)
  async loginWith2fa(
    @Body(ValidationPipe) twoFactorLoginDto: TwoFactorLoginDto,
  ): Promise<LoginResponse> {
    return this.authService.loginWith2fa(twoFactorLoginDto);
  }

  @Post('register')
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<RegisterResponse> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: RequestUser }): RequestUser {
    return req.user;
  }

  @Post('2fa/enable/request')
  @UseGuards(JwtAuthGuard)
  async requestEnableTwoFactorAuthentication(
    @Request() req: { user: RequestUser },
  ) {
    await this.authService.sendTwoFactorAuthenticationEnableEmail(
      req.user.userId,
    );
    return {
      message:
        'A confirmation email has been sent to enable two-factor authentication.',
    };
  }

  @Get('2fa/enable')
  async enableTwoFactorAuthentication(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    await this.authService.enableTwoFactorAuthentication(token);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    res.redirect(frontendUrl!);
  }

  @Post('2fa/turn-off')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Request() req: { user: RequestUser }) {
    return this.authService.turnOffTwoFactorAuthentication(req.user.userId);
  }
}
