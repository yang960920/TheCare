/** app/quote/page.tsx — 가견적 확인 페이지
 *
 *  플로우:
 *  1. 평형대 선택 (20평대 / 30평대 / 40평대)
 *  2. 서비스 체크박스 복수 선택 → 실시간 합산 표시
 *  3. "가견적 확인하기" → 팝업: 선택 서비스 요약 + 합산 금액
 *  4. 팝업 내 이름/연락처 입력 → "세부 상담 신청하기" → 관리자 페이지 전달
 */
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/adminStore";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  가격 데이터 (단위: 만원)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ServiceInfo {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  prices: Record<string, number>; // "20" | "30" | "40" → 만원
}

const SERVICES: ServiceInfo[] = [
  {
    key: "elastic",
    label: "탄성 코트",
    description: "바닥재 보호 및 미끄럼 방지 탄성 코트 시공",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    prices: { "20": 35, "30": 40, "40": 45 },
  },
  {
    key: "grout",
    label: "줄눈 시공",
    description: "욕실·주방 타일 줄눈 전문 시공",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    prices: { "20": 30, "30": 35, "40": 40 },
  },
  {
    key: "cleaning",
    label: "입주 청소",
    description: "신축·이사 전후 전문 입주 청소 서비스",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    prices: { "20": 35, "30": 45, "40": 55 },
  },
  {
    key: "nanoCoat",
    label: "나노 코팅",
    description: "오염 방지 및 항균 나노 코팅 시공",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    prices: { "20": 50, "30": 55, "40": 60 },
  },
  {
    key: "sickHouse",
    label: "새집증후군 제거",
    description: "유해물질 측정 및 제거 시공",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    prices: { "20": 30, "30": 35, "40": 40 },
  },
];

