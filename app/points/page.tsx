/** app/points/page.tsx — 포인트 적립 페이지
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 포인트 적립 타이틀
 *  2. 포인트 적립 안내 (적립 방법 / 사용 방법)
 *  3. 이벤트 배너 스타일 레이아웃
 */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ── 포인트 적립 방법 안내 데이터 ── */
const EARN_METHODS = [
  {
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "서비스 이용 적립",
    description: "시공 서비스 이용 시 결제 금액의 3~5%가 자동으로 포인트로 적립됩니다.",
    point: "최대 5% 적립",
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "지인 추천 적립",
    description: "지인을 추천하여 서비스를 이용하시면 추천인과 피추천인 모두에게 포인트가 적립됩니다.",
    point: "건당 10,000P",
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "후기 작성 적립",
    description: "서비스 이용 후 후기를 작성하면 포인트가 적립됩니다. 사진 첨부 시 추가 적립!",
    point: "최대 5,000P",
  },
];

/* ── 포인트 사용 방법 안내 데이터 ── */
const USE_METHODS = [
  {
    title: "서비스 할인",
    description: "1포인트 = 1원으로 다음 서비스 이용 시 할인 적용 가능",
  },
  {
    title: "추가 서비스",
    description: "적립된 포인트로 무료 추가 서비스 (방충망 교체, 실리콘 시공 등) 이용",
  },
  {
    title: "아카데미 수강",
    description: "아카데미 수강료 결제 시 포인트 사용 가능 (최대 30%)",
  },
];

export default function PointsPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로 — 포인트 적립 타이틀 배너
       * ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">Points</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              포인트 적립
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              서비스를 이용할수록 혜택이 커지는 포인트 프로그램
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  포인트 적립 방법 안내
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
              How to Earn
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-navy mt-3 mb-4">
              포인트 적립 방법
            </h2>
            <p className="text-navy/60 text-base max-w-2xl mx-auto">
              다양한 활동으로 포인트를 적립하고 혜택을 누리세요
            </p>
          </motion.div>

          {/* 적립 방법 카드 3개 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {EARN_METHODS.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-cream rounded-2xl p-6 md:p-8 hover-lift"
              >
                {/* 아이콘 */}
                <div className="w-14 h-14 rounded-xl bg-cyan/10 flex items-center justify-center mb-5">
                  <div className="text-cyan w-7 h-7">{method.icon}</div>
                </div>

                {/* 제목 */}
                <h3 className="font-display font-bold text-lg md:text-xl text-navy mb-3">
                  {method.title}
                </h3>

                {/* 설명 */}
                <p className="text-navy/60 text-sm leading-relaxed mb-4">
                  {method.description}
                </p>

                {/* 적립 포인트 뱃지 */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan/10 rounded-full">
                  <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-cyan font-bold text-sm">{method.point}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  포인트 사용 방법 안내
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 좌측: 텍스트 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
                How to Use
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-navy mt-3 mb-6">
                적립된 포인트,
                <br />
                이렇게 사용하세요
              </h2>

              {/* 사용 방법 리스트 */}
              <div className="space-y-5">
                {USE_METHODS.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    {/* 번호 뱃지 */}
                    <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-navy mb-1">
                        {method.title}
                      </h3>
                      <p className="text-navy/60 text-sm leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 우측: 포인트 카드 시각 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 md:p-10 text-center">
                  {/* 포인트 카드 내부 */}
                  <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="text-white/50 text-sm mb-2">보유 포인트 (예시)</div>
                  <div className="font-display font-black text-5xl md:text-6xl text-cyan mb-2">
                    12,500
                  </div>
                  <div className="text-white/50 text-sm mb-8">P</div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/40 text-xs mb-1">적립 예정</div>
                      <div className="text-cyan font-bold text-lg">+3,200P</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/40 text-xs mb-1">이번 달 사용</div>
                      <div className="text-white font-bold text-lg">-5,000P</div>
                    </div>
                  </div>
                </div>

                {/* 데코 원 */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan/10 rounded-full -z-10" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-cyan/5 rounded-full -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  이벤트 배너 — 특별 포인트 이벤트 안내
       * ═══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-cyan/10 via-cyan/5 to-transparent border-2 border-cyan/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
          >
            {/* 이벤트 아이콘 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cyan to-cyan-dark flex items-center justify-center">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>

            {/* 이벤트 텍스트 */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/20 rounded-full px-3 py-1 mb-3">
                <span className="text-cyan text-xs font-bold">🎉 진행 중인 이벤트</span>
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-navy mb-2">
                신규 가입 시 5,000P 즉시 적립!
              </h3>
              <p className="text-navy/60 text-sm md:text-base">
                지금 클린마스터 회원으로 가입하시면 5,000 포인트를 즉시 드립니다.
                첫 서비스 이용 시 바로 사용 가능합니다.
              </p>
            </div>

            {/* CTA 버튼 */}
            <div className="flex-shrink-0">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 text-sm whitespace-nowrap"
              >
                이벤트 참여하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
