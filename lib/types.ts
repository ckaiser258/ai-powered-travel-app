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
    isNewUser: boolean | unknown; // Adding unknown here because isNewUser on the Token type is unknown, so this prevents them from clashing.
  }
}

export type { AppContext, ExerciseLevel };