/* ── 평형대 옵션 ── */
const AREA_OPTIONS = [
  { value: "20", label: "20평대", sub: "59㎡ ~ 66㎡" },
  { value: "30", label: "30평대", sub: "85㎡ ~ 99㎡" },
  { value: "40", label: "40평대", sub: "115㎡ ~ 132㎡" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  메인 컴포넌트
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function QuotePage() {
  /* ── 폼 상태 ── */
  const [areaSize, setAreaSize] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  /* ── 팝업 상태 ── */
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── 상담 폼 상태 ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { addQuote, addToast } = useAdminStore();

  /* ── 체크박스 토글 ── */
  const toggleService = (key: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* ── 실시간 합산 계산 ── */
  const { totalPrice, breakdown } = useMemo(() => {
    if (!areaSize) return { totalPrice: 0, breakdown: [] as { label: string; price: number }[] };
    const items: { label: string; price: number }[] = [];
    let total = 0;
    for (const svc of SERVICES) {
      if (selectedServices.has(svc.key)) {
        const price = svc.prices[areaSize] ?? 0;
        items.push({ label: svc.label, price });
        total += price;
      }
    }
    return { totalPrice: total, breakdown: items };
  }, [areaSize, selectedServices]);

  /* ── 가견적 확인하기 ── */
  const handleEstimate = () => {
    if (!areaSize) {
      addToast("평형대를 선택해주세요.", "error");
      return;
    }
    if (selectedServices.size === 0) {
      addToast("최소 1개 이상의 서비스를 선택해주세요.", "error");
      return;
    }
    setShowModal(true);
    setSubmitted(false);
    setName("");
    setPhone("");
  };

  /* ── 상담 신청 ── */
  const handleSubmit = () => {
    if (!name.trim()) {
      addToast("이름을 입력해주세요.", "error");
      return;
    }
    if (!phone.trim()) {
      addToast("연락처를 입력해주세요.", "error");
      return;
    }

    const serviceNames = breakdown.map((b) => b.label).join(", ");
    const areaLabel = AREA_OPTIONS.find((a) => a.value === areaSize)?.label ?? "";

    addQuote({
      customerName: name,
      phone,
      serviceType: serviceNames,
      area: areaLabel,
      memo: `[견적] ${breakdown.map((b) => b.label).join(", ")} | ${areaLabel} | 합계: ${totalPrice}만원`,
      status: "미확인",
      createdAt: new Date().toISOString().split("T")[0],
      contactDate: "",
      contactMemo: "",
    });

    setSubmitted(true);
    addToast("상담 신청이 완료되었습니다!");
  };

  /* ── 모달 닫기 & 리셋 ── */
  const closeModal = () => {
    setShowModal(false);
    if (submitted) {
      setAreaSize(null);
      setSelectedServices(new Set());
      setName("");
      setPhone("");
      setSubmitted(false);
    }
  };

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
              원하시는 서비스를 선택하시면 예상 견적을 바로 확인할 수 있습니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  가견적 폼
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ── 좌측: 가견적 폼 (2/3) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-light/50">
                <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-8">
                  견적 확인하기
                </h2>

                <div className="space-y-8">
                  {/* ── Step 1: 평형대 선택 ── */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                      <span className="w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">1</span>
                      평형대를 선택해주세요
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {AREA_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAreaSize(opt.value)}
                          className={`relative p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                            areaSize === opt.value
                              ? "border-cyan bg-cyan/5 shadow-md shadow-cyan/10"
                              : "border-slate-light hover:border-cyan/40 bg-white"
                          }`}
                        >
                          <div className={`font-bold text-lg ${areaSize === opt.value ? "text-navy" : "text-navy/70"}`}>
                            {opt.label}
                          </div>
                          <div className="text-xs text-navy/40 mt-0.5">{opt.sub}</div>
                          {/* 선택 체크 */}
                          {areaSize === opt.value && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Step 2: 서비스 체크박스 ── */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                      <span className="w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">2</span>
                      원하시는 서비스를 선택해주세요
                      <span className="text-navy/40 text-xs font-normal">(복수 선택 가능)</span>
                    </label>
                    <div className="space-y-3">
                      {SERVICES.map((svc) => {
                        const isChecked = selectedServices.has(svc.key);
                        return (
                          <button
                            key={svc.key}
                            type="button"
                            onClick={() => toggleService(svc.key)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                              isChecked
                                ? "border-cyan bg-cyan/5 shadow-md shadow-cyan/10"
                                : "border-slate-light hover:border-cyan/40 bg-white"
                            }`}
                          >
                            {/* 체크박스 */}
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isChecked
                                ? "border-cyan bg-cyan"
                                : "border-slate-light"
                            }`}>
                              {isChecked && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>

                            {/* 아이콘 */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isChecked ? "bg-cyan/10 text-cyan" : "bg-slate-50 text-navy/30"
                            }`}>
                              {svc.icon}
                            </div>

                            {/* 텍스트 */}
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-base ${isChecked ? "text-navy" : "text-navy/70"}`}>
                                {svc.label}
                              </div>
                              <div className="text-xs text-navy/40 truncate">{svc.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 견적 확인 버튼 ── */}
                  <button
                    type="button"
                    onClick={handleEstimate}
                    className="w-full py-4 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300 text-base"
                  >
                    견적 확인하기
                  </button>

                  {/* ── 안내 문구 ── */}
                  <div className="space-y-1.5 text-center">
                    <p className="text-navy/40 text-xs">
                      ※ 실제 견적은 현장 상담을 통해 확정됩니다
                    </p>
                    <p className="text-navy/40 text-xs">
                      ※ 프리미엄 옵션 추가금은 별도 문의 바랍니다
                    </p>
                  </div>
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
                <a href="tel:031-0000-0000" className="text-cyan font-bold text-lg hover:underline">
                  031-0000-0000
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
                <span className="text-cyan font-bold text-lg">@thecare</span>
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
                  경기도 양주시 화합로1710번길 76
                  <br />
                  4층 공장435호 (옥정동, 슈프림더브릭스타워)
                </p>
              </div>

              {/* 가격 표시 안내 */}
              <div className="bg-cyan/5 border border-cyan/15 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-navy mb-1">가견적 안내</p>
                    <p className="text-xs text-navy/60 leading-relaxed">
                      본 페이지의 견적은 참고용 가견적이며, 실제 시공 금액은 현장 방문 상담 후 확정됩니다.
                      프리미엄 옵션 및 특수 시공은 추가 비용이 발생할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  가견적 결과 + 상담 신청 팝업 모달
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
                    {/* ── 가견적 결과 영역 ── */}
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

                      {/* 제목 */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-6 h-6 rounded-full bg-cyan flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <span className="font-bold text-navy text-base">
                          견적 결과 ({AREA_OPTIONS.find((a) => a.value === areaSize)?.label})
                        </span>
                      </div>

                      {/* 서비스 리스트 */}
                      <div className="space-y-2.5 mb-5">
                        {breakdown.map((item) => (
                          <div key={item.label} className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm font-medium text-navy">{item.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 합계 */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-navy/50 text-xs mb-1">
                          {selectedServices.size}개 서비스 · {AREA_OPTIONS.find((a) => a.value === areaSize)?.label}
                        </div>
                        <div className="text-navy/50 text-xs mb-2">예상 합계</div>
                        <span className="font-display font-black text-3xl text-navy">
                          {totalPrice}
                        </span>
                        <span className="text-navy/60 text-sm ml-1">만원</span>
                      </div>

                      {/* 안내 사항 */}
                      <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 text-sm text-navy/60 leading-relaxed">
                        <span className="text-amber-500 mr-1">⚠️</span>
                        <span className="font-semibold text-navy/70">안내:</span> 위 금액은 참고용 가견적이며, 실제 금액은 현장 방문 상담 후 확정됩니다.
                        프리미엄 옵션 및 특수 시공 시 추가 비용이 발생할 수 있습니다.
                      </div>
                    </div>

                    {/* ── 상담 신청 폼 ── */}
                    <div className="p-6 md:p-8">
                      <h3 className="font-display font-bold text-lg text-navy text-center mb-2">
                        세부 상담을 받아보세요
                      </h3>
                      <p className="text-navy/50 text-sm text-center mb-6">
                        연락처를 남겨주시면 담당자가 상세 견적을 안내해 드립니다
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
                          세부 상담 신청하기
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
