-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'UPCOMING');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" DEFAULT 'ACTIVE';
