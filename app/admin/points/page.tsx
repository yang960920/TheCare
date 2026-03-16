/** app/admin/points/page.tsx — 포인트·이벤트 관리 */
"use client";
import { useState } from "react";
import { useAdminStore, PointEvent } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

export default function AdminPointsPage() {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventVisibility, pointPolicy, updatePointPolicy, addToast } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PointEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [policyText, setPolicyText] = useState(pointPolicy.text);
  const emptyForm = { title: "", description: "", startDate: "", endDate: "", bgColor: "#00D4FF", visible: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (e: PointEvent) => { setEditing(e); setForm({ title: e.title, description: e.description, startDate: e.startDate, endDate: e.endDate, bgColor: e.bgColor, visible: e.visible }); setShowForm(true); };

  const handleSave = () => {
    if (editing) { updateEvent(editing.id, form); addToast("이벤트가 수정되었습니다."); }
    else { addEvent(form as Omit<PointEvent, "id">); addToast("이벤트가 등록되었습니다."); }
    setShowForm(false);
  };

  const handleSavePolicy = () => { updatePointPolicy(policyText); addToast("적립 정책이 저장되었습니다."); };

  const columns: Column<PointEvent>[] = [
    { key: "title", label: "배너 제목", render: (e) => <span className="font-medium text-slate-900">{e.title}</span> },
    { key: "period", label: "기간", render: (e) => <span className="text-slate-500 text-xs">{e.startDate} ~ {e.endDate}</span> },
    { key: "color", label: "컬러", render: (e) => <div className="w-6 h-6 rounded-md border border-slate-200" style={{ backgroundColor: e.bgColor }} />, className: "w-16" },
    { key: "visible", label: "노출", render: (e) => <ToggleSwitch checked={e.visible} onChange={() => toggleEventVisibility(e.id)} />, className: "w-20" },
    { key: "actions", label: "", render: (e) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={14} /></button>
        <button onClick={() => setDeleteTarget(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
      </div>
    ), className: "w-20" },
  ];

  return (
    <>
      <PageHeader title="포인트·이벤트 관리" description="이벤트 배너 관리 및 포인트 적립 정책을 설정합니다">
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors"><Plus size={16} /> 배너 등록</button>
      </PageHeader>

      <DataTable columns={columns} data={events} />

      {/* 포인트 적립 정책 편집 */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">포인트 적립 정책</h3>
        <textarea rows={5} value={policyText} onChange={(e) => setPolicyText(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none mb-3" />
        <button onClick={handleSavePolicy} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"><Save size={14} /> 정책 저장</button>
      </div>

      {/* 배너 등록/수정 모달 */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-bold text-slate-900">{editing ? "배너 수정" : "배너 등록"}</h3><button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button></div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">제목</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">설명</label><textarea rows={2} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">시작일</label><input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">종료일</label><input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">배경 컬러</label><input type="color" value={form.bgColor} onChange={(e) => setForm({...form, bgColor: e.target.value})} className="w-16 h-10 rounded-lg border border-slate-200 cursor-pointer" /></div>
                  <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">노출 여부</span><ToggleSwitch checked={form.visible} onChange={() => setForm({...form, visible: !form.visible})} /></div>
                  <button onClick={handleSave} className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">저장</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if(deleteTarget) { deleteEvent(deleteTarget); addToast("이벤트가 삭제되었습니다."); }}} />
    </>
  );
}
