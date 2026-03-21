/** app/admin/quotes/page.tsx — 견적 문의 수신함 (연락 이력 추적 포함)
 *
 *  구성:
 *  - 문의 목록 테이블 (접수일/고객명/연락처/서비스/면적/상태/연락일)
 *  - 행 클릭 시 상세 모달 (전체 내용 + 연락 날짜 + 메모 입력)
 *  - 상태 변경 드롭다운
 *  - CSV 내보내기 버튼 (UI만)
 */
"use client";
import { useState } from "react";
import { useAdminStore, QuoteInquiry } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Phone, CalendarDays, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminQuotesPage() {
  const { quotes, updateQuoteStatus, updateQuoteContact, addToast } = useAdminStore();
  const [selected, setSelected] = useState<QuoteInquiry | null>(null);
  const [contactDate, setContactDate] = useState("");
  const [contactMemo, setContactMemo] = useState("");

  /** 행 클릭 → 상세 모달 열기 */
  const openDetail = (q: QuoteInquiry) => {
    setSelected(q);
    setContactDate(q.contactDate);
    setContactMemo(q.contactMemo);
  };

  /** 연락 이력 저장 */
  const handleSaveContact = async () => {
    if (selected) {
      try {
        await updateQuoteContact(selected.id, contactDate, contactMemo);
        addToast("연락 이력이 저장되었습니다.");
        setSelected(null);
      } catch {
        addToast("저장 실패. 다시 시도해주세요.", "error");
      }
    }
  };

  /** 상태 변경 (테이블 내 드롭다운) */
  const handleStatusChange = async (id: string, status: QuoteInquiry["status"]) => {
    try {
      await updateQuoteStatus(id, status);
      addToast(`상태가 '${status}'(으)로 변경되었습니다.`);
    } catch {
      addToast("상태 변경 실패", "error");
    }
  };

  const columns: Column<QuoteInquiry>[] = [
    { key: "date", label: "접수일", render: (q) => <span className="text-slate-500 text-xs">{formatDate(q.createdAt)}</span>, className: "w-24" },
    { key: "name", label: "고객명", render: (q) => <span className="font-medium text-slate-900">{q.customerName}</span> },
    { key: "phone", label: "연락처", render: (q) => <span className="text-slate-600">{q.phone}</span> },
    { key: "service", label: "서비스", render: (q) => <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{q.serviceType}</span> },
    { key: "area", label: "면적", render: (q) => <span className="text-slate-500">{q.area}</span>, className: "w-20" },
    { key: "status", label: "상태", render: (q) => (
      <select
        value={q.status}
        onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteInquiry["status"])}
        onClick={(e) => e.stopPropagation()}
        className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-cyan-500 bg-white"
      >
        <option>미확인</option><option>확인</option><option>완료</option>
      </select>
    ), className: "w-24" },
    { key: "contact", label: "연락일", render: (q) => (
      q.contactDate
        ? <span className="text-xs text-emerald-600 flex items-center gap-1"><Phone size={10} />{formatDate(q.contactDate)}</span>
        : <span className="text-xs text-slate-300">미연락</span>
    ), className: "w-24" },
  ];

  return (
    <>
      <PageHeader title="견적 문의 수신함" description="접수된 견적 문의를 확인하고 연락 이력을 관리합니다">
        <button onClick={() => addToast("CSV 내보내기 기능은 준비 중입니다.", "error")} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Download size={16} /> CSV 내보내기
        </button>
      </PageHeader>

      <DataTable columns={columns} data={quotes} onRowClick={openDetail} />

      {/* ── 상세 모달 (문의 내용 + 연락 이력 편집) ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-900">문의 상세</h3>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                </div>

                {/* 고객 정보 */}
                <div className="bg-slate-50 rounded-lg p-4 mb-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{selected.customerName}</span>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <div>📞 {selected.phone}</div>
                    <div>🏠 {selected.area}</div>
                    <div>🔧 {selected.serviceType}</div>
                    <div>📅 {formatDate(selected.createdAt)}</div>
                  </div>
                  {selected.memo && <p className="text-sm text-slate-500 pt-2 border-t border-slate-200">💬 {selected.memo}</p>}
                </div>

                {/* 연락 이력 편집 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarDays size={16} className="text-cyan-500" />
                    연락 이력
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">연락 드린 날짜</label>
                    <input type="date" value={contactDate} onChange={(e) => setContactDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">메모 (상담 내용, 예약 내역 등)</label>
                    <textarea rows={3} value={contactMemo} onChange={(e) => setContactMemo(e.target.value)} placeholder="연락 후 간단한 메모를 남겨주세요" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none" />
                  </div>
                  <button onClick={handleSaveContact} className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">
                    <Save size={14} /> 저장
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
