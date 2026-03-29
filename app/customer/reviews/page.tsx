/** app/customer/reviews/page.tsx — 후기 게시판 (사용자용) */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";
import { ChevronDown, Star } from "lucide-react";

interface ReviewItem {
  id: string;
  customerName: string;
  serviceType: string;
  rating: number;
  content: string;
  imageUrl: string;
  adminReply: string;
  adminReplyDate: string;
  visible: boolean;
  createdAt: string;
}

/** 이름 마스킹: 김서영 → 김*영, 이미경 → 이*경, 정민수 → 정*수 등 */
function maskName(name: string): string {
  if (name.length <= 1) return "*";
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* 페이징 상태 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  /* 글쓰기 모달 폼 상태 */
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [serviceType, setServiceType] = useState("입주청소");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    if (!customerName || !content) {
      alert("이름과 후기 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          serviceType,
          rating,
          content,
          imageUrl,
          visible: false // API에서 기본 false 처리되지만 명시적으로 포함
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("후기 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: ReviewItem[]) => {
        // visible === true인 후기만 렌더링
        setReviews(data.filter((r) => r.visible));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Customer Reviews</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">고객 후기</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">더케어를 이용하신 고객님들의 생생한 후기를 확인하세요</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 후기 게시판 목록 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-navy">고객 후기 목록</h2>
            <button
              onClick={() => { setShowForm(true); setSubmitted(false); setCustomerName(""); setContent(""); setImageUrl(""); setRating(5); }}
              className="px-5 py-2 md:px-6 md:py-2.5 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors text-sm"
            >
              + 후기 작성하기
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-navy/40">후기를 불러오는 중...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-navy/40">등록된 후기가 없습니다.</div>
          ) : (
            <>
              <div className="space-y-4">
                {reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((review, i) => (
                  <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-cream rounded-xl gold-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(expanded === review.id ? null : review.id)}
                    className="w-full text-left px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 transition-colors hover:bg-gold/5"
                  >
                    {/* 상단: 이름 & 별점 & 시공종류 */}
                    <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
                      <span className="font-semibold text-navy flex-shrink-0 w-16">{maskName(review.customerName)}</span>
                      <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded font-bold flex-shrink-0">
                        {review.serviceType}
                      </span>
                      {/* 별점 */}
                      <div className="flex items-center gap-0.5 ml-auto md:ml-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-gold fill-gold" : "text-slate-300 fill-slate-300"}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 날짜 & 토글 아이콘 */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
                      <span className="text-navy/40 text-xs flex-shrink-0">
                        {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-navy/30 transition-transform ${expanded === review.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* 상세 내용 (아코디언) */}
                  <AnimatePresence>
                    {expanded === review.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-gold/10">
                          {review.imageUrl && (
                            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-4 bg-slate-100">
                              <Image src={review.imageUrl} alt="후기 이미지" fill className="object-cover" />
                            </div>
                          )}
                          <div className="text-navy/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {review.content}
                          </div>

                          {/* 관리자 답변 */}
                          {review.adminReply && (
                            <div className="mt-5 p-4 bg-white rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-navy text-sm">더케어 관리자</span>
                                {review.adminReplyDate && (
                                  <span className="text-xs text-navy/40">{review.adminReplyDate}</span>
                                )}
                              </div>
                              <p className="text-sm text-navy/60 leading-relaxed whitespace-pre-wrap">
                                {review.adminReply}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(reviews.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>

      {/* ═══ 후기 작성 폼 모달 ═══ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8">
            {!submitted ? (
              <>
                <h2 className="font-bold text-xl text-navy mb-5 border-b pb-3">
                  고객 후기 작성
                </h2>
                <div className="bg-blue-50/50 p-4 rounded-lg mb-5 border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium whitespace-pre-wrap leading-relaxed">
                    - 작성해주신 후기는 <span className="text-gold font-bold">관리자 승인 후</span> 게시판에 노출됩니다.{"\n"}
                    - 소중한 후기를 작성해주신 뒤, <span className="font-bold border-b border-blue-800">포인트 게시판</span>을 통해 적립을 별도 신청해주세요!
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">작성자 이름 *</label>
                    <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold focus:border-gold outline-none" placeholder="홍길동" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">시공 종류 *</label>
                      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold focus:border-gold outline-none bg-white">
                        <option value="입주청소">입주청소</option>
                        <option value="이사청소">이사청소</option>
                        <option value="새집증후군">새집증후군</option>
                        <option value="줄눈시공">줄눈시공</option>
                        <option value="나노코팅">나노코팅</option>
                        <option value="탄성코트">탄성코트</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">만족도 별점 *</label>
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold focus:border-gold outline-none bg-white font-medium text-gold">
                        <option value="5">⭐⭐⭐⭐⭐ (5.0)</option>
                        <option value="4">⭐⭐⭐⭐ (4.0)</option>
                        <option value="3">⭐⭐⭐ (3.0)</option>
                        <option value="2">⭐⭐ (2.0)</option>
                        <option value="1">⭐ (1.0)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">후기 내용 *</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold focus:border-gold outline-none resize-none" placeholder="솔직한 서비스 이용 후기를 남겨주세요." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">사진 첨부 (URL, 선택사항)</label>
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="url" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold focus:border-gold outline-none" placeholder="https://..." />
                    <p className="text-[10px] text-navy/40 mt-1">* 현재 시스템상 이미지 URL 입력만 지원됩니다.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setShowForm(false)} disabled={submitting} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">닫기</button>
                  <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 text-sm font-bold bg-navy text-white rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50">
                    {submitting ? "등록 중..." : "후기 등록하기"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 border border-blue-100">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-navy mb-3">후기가 성공적으로 등록되었습니다!</h3>
                <p className="text-navy/60 text-sm md:text-base mb-6 leading-relaxed">
                  관리자 확인 후 게시판에 노출될 예정입니다.<br/>
                  소중한 후기를 작성해 주셔서 감사합니다.
                </p>
                <div className="bg-gold/10 rounded-xl p-4 mb-8 border border-gold/20">
                  <p className="text-gold font-bold text-sm mb-1">💡 포인트 적립 안내</p>
                  <p className="text-navy/70 text-xs">포인트 게시판에서 적립 신청을 해주시면 확인 후 지급해드립니다.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-full py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy-light transition-colors">확인</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
