/** app/admin/academy/page.tsx — 아카데미 과정 관리 + 수강 신청 목록 */
"use client";
import { useState } from "react";
import { useAdminStore, AcademyCourse, AcademyInquiry } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import SlidePanel from "@/components/admin/SlidePanel";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Pencil, Trash2, GraduationCap, Users } from "lucide-react";

export default function AdminAcademyPage() {
  const { courses, addCourse, updateCourse, deleteCourse, toggleCourseVisibility, academyInquiries, updateAcademyInquiryStatus, addToast } = useAdminStore();
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

  const handleInquiryStatusChange = (id: string, status: AcademyInquiry["status"]) => {
    updateAcademyInquiryStatus(id, status);
    addToast(`상태가 '${status}'(으)로 변경되었습니다.`);
  };

  return (
    <>
      <PageHeader title="아카데미 관리" description="수강 과정을 등록하고 관리합니다">
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">
          <Plus size={16} /> 과정 등록
        </button>
      </PageHeader>

      {/* 과정 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <div key={c.id} className={`bg-white rounded-xl border p-5 ${c.visible ? "border-slate-200" : "border-dashed border-slate-300 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-gold" />
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
              <span className="font-semibold text-gold">{c.price}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">정원 {c.capacity}명</span>
              <ToggleSwitch checked={c.visible} onChange={() => toggleCourseVisibility(c.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── 수강 신청 목록 ── */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-gold" />
          <h2 className="text-lg font-bold text-slate-900">수강 신청 목록</h2>
          <span className="ml-2 px-2 py-0.5 bg-gold/10 text-gold text-xs font-bold rounded-full">{academyInquiries.length}</span>
        </div>

        {academyInquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-400 text-sm">아직 수강 신청이 없습니다</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">접수일</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">고객명</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">연락처</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">과정</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">메모</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">상태</th>
                </tr>
              </thead>
              <tbody>
                {academyInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">{inq.createdAt}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{inq.customerName}</td>
                    <td className="px-4 py-3 text-slate-600">{inq.phone}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold-dark rounded-full">{inq.courseTitle}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">{inq.memo || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as AcademyInquiry["status"])}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-gold bg-white"
                      >
                        <option>미확인</option><option>확인</option><option>완료</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlidePanel isOpen={isNew || !!editing} onClose={() => { setEditing(null); setIsNew(false); }} title={isNew ? "과정 등록" : "과정 수정"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">과정명</label><input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">수강 기간</label><input type="text" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">수강료</label><input type="text" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">정원</label><input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">과정 설명</label><textarea rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-gold resize-none" /></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">노출 여부</span><ToggleSwitch checked={form.visible} onChange={() => setForm({...form, visible: !form.visible})} /></div>
          <button onClick={handleSave} className="w-full py-2.5 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">저장</button>
        </div>
      </SlidePanel>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { if(deleteTarget) { deleteCourse(deleteTarget); addToast("과정이 삭제되었습니다."); }}} />
    </>
  );
}
