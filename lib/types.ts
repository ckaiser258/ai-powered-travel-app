import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";

interface AppContext {
  prisma: PrismaClient;
  token: JWT | null;
}

type ExerciseLevel = "beginner" | "intermediate" | "advanced";

declare module "next-auth" {
  interface Session {
    userId: string;
    isNewUser: boolean;
  }
}

export type { AppContext, ExerciseLevel };
