/** StatusBadge.tsx — 상태 뱃지 컴포넌트
 *
 *  용도: 견적 문의 처리 상태 등을 색상별로 구분 표시
 *  - 미확인: 노란색
 *  - 확인: 파란색
 *  - 완료: 초록색
 */
"use client";

/* ── 상태별 스타일 매핑 ── */
const VARIANTS: Record<string, string> = {
  미확인: "bg-amber-50 text-amber-700 border-amber-200",
  확인: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-emerald-50 text-emerald-700 border-emerald-200",
  활성: "bg-emerald-50 text-emerald-700 border-emerald-200",
  비활성: "bg-slate-50 text-slate-500 border-slate-200",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = VARIANTS[status] || VARIANTS["미확인"];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
}
