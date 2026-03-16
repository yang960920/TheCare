/** app/quote/page.tsx — 견적문의 페이지
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 견적문의 타이틀
 *  2. 문의 폼 UI (이름/연락처/서비스/면적/메모) — 기능 없음, UI만
 *  3. 연락처 안내 카드 (우측 또는 하단)
 */
"use client";

import { motion } from "framer-motion";

/* ── 서비스 선택 옵션 목록 ── */
const SERVICE_OPTIONS = [
  "서비스를 선택해 주세요",
  "줄눈 시공",
  "입주 청소",
  "탄성 코트",
  "나노 코팅",
  "새집증후군 제거",
  "기타",
];

export default function QuotePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로 — 견적문의 타이틀 배너
       * ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">
              Contact
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              견적문의
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              무료 견적을 요청해 주시면 24시간 이내에 연락드리겠습니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  문의 폼 + 연락처 카드 레이아웃
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ── 좌측: 문의 폼 영역 (2/3 너비) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-light/50">
                <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-6">
                  견적 요청서
                </h2>

                {/* 폼 (기능 없음, UI만) */}
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* 이름 + 연락처 (2열 그리드) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 이름 입력 */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1.5">
                        이름 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="홍길동"
                        className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate"
                      />
                    </div>
                    {/* 연락처 입력 */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1.5">
                        연락처 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="010-1234-5678"
                        className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate"
                      />
                    </div>
                  </div>

                  {/* 서비스 선택 드롭다운 */}
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      서비스 선택 <span className="text-red-400">*</span>
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy appearance-none bg-white">
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* 시공 면적 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      시공 면적 (평)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 32평"
                      className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate"
                    />
                  </div>

                  {/* 메모 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      추가 메모
                    </label>
                    <textarea
                      rows={4}
                      placeholder="시공 관련 특이사항이나 요청사항을 입력해 주세요"
                      className="w-full px-4 py-3 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate resize-none"
                    />
                  </div>

                  {/* 제출 버튼 (기능 없음) */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 text-base"
                  >
                    견적 요청하기
                  </button>

                  {/* 안내 문구 */}
                  <p className="text-center text-navy/40 text-xs">
                    제출하신 정보는 견적 안내 목적으로만 사용됩니다
                  </p>
                </form>
              </div>
            </motion.div>

            {/* ── 우측: 연락처 안내 카드 (1/3 너비) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* 전화 상담 카드 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-light/50">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">전화 상담</h3>
                <p className="text-navy/60 text-sm mb-3">평일 09:00 ~ 18:00</p>
                <a href="tel:02-1234-5678" className="text-cyan font-bold text-lg hover:underline">
                  02-1234-5678
                </a>
              </div>

              {/* 카카오톡 상담 카드 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-light/50">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">카카오톡 상담</h3>
                <p className="text-navy/60 text-sm mb-3">24시간 접수 가능</p>
                <span className="text-cyan font-bold text-lg">@cleanmaster</span>
              </div>

              {/* 방문 상담 카드 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-light/50">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">방문 상담</h3>
                <p className="text-navy/60 text-sm">
                  서울시 강남구 테헤란로 123
                  <br />
                  클린마스터 빌딩 5층
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
