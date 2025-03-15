import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const empId = await this.generateEmpId();

    const isUsernameExist = await this.prisma.user.count({
      where: {
        userName: userDto.username,
      },
    });

    if (isUsernameExist) {
      throw new ConflictException('Username already exists');
    }

    const createUser = await this.prisma.user.create({
      data: {
        empId,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        password: hashedPassword,
        role: userDto.role || Role.EMPLOYEE,
        department: userDto.department,
        userName: userDto.username,
      },
    });

    const { password, ...result } = createUser;
    return result;
  }

  // generate empId like EMP00001
  private generateEmpId = async () => {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { id: 'desc' },
    });
    let nextNum = 1;
    if (lastUser?.empId) {
      const lastNumber = parseInt(lastUser.empId.replace('EMP', ''), 10);
      nextNum = lastNumber + 1;
    }
    return `EMP${String(nextNum).padStart(5, '0')}`;
  };
}
