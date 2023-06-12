/*
  Warnings:

  - You are about to drop the `Completion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "languagesToLearn" TEXT[];

-- DropTable
DROP TABLE "Completion";

-- DropTable
DROP TABLE "Exercise";

-- DropEnum
DROP TYPE "DifficultyLevel";
