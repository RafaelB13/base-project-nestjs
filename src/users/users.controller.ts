import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestUser } from '../auth/interfaces/auth.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: RequestUser }) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/stats')
  async getStats() {
    const totalUsers = await this.usersService.getTotalUsers();
    const adminUsers = await this.usersService.getAdminUsers();

    return {
      totalUsers,
      adminUsers: adminUsers.length,
      regularUsers: totalUsers - adminUsers.length,
    };
  }
}
