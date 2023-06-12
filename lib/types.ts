import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";

interface AppContext {
  prisma: PrismaClient;
  token: JWT | null;
}

type ExerciseLevel = "beginner" | "intermediate" | "advanced";

export type { AppContext, ExerciseLevel };
