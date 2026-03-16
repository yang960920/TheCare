/** app/page.tsx — 홈 페이지 (메인)
 *
 *  섹션 구성:
 *  1. 히어로 — 대형 헤드라인 + CTA 버튼 2개
 *  2. 서비스 요약 — 5개 서비스 카드 (줄눈/청소/탄성/나노코팅/새집증후군)
 *  3. 고객 후기 미리보기 — 3개 리뷰 카드
 *  4. 아카데미 배너 — 교육 과정 안내 유도
 *  5. 포인트 적립 이벤트 배너
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ServiceCard from "@/components/ui/ServiceCard";
import ReviewCard from "@/components/ui/ReviewCard";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  더미 데이터 정의
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 5개 서비스 항목 ── */
const SERVICES = [
  {
    title: "줄눈 시공",
    description:
      "욕실, 주방, 베란다 타일 줄눈을 전문 장비로 깔끔하게 시공합니다. 곰팡이 방지 및 미관 개선 효과가 뛰어납니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "입주 청소",
    description:
      "신축·이사 전후 전문 입주 청소 서비스입니다. 구석구석 세밀한 클리닝으로 새 집처럼 만들어 드립니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "탄성 코트",
    description:
      "바닥재 보호와 미끄럼 방지를 위한 탄성 코트 시공입니다. 내구성과 안전성을 동시에 확보합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "나노 코팅",
    description:
      "주방 상판, 욕실 유리 등에 나노 코팅을 적용하여 오염 방지 및 세균 번식을 억제합니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "새집증후군 제거",
    description:
      "포름알데히드, VOC 등 유해물질 제거 시공입니다. 가족의 건강을 위한 필수 서비스입니다.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

/* ── 고객 후기 더미 데이터 3개 ── */
const REVIEWS = [
  {
    name: "김서영",
    rating: 5,
    serviceType: "입주 청소",
    content:
      "이사 전 입주 청소를 맡겼는데, 정말 새 집처럼 깨끗해졌어요. 구석구석 꼼꼼하게 해주셔서 감동이었습니다.",
  },
  {
    name: "박준혁",
    rating: 5,
    serviceType: "줄눈 시공",
    content:
      "화장실 줄눈이 까맣게 변해서 고민이었는데, 시공 후 완전 새것처럼 변했습니다. 가격도 합리적이었어요.",
  },
  {
    name: "이미경",
    rating: 4,
    serviceType: "나노 코팅",
    content:
      "주방 상판에 나노 코팅을 했는데 물때가 안 끼고 관리가 정말 편해졌어요. 추천합니다!",
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  메인 홈 페이지 컴포넌트
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  섹션 1: 히어로 — 대형 비주얼 + CTA
       * ═══════════════════════════════════════════════ */}
      <section className="relative z-0 min-h-screen flex items-center overflow-hidden">
        {/* 배경 이미지 */}
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80"
          alt="청소 전문 서비스 히어로 이미지"
          fill
          className="object-cover pointer-events-none"
          priority
        />
        {/* 어두운 오버레이 (텍스트 가독성 확보) */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50 pointer-events-none" />

        {/* 히어로 콘텐츠 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* 상단 라벨 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span className="text-white/80 text-sm font-medium">프리미엄 청소 전문 기업</span>
            </motion.div>

            {/* 메인 헤드라인 */}
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              깨끗한 공간,
              <br />
              <span className="gradient-text">건강한 생활</span>의
              <br />
              시작
            </h1>

            {/* 서브카피 */}
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              줄눈 시공부터 입주 청소, 나노 코팅까지.
              <br />
              클린마스터가 완벽한 클리닝을 약속합니다.
            </p>

            {/* CTA 버튼 2개 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 견적문의 (주요 CTA) */}
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan/30 transition-all duration-300 text-base"
              >
                무료 견적 받기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {/* 서비스 둘러보기 (보조 CTA) */}
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 text-base"
              >
                서비스 둘러보기
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 히어로 하단 웨이브 장식 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  섹션 2: 서비스 요약 — 5개 서비스 카드
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
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-navy mt-3 mb-4">
              전문 시공 서비스
            </h2>
            <p className="text-navy/60 text-base md:text-lg max-w-2xl mx-auto">
              10년 이상의 노하우와 전문 장비로 최상의 결과를 보장합니다
            </p>
          </motion.div>

          {/* 서비스 카드 그리드 (모바일: 1열, 태블릿: 2열, 데스크탑: 3열) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
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

      {/* ═══════════════════════════════════════════════
       *  섹션 3: 숫자로 보는 클린마스터 — 통계 배너
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-navy relative overflow-hidden">
        {/* 배경 데코레이션 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* 통계 항목들 (더미 데이터) */}
            {[
              { number: "15,000+", label: "시공 완료 건수" },
              { number: "98%", label: "고객 만족도" },
              { number: "12년", label: "업계 경력" },
              { number: "200+", label: "전문 기술 인력" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-cyan mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  섹션 4: 고객 후기 미리보기 — 3개 리뷰 카드
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 섹션 타이틀 + 더보기 링크 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
          >
            <div>
              <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
                Reviews
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mt-3">
                고객님의 생생한 후기
              </h2>
            </div>
            <Link
              href="/reviews"
              className="mt-4 sm:mt-0 text-cyan font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              전체 후기 보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* 리뷰 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review, index) => (
              <ReviewCard key={review.name} {...review} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  섹션 5: 아카데미 배너 — 교육 과정 안내
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* 배경 이미지 */}
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80"
              alt="클린마스터 아카데미 교육 배너"
              width={1200}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
            />
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60" />

            {/* 배너 콘텐츠 */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 lg:px-16 max-w-xl">
                <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
                  Academy
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mt-2 mb-4">
                  클린마스터 아카데미에서
                  <br />
                  전문가로 성장하세요
                </h2>
                <p className="text-white/70 text-sm md:text-base mb-6">
                  청소 전문 기술을 배우고 자격증을 취득하여 새로운 커리어를 시작해보세요.
                </p>
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-cyan-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 text-sm"
                >
                  수강 과정 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  섹션 6: 포인트 적립 이벤트 배너
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8"
          >
            {/* 좌측 텍스트 영역 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/20 rounded-full px-4 py-1.5 mb-4">
                <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span className="text-cyan text-sm font-medium">EVENT</span>
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-4">
                서비스 이용하고
                <br />
                <span className="text-cyan">포인트</span> 적립하세요!
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-md mx-auto lg:mx-0">
                시공 금액의 최대 5% 포인트 적립! 적립된 포인트는 다음 서비스에서 현금처럼 사용 가능합니다.
              </p>
            </div>

            {/* 우측 CTA 버튼 */}
            <div className="flex-shrink-0">
              <Link
                href="/points"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan/30 transition-all duration-300"
              >
                자세히 알아보기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
