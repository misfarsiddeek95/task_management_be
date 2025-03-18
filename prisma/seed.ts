import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const upsert = await prisma.user.upsert({
    where: {
      userName: 'misfar',
    },
    create: {
      firstName: 'Misfar',
      empId: 'EMP00001',
      lastName: 'Siddeek',
      userName: 'misfar',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      department: 'MGT',
      role: 'ADMIN',
    },
    update: {
      firstName: 'Misfar',
      lastName: 'Siddeek',
      userName: 'misfar',
      department: 'MGT',
      role: 'ADMIN',
    },
  });

  const upsert2 = await prisma.user.upsert({
    where: {
      userName: 'david',
    },
    create: {
      empId: 'EMP00002',
      firstName: 'David',
      lastName: 'Bombal',
      userName: 'david',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      department: 'DEV',
      role: 'EMPLOYEE',
    },
    update: {
      firstName: 'David',
      lastName: 'Bombal',
      userName: 'Bombal',
      department: 'DEV',
      role: 'EMPLOYEE',
    },
  });

  const tasks = await prisma.task.createMany({
    data: [
      {
        taskName: 'UI Bug fixes in login page',
        taskDescription: 'Alignment issues',
        taskPriority: 'LOW',
        dueDate: '2025-04-04T00:00:00.000Z',
        isCompleted: false,
        userId: upsert2.id,
      },
      {
        taskName: 'Authentication issue fix in BE',
        taskDescription: 'Login token issue',
        taskPriority: 'HIGH',
        dueDate: '2025-04-04T00:00:00.000Z',
        isCompleted: false,
        userId: upsert2.id,
      },
      {
        taskName: 'Redirect issue after login',
        taskDescription:
          'After successful login user should be redirected to the dashboard',
        taskPriority: 'MEDIUM',
        dueDate: '2025-04-04T00:00:00.000Z',
        isCompleted: false,
        userId: upsert2.id,
      },
    ],
  });

  const allTasks = await prisma.task.findMany({
    where: { isCompleted: false },
  });

  let notifs: any = [];

  for (const tsk of allTasks) {
    const d = {
      userId: tsk.userId,
      taskId: tsk.id,
      message: `New task assigned: ${tsk.taskName}`,
    };
    notifs.push(d);
  }

  const notifications = await prisma.notification.createMany({
    data: notifs,
  });

  console.log('upsert', upsert, upsert2, tasks, notifications);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
