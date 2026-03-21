/** AcademyCard.tsx — 아카데미 수강 과정 카드 컴포넌트
 *
 *  용도:
 *  - 아카데미 페이지에서 수강 과정 정보 표시
 *  - 과정명, 기간, 수강료, 설명 포함
 *  - 호버 시 떠오르는 애니메이션
 */
"use client";

import { motion } from "framer-motion";

/* ── 컴포넌트 Props 타입 ── */
interface AcademyCardProps {
  title: string;        // 과정명
  duration: string;     // 교육 기간

  description: string;  // 과정 설명
  features?: string[];   // 주요 커리큘럼 항목들 (optional)
  index?: number;       // 애니메이션 딜레이
  featured?: boolean;   // 추천 과정 여부 (강조 표시)
  onApply?: () => void; // 수강 신청 클릭 콜백
}

export default function AcademyCard({
  title,
  duration,
  description,
  features,
  index = 0,
  featured = false,
  onApply,
}: AcademyCardProps) {
  return (
    <motion.div
      /* 스크롤 진입 시 FadeIn + SlideUp 애니메이션 */
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative rounded-2xl p-6 md:p-8 hover-lift ${
        featured
          ? "bg-navy text-white border-2 border-cyan/30"   // 추천 과정: 네이비 배경
          : "bg-white border border-slate-light/50"          // 일반 과정: 흰 배경
      }`}
    >
      {/* 추천 과정 뱃지 */}
      {featured && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-cyan to-cyan-dark text-white text-xs font-bold rounded-full">
          추천 과정
        </div>
      )}

      {/* ── 과정명 ── */}
      <h3
        className={`font-display font-bold text-xl md:text-2xl mb-2 ${
          featured ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h3>

      {/* ── 과정 설명 ── */}
      <p
        className={`text-sm leading-relaxed mb-5 ${
          featured ? "text-white/70" : "text-navy/60"
        }`}
      >
        {description}
      </p>

      {/* ── 기간 + 수강료 정보 ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <svg
            className={`w-4 h-4 ${featured ? "text-cyan-light" : "text-cyan"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-sm font-medium ${featured ? "text-white/80" : "text-navy/70"}`}>
            {duration}
          </span>
        </div>
      </div>

      {/* ── 커리큘럼 항목 리스트 ── */}
      {features && features.length > 0 && (
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            {/* 체크 아이콘 */}
            <svg
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                featured ? "text-cyan-light" : "text-cyan"
              }`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span
              className={`text-sm ${
                featured ? "text-white/70" : "text-navy/60"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      )}

      {/* ── 수강 신청 버튼 ── */}
      <button
        onClick={onApply}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          featured
            ? "bg-gradient-to-r from-cyan to-cyan-dark text-white hover:shadow-lg hover:shadow-cyan/25"
            : "bg-navy text-white hover:bg-navy-light"
        }`}
      >
        수강 신청하기
      </button>
    </motion.div>
  );
}
