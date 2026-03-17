/** app/quote/page.tsx — 견적 확인 페이지
 *
 *  플로우:
 *  1. 평수 입력 + 건물 상태 선택 (신축/구축)
 *  2. "견적 확인하기" → 팝업: 예상 견적 범위 표시
 *  3. 팝업 내 이름/연락처 입력 → "상담 신청하기" → 관리자 페이지 전달
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/adminStore";

/* ── 단가 설정 (더미) ── */
const PRICE_PER_PYEONG = {
  new: 11000,   // 신축: 평당 11,000원
  old: 16500,   // 구축: 평당 16,500원
};
const PRICE_RANGE_MULTIPLIER = 1.25; // 최대 견적 = 최소 × 1.25

/* ── 건물 상태 옵션 ── */
const BUILDING_OPTIONS = [
  {
    value: "new" as const,
    label: "신축",
    sub: "5년 이내, 비교적 깨끗함",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    value: "old" as const,
    label: "구축",
    sub: "5년 이상, 찌든 때 제거",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function QuotePage() {
  /* ── 폼 상태 ── */
  const [area, setArea] = useState("");
  const [buildingType, setBuildingType] = useState<"new" | "old" | null>(null);

  /* ── 팝업 상태 ── */
  const [showModal, setShowModal] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  /* ── 상담 폼 상태 ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { addQuote, addToast } = useAdminStore();

  /** 견적 계산 + 팝업 열기 */
  const handleEstimate = () => {
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0) {
      addToast("평수를 올바르게 입력해주세요.", "error");
      return;
    }
    if (!buildingType) {
      addToast("건물 상태를 선택해주세요.", "error");
      return;
    }

    const unitPrice = PRICE_PER_PYEONG[buildingType];
    const min = Math.round(areaNum * unitPrice);
    const max = Math.round(min * PRICE_RANGE_MULTIPLIER);
    setMinPrice(min);
    setMaxPrice(max);
    setShowModal(true);
  };

  /** 상담 신청 */
  const handleSubmit = () => {
    if (!name.trim()) {
      addToast("이름을 입력해주세요.", "error");
      return;
    }
    if (!phone.trim()) {
      addToast("연락처를 입력해주세요.", "error");
      return;
    }

    addQuote({
      customerName: name,
      phone,
      serviceType: "입주 청소",
      area: `${area}평`,
      memo: `건물상태: ${buildingType === "new" ? "신축" : "구축"} | 예상견적: ${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`,
      status: "미확인",
      createdAt: new Date().toISOString().split("T")[0],
      contactDate: "",
      contactMemo: "",
    });

    setSubmitted(true);
    addToast("상담 신청이 완료되었습니다!");
  };

  /** 모달 닫기 & 리셋 */
  const closeModal = () => {
    setShowModal(false);
    if (submitted) {
      setArea("");
      setBuildingType(null);
      setName("");
      setPhone("");
      setSubmitted(false);
    }
  };

  /** 금액 포맷 */
  const formatPrice = (n: number) => n.toLocaleString();

  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로
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
              Estimate
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              견적 확인
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              간단한 정보만 입력하시면 예상 견적을 바로 확인하실 수 있습니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  견적 확인 폼
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ── 좌측: 견적 폼 (2/3) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-light/50">
                <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-8">
                  예상 견적 확인하기
                </h2>

                <div className="space-y-8">
                  {/* Step 1: 평수 입력 */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                      <span className="w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">1</span>
                      청소 공간 평수를 입력해주세요
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="예: 32"
                        min="1"
                        className="w-full px-4 py-4 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-base text-navy placeholder:text-slate pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 font-medium">평</span>
                    </div>
                  </div>

                  {/* Step 2: 건물 상태 선택 */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                      <span className="w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">2</span>
                      건물의 상태를 선택해주세요
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {BUILDING_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBuildingType(opt.value)}
                          className={`relative flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                            buildingType === opt.value
                              ? "border-cyan bg-cyan/5 shadow-md shadow-cyan/10"
                              : "border-slate-light hover:border-cyan/40 bg-white"
                          }`}
                        >
                          {/* 선택 인디케이터 */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            buildingType === opt.value
                              ? "border-cyan bg-cyan"
                              : "border-slate-light"
                          }`}>
                            {buildingType === opt.value && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`${buildingType === opt.value ? "text-cyan" : "text-navy/40"} transition-colors`}>
                                {opt.icon}
                              </span>
                              <span className={`font-bold text-base ${buildingType === opt.value ? "text-navy" : "text-navy/80"}`}>
                                {opt.label}
                              </span>
                            </div>
                            <span className="text-sm text-navy/50">{opt.sub}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 견적 확인 버튼 */}
                  <button
                    type="button"
                    onClick={handleEstimate}
                    className="w-full py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 text-base"
                  >
                    견적 확인하기
                  </button>

                  <p className="text-center text-navy/40 text-xs">
                    실제 견적은 현장 상담을 통해 확정됩니다
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── 우측: 연락처 안내 카드 (1/3) ── */}
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

      {/* ═══════════════════════════════════════════════
       *  견적 결과 + 상담 신청 팝업 모달
       * ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {!submitted ? (
                  <>
                    {/* ── 견적 결과 영역 ── */}
                    <div className="bg-gradient-to-br from-cyan/5 to-cyan/10 p-6 md:p-8 rounded-t-2xl border-b border-cyan/10">
                      {/* 닫기 버튼 */}
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={closeModal}
                          className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                        >
                          <svg className="w-5 h-5 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* 체크 아이콘 + 제목 */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-cyan flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-bold text-navy text-base">조건별 예상 견적</span>
                      </div>

                      {/* 금액 표시 */}
                      <div className="text-center mb-4">
                        <span className="font-display font-black text-2xl md:text-3xl text-navy">
                          {formatPrice(minPrice)}원
                        </span>
                        <span className="text-navy/40 font-bold text-xl mx-2">~</span>
                        <span className="font-display font-black text-2xl md:text-3xl text-navy">
                          {formatPrice(maxPrice)}원
                        </span>
                      </div>

                      {/* 안내 사항 */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-sm text-navy/60 leading-relaxed">
                        <span className="text-amber-500 mr-1">⚠️</span>
                        <span className="font-semibold text-navy/70">안내사항:</span> 위 금액은 입력하신 정보를 바탕으로 산출된 대략적인 가견적입니다. 베란다 확장 여부, 오염도, 추가 시공(줄눈 등)에 따라 최종 금액은 전화 상담 후 확정됩니다.
                      </div>
                    </div>

                    {/* ── 상담 신청 폼 ── */}
                    <div className="p-6 md:p-8">
                      <h3 className="font-display font-bold text-lg text-navy text-center mb-2">
                        정확한 맞춤 견적이 필요하신가요?
                      </h3>
                      <p className="text-navy/50 text-sm text-center mb-6">
                        연락처를 남겨주시면 담당자가 친절하게 상담해 드립니다
                      </p>

                      <div className="space-y-4">
                        {/* 이름 */}
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름 (예: 홍길동)"
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate"
                          />
                        </div>

                        {/* 연락처 */}
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="연락처 (예: 010-1234-5678)"
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-light focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-sm text-navy placeholder:text-slate"
                          />
                        </div>

                        {/* 상담 신청 버튼 */}
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="w-full py-4 bg-navy text-white font-bold rounded-xl hover:bg-navy-light transition-all duration-300 text-base"
                        >
                          상담 신청하기
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── 신청 완료 화면 ── */
                  <div className="p-8 md:p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-navy mb-3">
                      상담 신청이 완료되었습니다!
                    </h3>
                    <p className="text-navy/50 text-sm mb-6 leading-relaxed">
                      담당자가 빠른 시일 내에 연락드리겠습니다.
                      <br />
                      감사합니다.
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-8 py-3 bg-gradient-to-r from-cyan to-cyan-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all"
                    >
                      확인
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
