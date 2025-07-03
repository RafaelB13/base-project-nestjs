import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-auth.dto';
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
  constructor(private authService: AuthService) {}

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

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generateTwoFactorAuthentication(@Request() req: { user: RequestUser }) {
    return this.authService.sendTwoFactorAuthenticationCode(req.user.userId);
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Request() req: { user: RequestUser },
    @Body() { code }: TwoFactorAuthenticationCodeDto,
  ) {
    return this.authService.turnOnTwoFactorAuthentication(
      req.user.userId,
      code,
    );
  }

  @Post('2fa/turn-off')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Request() req: { user: RequestUser }) {
    return this.authService.turnOffTwoFactorAuthentication(req.user.userId);
  }
}
