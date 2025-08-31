/*
  Warnings:

  - A unique constraint covering the columns `[userid]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userid` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_userid_key" ON "Activity"("userid");
