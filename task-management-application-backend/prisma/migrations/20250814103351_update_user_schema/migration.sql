-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Department" TEXT DEFAULT 'DEVELOPER',
ADD COLUMN     "LastLogin" TIMESTAMP(3),
ADD COLUMN     "phone" INTEGER;
