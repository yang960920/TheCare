/** app/admin/academy/page.tsx — 아카데미 과정 관리 */
"use client";
import { useState } from "react";
import { useAdminStore, AcademyCourse } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import SlidePanel from "@/components/admin/SlidePanel";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";

export default function AdminAcademyPage() {
  const { courses, addCourse, updateCourse, deleteCourse, toggleCourseVisibility, addToast } = useAdminStore();
  const [editing, setEditing] = useState<AcademyCourse | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const emptyForm = { title: "", duration: "", price: "", capacity: 15, description: "", imageUrl: "", visible: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setIsNew(true); setEditing(null); setForm(emptyForm); };
  const openEdit = (c: AcademyCourse) => { setIsNew(false); setEditing(c); setForm({ title: c.title, duration: c.duration, price: c.price, capacity: c.capacity, description: c.description, imageUrl: c.imageUrl, visible: c.visible }); };

  const handleSave = () => {
    if (isNew) {
      addCourse(form as Omit<AcademyCourse, "id">);
      addToast("과정이 등록되었습니다.");
    } else if (editing) {
      updateCourse(editing.id, form);
      addToast("과정이 수정되었습니다.");
    }
    setEditing(null); setIsNew(false);
  };

  return (
    <>
      <PageHeader title="아카데미 관리" description="수강 과정을 등록하고 관리합니다">
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">
          <Plus size={16} /> 과정 등록
        </button>
      </PageHeader>

      {/* 과정 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <div key={c.id} className={`bg-white rounded-xl border p-5 ${c.visible ? "border-slate-200" : "border-dashed border-slate-300 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <GraduationCap size={20} className="text-cyan-600" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Pencil size={14} /></button>
                <button onClick={() => setDeleteTarget(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{c.title}</h3>
            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{c.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{c.duration}</span>
              <span className="font-semibold text-cyan-600">{c.price}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">정원 {c.capacity}명</span>
              <ToggleSwitch checked={c.visible} onChange={() => toggleCourseVisibility(c.id)} />
            </div>
          </div>
        ))}
      </div>

      <SlidePanel isOpen={isNew || !!editing} onClose={() => { setEditing(null); setIsNew(false); }} title={isNew ? "과정 등록" : "과정 수정"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">과정명</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">수강 기간</label><input type="text" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">수강료</label><input type="text" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">정원</label><input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">과정 설명</label><textarea rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500 resize-none" /></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">노출 여부</span><ToggleSwitch checked={form.visible} onChange={() => setForm({...form, visible: !form.visible})} /></div>
          <button onClick={handleSave} className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">저장</button>
        </div>
      </SlidePanel>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if(deleteTarget) { deleteCourse(deleteTarget); addToast("과정이 삭제되었습니다."); }}} />
    </>
  );
}
