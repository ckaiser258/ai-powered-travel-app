/*
  Warnings:

  - The values [inermediate] on the enum `DifficultyLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DifficultyLevel_new" AS ENUM ('beginner', 'intermediate', 'advanced');
ALTER TABLE "Exercise" ALTER COLUMN "difficultyLevel" TYPE "DifficultyLevel_new" USING ("difficultyLevel"::text::"DifficultyLevel_new");
ALTER TYPE "DifficultyLevel" RENAME TO "DifficultyLevel_old";
ALTER TYPE "DifficultyLevel_new" RENAME TO "DifficultyLevel";
DROP TYPE "DifficultyLevel_old";
COMMIT;
