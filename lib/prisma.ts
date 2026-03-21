/** lib/prisma.ts — Prisma Client 싱글턴 (Prisma 7 + pg adapter)
 *
 *  Prisma 7에서는 driver adapter가 필수입니다.
 *  @prisma/adapter-pg + pg 패키지를 사용합니다.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
