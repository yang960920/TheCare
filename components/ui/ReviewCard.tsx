/** ReviewCard.tsx — 고객 후기 카드 컴포넌트
 *
 *  용도:
 *  - 홈페이지 후기 미리보기 및 후기 페이지 그리드에서 사용
 *  - 별점 + 고객명 + 시공 종류 + 후기 텍스트 표시
 *  - 스크롤 진입 시 FadeIn 애니메이션
 */
"use client";

import { motion } from "framer-motion";

/* ── 컴포넌트 Props 타입 ── */
interface ReviewCardProps {
  name: string;         // 고객 이름
  rating: number;       // 별점 (1~5)
  serviceType: string;  // 시공 종류
  content: string;      // 후기 내용
  index?: number;       // 애니메이션 딜레이용 인덱스
}

export default function ReviewCard({ name, rating, serviceType, content, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      /* 스크롤 진입 시 FadeIn + SlideUp 애니메이션 */
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 md:p-7 border border-slate-light/50 hover-lift"
    >
      {/* ── 헤더: 별점 + 시공 종류 라벨 ── */}
      <div className="flex items-center justify-between mb-4">
        {/* 별점 표시 (채워진 별 / 빈 별) */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? "text-amber-400" : "text-slate-light"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {/* 시공 종류 뱃지 */}
        <span className="text-xs font-medium text-cyan bg-cyan/10 px-2.5 py-1 rounded-full">
          {serviceType}
        </span>
      </div>

      {/* ── 후기 내용 ── */}
      <p className="text-navy/70 text-sm leading-relaxed mb-4">
        &quot;{content}&quot;
      </p>

      {/* ── 고객 이름 ── */}
      <div className="flex items-center gap-2">
        {/* 이름 첫 글자 아바타 */}
        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
          <span className="text-xs font-bold text-navy">{name.charAt(0)}</span>
        </div>
        <span className="text-sm font-medium text-navy">{name}</span>
      </div>
    </motion.div>
  );
}
