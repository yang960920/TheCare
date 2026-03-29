/** app/about/page.tsx — 회사소개 페이지 (THE CARE v2)
 *
 *  구성:
 *  - 히어로 + 회사 소개
 *  - 핵심 가치
 *  - 사업자 등록 정보
 *  - 견적문의 CTA
 */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ── 핵심 가치 ── */
const VALUES = [
  {
    icon: "✨",
    title: "전문성",
    desc: "숙련된 시공 인력과 최신 장비로 최상의 결과를 보장합니다.",
  },
  {
    icon: "🤝",
    title: "신뢰",
    desc: "투명한 견적과 정직한 시공으로 고객의 신뢰를 최우선합니다.",
  },
  {
    icon: "🏆",
    title: "품질",
    desc: "프리미엄 자재와 까다로운 품질 관리로 만족을 넘어선 감동을 드립니다.",
  },
  {
    icon: "💚",
    title: "친환경",
    desc: "인체에 무해한 친환경 제품과 공법으로 안전한 공간을 만들어 드립니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">About THE CARE</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              깨끗한 공간,
              <br />
              건강한 생활의 시작
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              더케어는 프리미엄 청소 · 시공 전문 기업으로, 입주 청소부터 줄눈 시공, 나노 코팅까지 전문 서비스를 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 회사 소개 / 인사말 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Our Story</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-6">더케어를 소개합니다</h2>
            <div className="space-y-4 text-navy/60 text-base leading-relaxed text-left">
              <p>
                <strong className="text-navy">더케어</strong>는 2022년 설립 이래, &ldquo;깨끗한 공간이 건강한 생활의 시작&rdquo;이라는
                신념 아래 프리미엄 청소 및 시공 서비스를 제공해 왔습니다.
              </p>
              <p>
                입주 청소, 줄눈 시공, 탄성 코트, 나노 코팅, 새집증후군 제거까지 — 다양한 분야에서 축적한 전문 기술력과
                최고급 자재를 바탕으로 고객 만족을 넘어선 가치를 전달하고자 합니다.
              </p>
              <p>
                까다로운 기준의 시공 품질 관리와 친환경 공법을 통해 입주하는 순간부터 쾌적하고 건강한 공간을 경험하실 수 있습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ═══ 핵심 가치 ═══ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Core Values</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-navy mt-3 mb-4">핵심 가치</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center gold-border"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 사업자 정보 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto bg-cream rounded-2xl p-8 gold-border"
          >
            <h3 className="font-display font-bold text-lg text-navy mb-6 text-center">사업자 정보</h3>
            <div className="space-y-3 text-sm text-navy/60">
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">상호명</span><span>더케어</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">대표자</span><span>문성민</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">사업자등록번호</span><span>282-55-00733</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">개업연월일</span><span>2022년 10월 27일</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">업태</span><span>서비스업, 교육서비스업</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">종목</span><span>건축물 일반 청소업, 교육(줄눈, 청소)</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">소재지</span><span>경기도 양주시 화합로1710번길 76, 4층 공장435호(옥정동, 슈프림더브릭스타워)</span></div>
              <div className="flex gap-4"><span className="font-semibold text-navy w-28 flex-shrink-0">이메일</span><span>bbonomall1021@gmail.com</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              깨끗한 공간이 필요하신가요?
            </h2>
            <p className="text-white/60 text-base mb-8">
              무료 견적 상담으로 시작하세요. 전문 상담사가 안내해 드립니다.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all duration-300"
            >
              무료 견적 받기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
