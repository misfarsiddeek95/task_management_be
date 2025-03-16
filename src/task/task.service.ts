import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!checkUser) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.task.create({
      data: {
        userId: data.userId,
        taskName: data.taskName,
        taskDescription: data.taskDesc,
        taskPriority: data.priority,
        dueDate: new Date(data.dueDate),
      },
    });
  }

  async completeTask(data: UpdateTaskDto) {
    const checkTaskExist = await this.prisma.task.findUnique({
      where: { id: data.id },
    });

    if (!checkTaskExist)
      throw new NotFoundException('Task not found for given Task Id');

    return await this.prisma.task.update({
      where: { id: data.id },
      data: {
        isCompleted: data.isCompleted,
      },
    });
  }
}
