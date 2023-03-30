-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "targetPhrase" TEXT NOT NULL,
    "blank" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);
