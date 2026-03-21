/** lib/prisma.ts — Prisma Client 싱글턴
 *
 *  Next.js 개발 서버의 hot reload 시
 *  매번 새로운 Prisma Client 인스턴스가 생기는 것을 방지합니다.
 *
 *  NOTE: DATABASE_URL은 prisma.config.ts에서 자동 로드됩니다.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
