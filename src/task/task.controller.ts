import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Get,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { Request } from 'express';

@Controller('task')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create-task')
  createTask(@Body() tasks: CreateTaskDto) {
    return this.taskService.createTask(tasks);
  }

  @Patch('complete-task')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  completeTask(@Body() data: UpdateTaskDto) {
    return this.taskService.completeTask(data);
  }

  @Get('load-tasks')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  loadTasks(@Req() request: Request) {
    return this.taskService.loadTasks(request.user);
  }
}
