/*
  Warnings:

  - You are about to drop the column `exerciseLevel` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `difficultyLevel` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "exerciseLevel",
ADD COLUMN     "difficultyLevel" TEXT NOT NULL;
