import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationDto, UpdateTaskDto } from './dto/update-task.dto';
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

    const task = await this.prisma.task.create({
      data: {
        userId: data.userId,
        taskName: data.taskName,
        taskDescription: data.taskDesc,
        taskPriority: data.priority,
        dueDate: new Date(data.dueDate),
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: task.userId,
        taskId: task.id,
        message: `New task assigned: ${task.taskName}`,
      },
    });

    return task;
  }

  async completeTask(data: UpdateTaskDto) {
    const checkTaskExist = await this.prisma.task.findUnique({
      where: { id: data.id },
    });

    if (!checkTaskExist)
      throw new NotFoundException('Task not found for given Task Id');

    const task = await this.prisma.task.update({
      where: { id: data.id },
      data: {
        isCompleted: data.isCompleted,
      },
    });

    if (data.isCompleted) {
      // Get all admins
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' }, // Fetch all users with ADMIN role
      });

      let completedTasks: any = [];

      for (const admin of admins) {
        const d = {
          userId: admin.id,
          taskId: task.id,
          message: `Task completed: ${task.taskName}`,
        };
        completedTasks.push(d);
      }

      // Send notification
      await this.prisma.notification.createMany({
        data: completedTasks,
      });
    }

    return task;
  }

  async loadTasks(user) {
    return this.prisma.task
      .findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          isCompleted: 'asc',
        },
      })
      .then((tasks) =>
        tasks.map((task) => ({
          ...task,
          priority_color: this.getPriorityColor(task.taskPriority),
        })),
      );
  }

  private getPriorityColor(priority: string): string {
    const priorityMap = {
      HIGH: 'danger',
      LOW: 'primary',
      MEDIUM: 'warning',
    };
    return priorityMap[priority] || 'warning';
  }

  async getUserNotifications(user) {
    return await this.prisma.notification.findMany({
      where: { userId: user.id, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(data: NotificationDto) {
    return await this.prisma.notification.update({
      where: { id: data.notificationId },
      data: { isRead: true },
    });
  }
}
