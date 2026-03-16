/** app/about/page.tsx — 회사소개 페이지
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 회사소개 타이틀
 *  2. 회사 소개 텍스트 + 이미지
 *  3. 핵심 수치 통계 3가지
 *  4. 서비스 상세 카드 5개
 */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ServiceCard from "@/components/ui/ServiceCard";

/* ── 핵심 수치 통계 (더미) ── */
const STATS = [
  {
    number: "12년+",
    label: "업계 경력",
    description: "2013년 설립 이래 꾸준히 성장해 온 청소 전문 기업",
  },
  {
    number: "15,000+",
    label: "시공 완료",
    description: "주거·상업 공간 누적 시공 건수",
  },
  {
    number: "98%",
    label: "고객 만족도",
    description: "재이용률 기반 고객 만족도 조사 결과",
  },
];

/* ── 서비스 상세 정보 5개 ── */
const SERVICES_DETAIL = [
  {
    title: "줄눈 시공",
    description:
      "욕실, 주방, 베란다 등 타일이 있는 모든 공간의 줄눈을 전문 장비와 재료로 시공합니다. 기존 오염된 줄눈을 제거하고 항균·방수 기능이 있는 새 줄눈재를 시공하여 곰팡이 발생을 원천 차단합니다. 시공 후 최대 10년까지 유지되는 내구성을 보장합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "입주 청소",
    description:
      "신축 아파트 입주 전, 이사 전후 전문 청소 서비스입니다. 분진 제거, 유리창 세척, 바닥 왁싱, 주방·화장실 집중 클리닝 등 80개 이상의 체크리스트를 기반으로 구석구석 완벽하게 청소합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "탄성 코트",
    description:
      "아파트 베란다, 복도, 계단 등의 바닥에 탄성 코트를 시공하여 방수·방진·미끄럼 방지 효과를 제공합니다. 기존 바닥재 위에 시공 가능하며, 다양한 컬러와 패턴 옵션으로 미관까지 개선합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "나노 코팅",
    description:
      "주방 상판, 욕실 유리, 거울, 세면대 등에 나노 입자 기반 코팅을 적용합니다. 물때·비누 자국이 끼지 않아 일상 관리가 매우 편리해지며, 세균 번식을 90% 이상 억제하는 항균 효과도 제공합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "새집증후군 제거",
    description:
      "신축 건물에서 발생하는 포름알데히드, VOC(휘발성 유기화합물) 등 유해물질을 전문 장비로 측정하고 제거합니다. 광촉매 코팅과 공기 정화 시스템을 활용하여 안전한 실내 환경을 조성합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
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
              12년간 쌓아 온 신뢰와 기술력으로 최상의 청소 서비스를 제공합니다
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
                  클린마스터는 2013년 설립 이래 &ldquo;깨끗한 공간, 건강한 생활&rdquo;이라는
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
                  alt="클린마스터 전문 청소 작업 현장"
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
       *  핵심 수치 통계 3가지
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
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
                  {stat.number}
                </div>
                {/* 수치 라벨 */}
                <div className="font-display font-bold text-lg text-navy mb-2">
                  {stat.label}
                </div>
                {/* 수치 설명 */}
                <p className="text-navy/50 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  서비스 상세 카드 5개
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

          {/* 서비스 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DETAIL.map((service, index) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
