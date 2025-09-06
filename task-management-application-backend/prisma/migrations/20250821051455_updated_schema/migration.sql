/*
  Warnings:

  - You are about to drop the column `completed_task` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startdate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `task_status` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `Department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastLogin` on the `User` table. All the data in the column will be lost.
  - Added the required column `projectName` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "completed_task",
DROP COLUMN "end_date",
DROP COLUMN "project_name",
DROP COLUMN "start_date",
ADD COLUMN     "completedTask" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "projectName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "startdate",
DROP COLUMN "task_status",
ADD COLUMN     "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "taskStatus" "Status" DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Department",
DROP COLUMN "LastLogin",
ADD COLUMN     "department" TEXT DEFAULT 'DEVELOPER',
ADD COLUMN     "lastLogin" TIMESTAMP(3);
