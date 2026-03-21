/** app/about/page.tsx — 회사소개 페이지 (API 연동)
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 회사소개 타이틀
 *  2. 회사 소개 텍스트 + 이미지
 *  3. 핵심 수치 통계 (DB에서 로드)
 *  4. 서비스 상세 카드 (DB에서 로드)
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ServiceCard from "@/components/ui/ServiceCard";

/* ── 서비스명 → 아이콘 매핑 ── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "줄눈 시공": (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  "입주 청소": (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "탄성 코트": (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  "나노 코팅": (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "새집증후군 제거": (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

/* ── 기본 아이콘 (매핑에 없는 서비스용) ── */
const DEFAULT_ICON = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/* ── 타입 ── */
interface ServiceData { id: string; name: string; summary: string; description: string; visible: boolean; order: number; }
interface Stat { value: string; label: string; }

/* ── 폴백 통계 ── */
const FALLBACK_STATS: Stat[] = [
  { value: "3년+", label: "업계 경력" },
  { value: "15,000+", label: "시공 완료" },
  { value: "98%", label: "고객 만족도" },
];

export default function AboutPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then((data: ServiceData[]) => setServices(data.filter(s => s.visible).sort((a, b) => a.order - b.order)))
      .catch(() => {});
    fetch("/api/company")
      .then(r => r.json())
      .then(data => { if (data.stats) setStats(data.stats); })
      .catch(() => {});
  }, []);

  const displayStats = stats.length > 0 ? stats : FALLBACK_STATS;

  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로 — 회사소개 타이틀 배너
       * ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        {/* 배경 데코 원형 */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan/3 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
              About Us
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              회사소개
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              3년간 쌓아 온 신뢰와 기술력으로 최상의 청소 서비스를 제공합니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  회사 소개 텍스트 + 이미지 레이아웃
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 좌측: 텍스트 영역 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
                Our Story
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-navy mt-3 mb-6">
                깨끗한 공간을 만드는
                <br />
                진정한 전문가
              </h2>
              <div className="space-y-4 text-navy/60 text-base leading-relaxed">
                <p>
                  더케어는 2022년 설립 이래 &ldquo;깨끗한 공간, 건강한 생활&rdquo;이라는
                  비전 아래 꾸준히 성장해 온 청소 전문 기업입니다.
                </p>
                <p>
                  200명 이상의 전문 기술 인력과 최신 장비를 보유하고 있으며,
                  줄눈 시공, 입주 청소, 탄성 코트, 나노 코팅, 새집증후군 제거 등
                  다양한 분야에서 업계 최고의 서비스를 제공하고 있습니다.
                </p>
                <p>
                  고객 만족을 최우선 가치로 삼아 기존 시공의 98% 이상에서
                  높은 만족도를 기록하고 있으며, 지속적인 기술 개발과
                  인력 교육으로 서비스 품질을 끊임없이 향상시키고 있습니다.
                </p>
              </div>
            </motion.div>

            {/* 우측: 이미지 영역 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="더케어 전문 청소 작업 현장"
                  width={800}
                  height={600}
                  className="w-full h-80 md:h-96 object-cover"
                />
              </div>
              {/* 데코레이션 박스 */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy/5 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  핵심 수치 통계 (DB에서 로드)
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center bg-white rounded-2xl p-8 border border-slate-light/50"
              >
                {/* 핵심 수치 */}
                <div className="font-display font-black text-4xl md:text-5xl text-cyan mb-3">
                  {stat.value}
                </div>
                {/* 수치 라벨 */}
                <div className="font-display font-bold text-lg text-navy mb-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  서비스 상세 카드 (DB에서 로드)
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 섹션 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
              Services Detail
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mt-3 mb-4">
              서비스 상세 안내
            </h2>
            <p className="text-navy/60 text-base max-w-2xl mx-auto">
              각 서비스에 대한 자세한 정보를 확인해 보세요
            </p>
          </motion.div>

          {/* 서비스 카드 그리드 — DB에서 로드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, index) => (
              <ServiceCard
                key={svc.id}
                icon={SERVICE_ICONS[svc.name] || DEFAULT_ICON}
                title={svc.name}
                description={svc.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
