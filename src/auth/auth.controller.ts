import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async register(
    @Body()
    registerDto: {
      firstName: string;
      lastName: string;
      username: string;
      password: string;
      role?: 'ADMIN' | 'EMPLOYEE';
      department?: string;
    },
  ) {
    return this.authService.register({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      userName: registerDto.username,
      password: registerDto.password,
      role: registerDto.role,
      department: registerDto.department,
    });
  }
}
