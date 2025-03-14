/*
  Warnings:

  - You are about to drop the column `empId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emp_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_empId_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `empId`,
    ADD COLUMN `emp_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_emp_id_key` ON `User`(`emp_id`);
