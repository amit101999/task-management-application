-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'INPROGRESS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;
