import { PrismaClient } from "../generated/prisma";

const env = process.env
const createPrismaClient = () => {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalPrismaClient = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalPrismaClient.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalPrismaClient.prisma = db;