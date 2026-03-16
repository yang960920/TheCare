/** app/reviews/page.tsx — 고객 후기 페이지 (관리자 답변 표시 기능 포함)
 *
 *  섹션 구성:
 *  1. 페이지 히어로 — 후기 타이틀 배너
 *  2. 필터 탭 (전체 / 서비스별)
 *  3. 리뷰 카드 그리드
 *  4. 후기 클릭 시 상세 모달 (관리자 답변 표시)
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "@/components/ui/ReviewCard";
import { X, Star, MessageCircle } from "lucide-react";

/* ── 필터 탭 목록 ── */
const FILTER_TABS = ["전체", "줄눈 시공", "입주 청소", "탄성 코트", "나노 코팅", "새집증후군"];

/* ── 후기 데이터 타입 (관리자 답변 포함) ── */
interface ReviewData {
  name: string;
  rating: number;
  serviceType: string;
  content: string;
  adminReply?: string;        // 관리자 답변 내용
  adminReplyDate?: string;    // 관리자 답변 작성일
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
  /* ── 현재 선택된 필터 탭 상태 ── */
  const [activeFilter, setActiveFilter] = useState("전체");
  /* ── 선택된 후기 (상세 모달용) ── */
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  /* ── 선택된 탭에 따라 리뷰 필터링 ── */
  const filteredReviews =
    activeFilter === "전체"
      ? ALL_REVIEWS
      : ALL_REVIEWS.filter((r) => r.serviceType === activeFilter);

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
              클린마스터의 서비스를 경험하신 고객님들의 생생한 이야기
            </p>
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
                        <span className="text-sm font-semibold text-navy">클린마스터</span>
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
    </>
  );
}
