/** lib/apiHelpers.ts — API 유틸리티 */

/** Prisma update 시 읽기 전용 필드 제거 */
export function stripReadOnlyFields<T extends Record<string, unknown>>(
  data: T
): Omit<T, "id" | "createdAt" | "updatedAt"> {
  const { id, createdAt, updatedAt, ...rest } = data;
  return rest as Omit<T, "id" | "createdAt" | "updatedAt">;
}
