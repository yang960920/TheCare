/** AcademyCard.tsx — 아카데미 수강 과정 카드 컴포넌트
 *
 *  용도:
 *  - 아카데미 페이지에서 수강 과정 정보 표시
 *  - 과정명, 기간, 설명 포함
 *  - featured 카드: 골드 그라데이션 테두리 + 크림 배경
 */
"use client";

import { motion } from "framer-motion";

/* ── 컴포넌트 Props 타입 ── */
interface AcademyCardProps {
  title: string;
  duration: string;
  description: string;
  features?: string[];
  index?: number;
  featured?: boolean;
  onApply?: () => void;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative rounded-2xl p-6 md:p-8 hover-lift ${
        featured
          ? "bg-cream border-2 border-gold/40 shadow-lg shadow-gold/10"
          : "bg-white border border-slate-200"
      }`}
    >
      {/* 추천 과정 뱃지 */}
      {featured && (
        <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-gold to-gold-light text-white text-xs font-bold rounded-full shadow-md">
          추천 과정
        </div>
      )}

      {/* ── 과정명 ── */}
      <h3 className="font-display font-bold text-xl md:text-2xl mb-2 text-navy">
        {title}
      </h3>

      {/* ── 과정 설명 ── */}
      <p className="text-sm leading-relaxed mb-5 text-navy/60">
        {description}
      </p>

      {/* ── 기간 정보 ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-gold"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-navy/70">
            {duration}
          </span>
        </div>
      </div>

      {/* ── 커리큘럼 항목 리스트 ── */}
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-navy/60">
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
            ? "bg-gradient-to-r from-gold to-gold-light text-white hover:shadow-lg hover:shadow-gold/25"
            : "bg-navy text-white hover:bg-navy-light"
        }`}
      >
        수강 신청하기
      </button>
    </motion.div>
  );
}
