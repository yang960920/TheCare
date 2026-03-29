/** app/page.tsx — 홈 페이지 (메인) — THE CARE v2
 *
 *  섹션 구성:
 *  1. 히어로 — DB 데이터 기반 헤드라인 + CTA (관리자 편집 반영)
 *  2. 서비스 요약 — 5개 서비스 카드
 *  3. 숫자로 보는 더케어 — DB 통계 기반 (관리자 편집 반영)
 *  4. 시공사례 미리보기 — 최신 Before/After
 *  5. 견적문의 CTA 배너
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import PopupManager from "@/components/ui/PopupManager";

/* ── 5개 서비스 항목 ── */
const SERVICES = [
  {
    title: "입주 청소",
    description: "신축·이사 전후 청소 서비스. 공사 먼지, 미세 분진까지 깔끔하게.",
    href: "/services/cleaning",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "줄눈 시공",
    description: "케라폭시·빅라이언 프리미엄 에폭시로 곰팡이 없는 깨끗한 줄눈.",
    href: "/services/grout",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "탄성 코트",
    description: "결로·곰팡이 방지 탄성 코트. 바이오세라믹, 에어로겔 시공.",
    href: "/services/elasticcoat",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "나노 코팅",
    description: "발수·항균 나노 코팅. 물때 방지로 청소 시간을 획기적으로 단축.",
    href: "/services/nanocoat",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "새집증후군 제거",
    description: "포름알데히드·VOC 유해물질 측정 및 제거. 아이·임산부 필수.",
    href: "/services/newsyndrome",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

type HeroData = {
  headline: string;
  subCopy: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  bgImageUrl: string;
};

type StatData = { number: string; label: string };

export default function HomePage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [stats, setStats] = useState<StatData[] | null>(null);
  const [dbServices, setDbServices] = useState<any[] | null>(null);

  /* DB에서 히어로 & 회사 정보 로드 */
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setDbServices(data))
      .catch(() => {});

    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => { if (data && data.headline) setHero(data); })
      .catch(() => {});

    fetch("/api/company")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.stats && data.stats.length > 0) {
          setStats(data.stats.map((s: { label: string; value: string }) => ({
            number: s.value,
            label: s.label,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <PopupManager />
      {/* ═══ 히어로 섹션 (DB 로드 완료 후에만 표시) ═══ */}
      {hero && (
      <section className="relative z-0 min-h-screen flex items-center overflow-hidden">
        {hero.bgImageUrl && (
          <Image
            src={hero.bgImageUrl}
            alt="더케어 프리미엄 청소 서비스"
            fill
            className="object-cover pointer-events-none"
            priority
          />
        )}
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* 상단 라벨 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold-pale text-sm font-medium">프리미엄 청소 전문 기업</span>
            </motion.div>

            {/* 메인 헤드라인 — THE CARE 항상 마지막 단독 줄 */}
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-white leading-[1.15] mb-6">
              {(() => {
                const full = (hero.headline || "").replace(/^[""]|[""]$/g, "");

                // "THE CARE" 앞에서 분리 (쉼표·공백 포함)
                const tcIdx = full.lastIndexOf("THE CARE");
                if (tcIdx > 0) {
                  // 앞부분 ("보이지 않는 곳까지 책임지는 프리미엄 입주 케어, " 등)
                  const before = full.slice(0, tcIdx).replace(/,?\s*$/, "").trim();
                  // "까지" 뒷 공백에서 1·2행 분리, 없으면 중간 공백
                  const kIdx = before.indexOf("까지 ");
                  let splitAt = kIdx > 0 ? kIdx + 3 : Math.floor(before.length / 2);
                  // 분리 지점 직후의 공백 위치로 보정
                  const spIdx = before.indexOf(" ", splitAt - 1);
                  if (spIdx > 0) splitAt = spIdx;
                  const line1 = before.slice(0, splitAt).trim();
                  const line2 = before.slice(splitAt).trim();
                  return (
                    <>
                      <span className="block">{line1}</span>
                      <span className="block">{line2},</span>
                      <span className="block gradient-text">THE CARE</span>
                    </>
                  );
                }

                // THE CARE 없는 일반 케이스 — 2줄 분리
                const mid = Math.floor(full.length / 2);
                const splitIdx = full.lastIndexOf(" ", mid + 6) || mid;
                return (
                  <>
                    <span className="block">{full.slice(0, splitIdx).trim()}</span>
                    <span className="block gradient-text">{full.slice(splitIdx).trim()}</span>
                  </>
                );
              })()}
            </h1>

            {/* ── 서브카피 + CTA 리디자인 ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {/* 골드 구분선 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold" />
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">The Care Promise</span>
              </div>

              {/* 인용구 스타일 강조 문구 */}
              <p className="text-white font-semibold text-base md:text-lg leading-snug mb-4">
                &ldquo;청소가 아닌, 입주를 완성합니다&rdquo;
              </p>

              {/* 설명 텍스트 */}
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-7 max-w-md">
                입주청소, 줄눈, 탄성코트, 새집증후군, 나노코팅까지<br />
                공간의 <span className="text-gold-pale font-medium">&lsquo;보이는 것과 보이지 않는 것&rsquo;</span>을 모두 케어하는<br />
                프리미엄 입주 전문 브랜드입니다.
              </p>

              {/* 신뢰 뱃지 */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: "✓", text: "전문 자격 보유" },
                  { icon: "✓", text: "100% 책임 시공" },
                  { icon: "✓", text: "사후 A/S 보장" },
                ].map((badge) => (
                  <span
                    key={badge.text}
                    className="inline-flex items-center gap-1.5 text-xs text-white/80 bg-white/10 border border-white/15 rounded-full px-3 py-1.5"
                  >
                    <span className="text-gold font-bold">{badge.icon}</span>
                    {badge.text}
                  </span>
                ))}
              </div>

              {/* CTA 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={hero.cta1Link || "/quote"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5 transition-all duration-300 text-sm"
                >
                  {hero.cta1Text || "무료 견적 받기"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={hero.cta2Link || "/services/cleaning"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm"
                >
                  {hero.cta2Text || "서비스 둘러보기"}
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
      )}

      {/* ═══ 서비스 요약 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-navy mt-3 mb-4">
              전문 시공 서비스
            </h2>
            <p className="text-navy/60 text-base md:text-lg max-w-2xl mx-auto">
              숙련된 전문가와 최신 장비로 최상의 결과를 보장합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dbServices
                ? SERVICES.filter(s => {
                    const dbSvc = dbServices.find(db => db.name === s.title);
                    return dbSvc ? dbSvc.visible : true;
                  })
                : SERVICES
            ).map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="block bg-cream rounded-2xl p-6 md:p-8 hover-lift gold-border group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <div className="text-gold w-7 h-7">{service.icon}</div>
                  </div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-navy mb-3 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-4">{service.description}</p>
                  <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold group-hover:gap-2 transition-all">
                    자세히 보기
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 통계 배너 (DB 기반 — 로드 완료 후에만 표시) ═══ */}
      {stats && (
      <section className="py-16 md:py-20 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══ 견적문의 CTA ═══ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-gold text-sm font-medium">FREE ESTIMATE</span>
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-4">
                무료 견적 상담,
                <br />
                지금 바로 <span className="text-gold">신청</span>하세요
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-md mx-auto lg:mx-0">
                전화 한 통이면 전문 상담사가 맞춤 견적을 안내해 드립니다.
                부담 없이 문의하세요.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-white font-bold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all duration-300"
              >
                견적 문의하기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
