import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Roles('ADMIN')
  async register(
    @Body()
    registerDto: CreateUserDto,
  ) {
    return this.userService.register(registerDto);
  }
}
