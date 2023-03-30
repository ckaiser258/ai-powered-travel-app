/*
  Warnings:

  - Changed the type of `difficultyLevel` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('beginner', 'inermediate', 'advanced');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "difficultyLevel",
ADD COLUMN     "difficultyLevel" "DifficultyLevel" NOT NULL;
