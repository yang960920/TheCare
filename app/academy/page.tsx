/** app/academy/page.tsx — 아카데미·수강신청 페이지
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 아카데미 타이틀 배너
 *  2. 아카데미 소개 배너 (이미지 + 텍스트)
 *  3. 수강 과정 카드 3개 (기초/전문/마스터)
 *  4. CTA 섹션 — 수강 신청 유도
 */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AcademyCard from "@/components/ui/AcademyCard";

/* ── 수강 과정 더미 데이터 3개 ── */
const COURSES = [
  {
    title: "기초 과정",
    duration: "4주 (주 2회)",
    price: "120만원",
    description:
      "청소 업계 입문자를 위한 기초 과정입니다. 청소 장비 사용법부터 기본 시공 기술까지 체계적으로 배웁니다.",
    features: [
      "청소 장비 기본 사용법",
      "세정제 종류와 용도 이해",
      "기본 줄눈 시공 실습",
      "입주 청소 표준 프로세스",
      "안전 및 위생 교육",
    ],
    featured: false,
  },
  {
    title: "전문가 과정",
    duration: "8주 (주 3회)",
    price: "280만원",
    description:
      "현장 경험을 기반으로 전문 시공 기술을 심화 학습하는 과정입니다. 수료 후 바로 현장 투입이 가능합니다.",
    features: [
      "줄눈·탄성·코팅 전 분야 실습",
      "새집증후군 측정 및 제거 기술",
      "견적 산출 및 고객 상담 노하우",
      "현장 안전 관리 실무",
      "수료증 발급 및 취업 연계",
    ],
    featured: true,
  },
  {
    title: "마스터 과정",
    duration: "12주 (주 3회)",
    price: "450만원",
    description:
      "독립 사업자 또는 관리자를 목표로 하는 최상위 과정입니다. 경영 노하우와 고급 시공 기술을 동시에 습득합니다.",
    features: [
      "전 과정 고급 시공 기술 마스터",
      "사업 운영 및 마케팅 전략",
      "팀 관리 및 리더십 교육",
      "프랜차이즈 운영 가이드",
      "마스터 자격증 발급",
    ],
    featured: false,
  },
];

export default function AcademyPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로 — 아카데미 타이틀 배너
       * ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">Academy</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              아카데미·수강신청
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              체계적인 교육으로 청소 전문가의 길을 열어드립니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  아카데미 소개 배너 — 이미지 + 텍스트
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 좌측: 이미지 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="클린마스터 아카데미 교육 현장"
                  width={800}
                  height={500}
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
            </motion.div>

            {/* 우측: 소개 텍스트 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
                About Academy
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-navy mt-3 mb-6">
                실무 중심의
                <br />
                전문 교육 프로그램
              </h2>
              <div className="space-y-4 text-navy/60 text-base leading-relaxed">
                <p>
                  클린마스터 아카데미는 12년간 축적된 현장 노하우를 바탕으로
                  설계된 전문 교육 프로그램입니다. 이론 교육과 실습을 병행하여
                  수료 직후 바로 현장에 투입 가능한 인재를 양성합니다.
                </p>
                <p>
                  기초 과정부터 마스터 과정까지 단계별 커리큘럼을 제공하며,
                  수료 후 취업 연계 및 창업 지원 프로그램도 운영하고 있습니다.
                </p>
              </div>

              {/* 아카데미 핵심 특징 */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { number: "500+", label: "수료생 배출" },
                  { number: "92%", label: "취업/창업률" },
                  { number: "15명", label: "소수 정원제" },
                  { number: "1:1", label: "멘토링 지원" },
                ].map((item) => (
                  <div key={item.label} className="bg-cream rounded-xl p-4">
                    <div className="font-display font-bold text-xl text-cyan">{item.number}</div>
                    <div className="text-navy/60 text-sm mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  수강 과정 카드 3개 (기초/전문/마스터)
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
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
              Courses
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mt-3 mb-4">
              수강 과정 안내
            </h2>
            <p className="text-navy/60 text-base max-w-2xl mx-auto">
              나에게 맞는 과정을 선택하고 전문가로 성장하세요
            </p>
          </motion.div>

          {/* 과정 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {COURSES.map((course, index) => (
              <AcademyCard key={course.title} {...course} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  CTA 섹션 — 수강 상담 유도
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-4">
              수강 상담이 필요하신가요?
            </h2>
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-xl mx-auto">
              궁금한 점이 있으시면 언제든지 연락주세요. 친절하게 상담해 드리겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan/30 transition-all duration-300">
                수강 상담 신청
              </button>
              <a
                href="tel:02-1234-5678"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-1234-5678
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
