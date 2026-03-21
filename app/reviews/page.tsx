/** app/reviews/page.tsx — 고객 후기 페이지 (관리자 답변 표시 + 후기 작성 기능)
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 후기 타이틀 배너
 *  2. 필터 탭 (전체 / 서비스별)
 *  3. 리뷰 카드 그리드
 *  4. 후기 클릭 시 상세 모달 (관리자 답변 표시)
 *  5. 후기 작성 (로그인 필수)
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "@/components/ui/ReviewCard";
import { X, Star, MessageCircle, PenLine } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

/* ── 필터 탭 목록 ── */
const FILTER_TABS = ["전체", "줄눈 시공", "입주 청소", "탄성 코트", "나노 코팅", "새집증후군"];

/* ── 후기 데이터 타입 (관리자 답변 포함) ── */
interface ReviewData {
  id?: string;
  name: string;
  rating: number;
  serviceType: string;
  content: string;
  adminReply?: string;
  adminReplyDate?: string;
}

/* ── 리뷰 더미 데이터 (관리자 답변 포함) ── */
const ALL_REVIEWS: ReviewData[] = [
  {
    name: "김서영",
    rating: 5,
    serviceType: "입주 청소",
    content: "이사 전 입주 청소를 맡겼는데, 정말 새 집처럼 깨끗해졌어요. 구석구석 꼼꼼하게 해주셔서 감동이었습니다. 다음에도 꼭 다시 이용할게요!",
    adminReply: "감사합니다! 다음에도 만족스러운 서비스를 제공하겠습니다. 재이용 시 포인트 적립 혜택도 확인해 보세요.",
    adminReplyDate: "2025-03-02",
  },
  {
    name: "박준혁",
    rating: 5,
    serviceType: "줄눈 시공",
    content: "화장실 줄눈이 까맣게 변해서 고민이었는데, 시공 후 완전 새것처럼 변했습니다. 가격도 합리적이었어요. 매우 만족합니다.",
    adminReply: "",
    adminReplyDate: "",
  },
  {
    name: "이미경",
    rating: 4,
    serviceType: "나노 코팅",
    content: "주방 상판에 나노 코팅을 했는데 물때가 안 끼고 관리가 정말 편해졌어요. 주변 지인들에게도 추천했습니다.",
    adminReply: "좋은 후기 감사드립니다! 나노 코팅은 평균 3년간 효과가 유지됩니다. 추가 시공 문의는 언제든 연락 주세요.",
    adminReplyDate: "2025-03-11",
  },
  {
    name: "정민수",
    rating: 5,
    serviceType: "새집증후군",
    content: "신축 아파트 입주 전에 새집증후군 제거 시공을 받았습니다. 시공 후 측정 결과 유해물질 수치가 확 줄어서 안심이 되었어요.",
    adminReply: "안전한 주거 환경 조성에 도움이 되어 기쁩니다. 6개월 후 재측정 서비스도 무료로 제공해 드리고 있습니다!",
    adminReplyDate: "2025-02-22",
  },
  {
    name: "최은지",
    rating: 5,
    serviceType: "입주 청소",
    content: "20평대 아파트 입주 청소를 받았는데 반나절 만에 깔끔하게 마무리해 주셨어요. 기사님들도 친절하셨습니다.",
    adminReply: "",
    adminReplyDate: "",
  },
  {
    name: "한상우",
    rating: 4,
    serviceType: "탄성 코트",
    content: "베란다 바닥 탄성 코트 시공했습니다. 비 오는 날에도 미끄럽지 않고 깔끔해서 만족스럽습니다.",
    adminReply: "",
    adminReplyDate: "",
  },
  {
    name: "오수연",
    rating: 5,
    serviceType: "줄눈 시공",
    content: "주방 타일 줄눈 시공을 받았는데 시공 전후 차이가 정말 확연해요. 줄눈 하나만 바꿔도 분위기가 완전히 달라지네요.",
    adminReply: "감사합니다! 줄눈은 관리가 쉽도록 방오 코팅도 함께 적용되었습니다. 유지 관리 팁은 공지를 참고해 주세요.",
    adminReplyDate: "2025-03-08",
  },
  {
    name: "윤재호",
    rating: 5,
    serviceType: "나노 코팅",
    content: "화장실 유리와 거울에 나노 코팅을 적용했는데, 물때 자국이 거의 생기지 않아서 청소 시간이 반으로 줄었습니다.",
    adminReply: "",
    adminReplyDate: "",
  },
  {
    name: "송하린",
    rating: 4,
    serviceType: "입주 청소",
    content: "지인 추천으로 이용했는데 기대 이상이었어요. 특히 창틀이랑 환풍구 먼지까지 깔끔하게 처리해 주셔서 감사했습니다.",
    adminReply: "추천해 주신 지인분과 함께 감사드립니다! 재이용 시 추천인 할인도 적용됩니다.",
    adminReplyDate: "2025-03-05",
  },
];

