import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { userName: username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.userName, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role?: 'ADMIN' | 'EMPLOYEE';
    department?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const empId = await this.generateEmpId();

    const upsertUser = await this.prisma.user.upsert({
      where: {
        userName: userDto.userName,
      },
      update: {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        password: hashedPassword,
        role: userDto.role || 'EMPLOYEE',
        department: userDto.department,
      },
      create: {
        empId,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        userName: userDto.userName,
        password: hashedPassword,
        role: userDto.role || 'EMPLOYEE',
        department: userDto.department,
      },
    });

    const { password, ...result } = upsertUser;
    return result;
  }

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
