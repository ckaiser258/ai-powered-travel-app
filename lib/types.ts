import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";

interface AppContext {
  prisma: PrismaClient;
  token: JWT | null;
}

export type { AppContext };
