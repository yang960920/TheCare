/** ServiceCard.tsx — 서비스 카드 컴포넌트
 *
 *  용도:
 *  - 홈페이지 서비스 요약 및 회사소개 상세 카드에서 사용
 *  - 아이콘 + 제목 + 설명 구성
 *  - 호버 시 살짝 떠오르는 애니메이션 적용
 */
"use client";

import { motion } from "framer-motion";

/* ── 컴포넌트 Props 타입 정의 ── */
interface ServiceCardProps {
  icon: React.ReactNode;    // 서비스 아이콘 (SVG)
  title: string;            // 서비스명
  description: string;      // 서비스 설명
  index?: number;           // 애니메이션 딜레이용 인덱스
}

export default function ServiceCard({ icon, title, description, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      /* 스크롤 진입 시 FadeIn + SlideUp 애니메이션 */
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl p-6 md:p-8 border border-slate-light/50 hover-lift cursor-default"
    >
      {/* 아이콘 영역 */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan/10 to-cyan/5 flex items-center justify-center mb-5 group-hover:from-cyan/20 group-hover:to-cyan/10 transition-colors">
        <div className="text-cyan w-6 h-6 md:w-7 md:h-7">
          {icon}
        </div>
      </div>

      {/* 서비스명 */}
      <h3 className="font-display font-bold text-lg md:text-xl text-navy mb-3">
        {title}
      </h3>

      {/* 서비스 설명 */}
      <p className="text-navy/60 text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
