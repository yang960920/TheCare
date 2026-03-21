/** lib/utils.ts — 유틸리티 함수 */

/** ISO 날짜 문자열 → yyyy-MM-dd 형식으로 변환 */
export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return "";
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toISOString().split("T")[0];
}
