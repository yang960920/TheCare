/** app/admin/popup/page.tsx — 팝업·공지 관리 */
"use client";
import { useState } from "react";
import { useAdminStore, PopupItem } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import SlidePanel from "@/components/admin/SlidePanel";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminPopupPage() {
  const { popups, addPopup, updatePopup, deletePopup, togglePopupVisibility, addToast } = useAdminStore();
  const [editing, setEditing] = useState<PopupItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const emptyForm = { title: "", content: "", imageUrl: "", linkUrl: "", startDate: "", endDate: "", position: "center", visible: true, hideToday: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setIsNew(true); setEditing(null); setForm(emptyForm); };
  const openEdit = (p: PopupItem) => { setIsNew(false); setEditing(p); setForm({ title: p.title, content: p.content, imageUrl: p.imageUrl, linkUrl: p.linkUrl, startDate: p.startDate, endDate: p.endDate, position: p.position, visible: p.visible, hideToday: p.hideToday }); };

  const handleSave = () => {
    if (isNew) { addPopup(form as Omit<PopupItem, "id">); addToast("팝업이 등록되었습니다."); }
    else if (editing) { updatePopup(editing.id, form); addToast("팝업이 수정되었습니다."); }
    setEditing(null); setIsNew(false);
  };

  const columns: Column<PopupItem>[] = [
    { key: "title", label: "제목", render: (p) => <span className="font-medium text-slate-900">{p.title}</span> },
    { key: "period", label: "노출 기간", render: (p) => <span className="text-slate-500 text-xs">{p.startDate} ~ {p.endDate}</span> },
    { key: "position", label: "위치", render: (p) => <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{p.position}</span>, className: "w-20" },
    { key: "hideToday", label: "오늘 안 보기", render: (p) => <span className="text-xs text-slate-400">{p.hideToday ? "켜짐" : "꺼짐"}</span>, className: "w-24" },
    { key: "visible", label: "노출", render: (p) => <ToggleSwitch checked={p.visible} onChange={() => togglePopupVisibility(p.id)} />, className: "w-20" },
    { key: "actions", label: "", render: (p) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={14} /></button>
        <button onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
      </div>
    ), className: "w-20" },
  ];

  return (
    <>
      <PageHeader title="팝업·공지 관리" description="홈페이지 팝업과 공지사항을 관리합니다">
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors"><Plus size={16} /> 팝업 등록</button>
      </PageHeader>

      <DataTable columns={columns} data={popups} />

      <SlidePanel isOpen={isNew || !!editing} onClose={() => { setEditing(null); setIsNew(false); }} title={isNew ? "팝업 등록" : "팝업 수정"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">제목</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">내용</label><textarea rows={4} value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">이미지 URL</label><input type="text" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">링크 URL</label><input type="text" value={form.linkUrl} onChange={(e) => setForm({...form, linkUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">시작일</label><input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">종료일</label><input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">노출 위치</label>
            <select value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500">
              <option value="center">가운데</option><option value="top">상단 배너</option><option value="bottom">하단 배너</option>
            </select>
          </div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">오늘 하루 안 보기</span><ToggleSwitch checked={form.hideToday} onChange={() => setForm({...form, hideToday: !form.hideToday})} /></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">노출 여부</span><ToggleSwitch checked={form.visible} onChange={() => setForm({...form, visible: !form.visible})} /></div>
          <button onClick={handleSave} className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">저장</button>
        </div>
      </SlidePanel>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if(deleteTarget) { deletePopup(deleteTarget); addToast("팝업이 삭제되었습니다."); }}} />
    </>
  );
}