export default function ReviewsPage() {
  const router = useRouter();
  const { isLoggedIn, user, addReview, userReviews } = useAuthStore();

  /* ── DB에서 로드한 후기 데이터 ── */
  const [dbReviews, setDbReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        const mapped: ReviewData[] = data
          .filter((r: { visible: boolean }) => r.visible)
          .map((r: { id: string; customerName: string; rating: number; serviceType: string; content: string; adminReply: string; adminReplyDate: string }) => ({
            id: r.id,
            name: r.customerName,
            rating: r.rating,
            serviceType: r.serviceType,
            content: r.content,
            adminReply: r.adminReply,
            adminReplyDate: r.adminReplyDate,
          }));
        setDbReviews(mapped);
      })
      .catch(() => {});
  }, []);

  /* ── 현재 선택된 필터 탭 상태 ── */
  const [activeFilter, setActiveFilter] = useState("전체");
  /* ── 선택된 후기 (상세 모달용) ── */
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  /* ── 후기 작성 모달 상태 ── */
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeRating, setWriteRating] = useState(5);
  const [writeService, setWriteService] = useState("입주 청소");
  const [writeContent, setWriteContent] = useState("");
  const [writeError, setWriteError] = useState("");
  const [writeSuccess, setWriteSuccess] = useState(false);

  /* ── 사용자 작성 후기를 ReviewData 형태로 변환 ── */
  const userReviewsConverted: ReviewData[] = userReviews.map((r) => ({
    name: user?.nickname || "사용자",
    rating: r.rating,
    serviceType: r.serviceType,
    content: r.content,
    adminReply: "",
    adminReplyDate: "",
  }));

  /* ── 전체 리뷰 = 사용자 작성 + DB 데이터 ── */
  const combinedReviews = [...userReviewsConverted, ...dbReviews];

  /* ── 선택된 탭에 따라 리뷰 필터링 ── */
  const filteredReviews =
    activeFilter === "전체"
      ? combinedReviews
      : combinedReviews.filter((r) => r.serviceType === activeFilter);

  /* ── 후기 작성 버튼 클릭 ── */
  const handleWriteClick = () => {
    if (!isLoggedIn) {
      router.push("/auth");
      return;
    }
    setShowWriteModal(true);
    setWriteRating(5);
    setWriteService("입주 청소");
    setWriteContent("");
    setWriteError("");
    setWriteSuccess(false);
  };

  /* ── 후기 제출 ── */
  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeContent.trim()) {
      setWriteError("후기 내용을 작성해주세요.");
      return;
    }
    if (writeContent.trim().length < 10) {
      setWriteError("후기는 최소 10자 이상 작성해주세요.");
      return;
    }

    addReview({
      serviceType: writeService,
      rating: writeRating,
      content: writeContent.trim(),
    });

    setWriteSuccess(true);
    setTimeout(() => {
      setShowWriteModal(false);
      setWriteSuccess(false);
    }, 2000);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
       *  페이지 히어로 — 후기 타이틀 배너
       * ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">Reviews</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
              고객 후기
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">
              더케어의 서비스를 경험하신 고객님들의 생생한 이야기
            </p>

            {/* 후기 작성 버튼 */}
            <button
              onClick={handleWriteClick}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-cyan-dark text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
            >
              <PenLine size={16} />
              후기 작성하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  필터 탭 + 리뷰 카드 그리드
       * ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── 필터 탭 바 ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === tab
                    ? "bg-navy text-white shadow-lg shadow-navy/20"
                    : "bg-white text-navy/60 hover:text-navy border border-slate-light/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* ── 리뷰 카드 그리드 (클릭 시 상세 모달) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                onClick={() => setSelectedReview(review)}
                className="cursor-pointer"
              >
                <ReviewCard {...review} index={index} />
              </div>
            ))}
          </div>

          {/* 필터 결과 없을 때 안내 */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-navy/40 text-lg">해당 서비스의 후기가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
       *  후기 상세 모달 (관리자 답변 표시)
       * ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedReview && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            {/* 모달 본체 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-navy">후기 상세</h3>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 후기 내용 */}
                <div className="p-6">
                  {/* 고객 정보 + 별점 */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-bold text-navy">{selectedReview.name}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-cyan/10 text-cyan-dark rounded-full">
                        {selectedReview.serviceType}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= selectedReview.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* 후기 본문 */}
                  <p className="text-navy/70 text-sm leading-relaxed mb-6">
                    &ldquo;{selectedReview.content}&rdquo;
                  </p>

                  {/* ── 관리자 답변 영역 ── */}
                  {selectedReview.adminReply ? (
                    <div className="bg-cyan/5 border border-cyan/15 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center">
                          <MessageCircle size={12} className="text-cyan-dark" />
                        </div>
                        <span className="text-sm font-semibold text-navy">더케어</span>
                        {selectedReview.adminReplyDate && (
                          <span className="text-xs text-slate-400 ml-auto">
                            {selectedReview.adminReplyDate}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-navy/70 leading-relaxed">
                        {selectedReview.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-sm text-slate-400">
                      아직 답변이 작성되지 않았습니다.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
       *  후기 작성 모달 (로그인 시에만 표시)
       * ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showWriteModal && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWriteModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            {/* 모달 본체 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {writeSuccess ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-navy mb-2">후기가 등록되었습니다!</h3>
                    <p className="text-navy/60 text-sm">
                      포인트 <span className="text-cyan font-bold">5,000P</span>가 적립되었습니다.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 모달 헤더 */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-navy">후기 작성</h3>
                      <button
                        onClick={() => setShowWriteModal(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* 폼 */}
                    <form onSubmit={handleWriteSubmit} className="p-6 space-y-5">
                      {/* 별점 선택 */}
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">별점</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setWriteRating(s)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={28}
                                className={
                                  s <= writeRating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 서비스 유형 */}
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">서비스 유형</label>
                        <select
                          value={writeService}
                          onChange={(e) => setWriteService(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan"
                        >
                          {FILTER_TABS.filter((t) => t !== "전체").map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* 후기 내용 */}
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">후기 내용</label>
                        <textarea
                          value={writeContent}
                          onChange={(e) => setWriteContent(e.target.value)}
                          placeholder="서비스 이용 후기를 작성해주세요 (최소 10자)"
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan resize-none"
                        />
                      </div>

                      {/* 포인트 적립 안내 */}
                      <div className="bg-cyan/5 border border-cyan/15 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-sm text-navy/70">
                          <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          후기 작성 시 <span className="text-cyan font-bold">5,000P</span> 적립!
                        </div>
                      </div>

                      {/* 에러 메시지 */}
                      {writeError && (
                        <p className="text-red-500 text-sm text-center">{writeError}</p>
                      )}

                      {/* 제출 버튼 */}
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-cyan to-cyan-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
                      >
                        후기 등록하기
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
