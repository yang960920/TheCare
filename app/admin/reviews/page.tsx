/** app/admin/reviews/page.tsx — 후기 관리 (관리자 답변 기능 포함)
 *
 *  구성:
 *  - 상단 필터 (서비스별 / 별점별)
 *  - 후기 목록 테이블 (고객명/서비스/별점/내용/등록일/답변상태/노출/삭제)
 *  - 신규 후기 등록 모달
 *  - 관리자 답변 작성 모달
 */
"use client";
import { useState } from "react";
import { useAdminStore, ReviewItem } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MessageCircle, Star, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

/* ── 필터 옵션 ── */
const SERVICE_FILTERS = ["전체", "줄눈 시공", "입주 청소", "탄성 코트", "나노 코팅", "새집증후군"];
const RATING_FILTERS = ["전체", "5점", "4점", "3점", "2점", "1점"];

export default function AdminReviewsPage() {
  const { reviews, addReview, deleteReview, toggleReviewVisibility, setAdminReply, addToast } = useAdminStore();

  const [serviceFilter, setServiceFilter] = useState("전체");
  const [ratingFilter, setRatingFilter] = useState("전체");
  const [showAddModal, setShowAddModal] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* 신규 후기 폼 */
  const [newReview, setNewReview] = useState({
    customerName: "", serviceType: "입주 청소", rating: 5, content: "", imageUrl: "",
  });

  /* ── 필터 적용 ── */
  const filtered = reviews.filter((r) => {
    if (serviceFilter !== "전체" && r.serviceType !== serviceFilter) return false;
    if (ratingFilter !== "전체" && r.rating !== parseInt(ratingFilter)) return false;
    return true;
  });

  /* ── 답변 모달 열기 ── */
  const openReply = (review: ReviewItem) => {
    setReplyTarget(review);
    setReplyText(review.adminReply);
  };

  /* ── 답변 저장 ── */
  const handleSaveReply = async () => {
    if (replyTarget) {
      try {
        await setAdminReply(replyTarget.id, replyText);
        addToast("답변이 저장되었습니다.");
        setReplyTarget(null);
      } catch {
        addToast("답변 저장 실패", "error");
      }
    }
  };

  /* ── 신규 후기 등록 ── */
  const handleAddReview = async () => {
    try {
      await addReview({
        ...newReview,
        createdAt: new Date().toISOString().split("T")[0],
        visible: true,
        adminReply: "",
        adminReplyDate: "",
      });
      addToast("후기가 등록되었습니다.");
      setShowAddModal(false);
      setNewReview({ customerName: "", serviceType: "입주 청소", rating: 5, content: "", imageUrl: "" });
    } catch {
      addToast("등록 실패", "error");
    }
  };

  /* ── 테이블 컬럼 정의 ── */
  const columns: Column<ReviewItem>[] = [
    { key: "name", label: "고객명", render: (r) => <span className="font-medium text-slate-900">{r.customerName}</span>, className: "w-24" },
    { key: "service", label: "서비스", render: (r) => <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-100 rounded-full">{r.serviceType}</span> },
    { key: "rating", label: "별점", render: (r) => (
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => <Star key={s} size={12} className={s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />)}
      </div>
    ), className: "w-24" },
    { key: "content", label: "내용", render: (r) => <span className="text-slate-600 line-clamp-1">{r.content}</span> },
    { key: "date", label: "등록일", render: (r) => <span className="text-slate-400 text-xs">{formatDate(r.createdAt)}</span>, className: "w-24" },
    { key: "reply", label: "답변", render: (r) => (
      <button onClick={() => openReply(r)} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${r.adminReply ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
        <MessageCircle size={12} />
        {r.adminReply ? "답변완료" : "답변하기"}
      </button>
    ), className: "w-24" },
    { key: "visible", label: "노출", render: (r) => <ToggleSwitch checked={r.visible} onChange={() => toggleReviewVisibility(r.id)} />, className: "w-16" },
    { key: "del", label: "", render: (r) => (
      <button onClick={() => setDeleteTarget(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
        <Trash2 size={14} />
      </button>
    ), className: "w-10" },
  ];

  return (
    <>
      <PageHeader title="후기 관리" description="고객 후기를 관리하고 답변을 작성합니다">
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">
          <Plus size={16} />
          후기 등록
        </button>
      </PageHeader>

      {/* ── 필터 바 ── */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">서비스:</span>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-gold">
            {SERVICE_FILTERS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">별점:</span>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-gold">
            {RATING_FILTERS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      {/* ── 삭제 확인 모달 ── */}
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { deleteReview(deleteTarget); addToast("후기가 삭제되었습니다."); } }} />

      {/* ── 신규 후기 등록 모달 ── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-900">후기 등록</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">고객명</label>
                    <input type="text" value={newReview.customerName} onChange={(e) => setNewReview({...newReview, customerName: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">서비스</label>
                      <select value={newReview.serviceType} onChange={(e) => setNewReview({...newReview, serviceType: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold">
                        {SERVICE_FILTERS.filter(f => f !== "전체").map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">별점</label>
                      <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold">
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}점</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">후기 내용</label>
                    <textarea rows={3} value={newReview.content} onChange={(e) => setNewReview({...newReview, content: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold resize-none" />
                  </div>
                  <button onClick={handleAddReview} className="w-full py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">등록</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── 관리자 답변 작성 모달 ── */}
      <AnimatePresence>
        {replyTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReplyTarget(null)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">관리자 답변</h3>
                  <button onClick={() => setReplyTarget(null)} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                </div>
                {/* 원본 후기 표시 */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-slate-900">{replyTarget.customerName}</span>
                    <span className="text-xs text-slate-400">{replyTarget.serviceType}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= replyTarget.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />)}</div>
                  </div>
                  <p className="text-sm text-slate-600">&ldquo;{replyTarget.content}&rdquo;</p>
                </div>
                {/* 답변 입력 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">답변 내용</label>
                  <textarea rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="고객에게 전달할 답변을 작성하세요" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none" />
                </div>
                <button onClick={handleSaveReply} className="w-full mt-4 py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">답변 저장</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
