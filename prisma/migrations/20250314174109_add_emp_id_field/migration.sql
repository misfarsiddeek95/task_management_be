/*
  Warnings:

  - A unique constraint covering the columns `[empId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `empId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_empId_key` ON `User`(`empId`);
