/** app/admin/services/page.tsx — 서비스 카드 관리 */
"use client";
import { useState } from "react";
import { useAdminStore, ServiceItem } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import SlidePanel from "@/components/admin/SlidePanel";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import { GripVertical, Pencil } from "lucide-react";

export default function AdminServicesPage() {
  const { services, updateService, toggleServiceVisibility, addToast } = useAdminStore();
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", visible: true });

  const openEdit = (svc: ServiceItem) => {
    setEditing(svc);
    setForm({ name: svc.name, description: svc.description, imageUrl: svc.imageUrl, visible: svc.visible });
  };

  const handleSave = async () => {
    if (editing) {
      try {
        await updateService(editing.id, form);
        addToast("서비스 정보가 저장되었습니다.");
        setEditing(null);
      } catch {
        addToast("저장 실패. 다시 시도해주세요.", "error");
      }
    }
  };

  const columns: Column<ServiceItem>[] = [
    { key: "drag", label: "", render: () => <GripVertical size={16} className="text-slate-300 cursor-grab" />, className: "w-10" },
    { key: "order", label: "#", render: (s) => <span className="text-slate-400 font-mono text-xs">{s.order}</span>, className: "w-12" },
    { key: "name", label: "서비스명", render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
    { key: "summary", label: "요약 설명", render: (s) => <span className="text-slate-500 line-clamp-1">{s.summary}</span> },
    { key: "visible", label: "노출", render: (s) => <ToggleSwitch checked={s.visible} onChange={() => toggleServiceVisibility(s.id)} />, className: "w-20" },
    { key: "action", label: "", render: (s) => (
      <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
        <Pencil size={16} />
      </button>
    ), className: "w-12" },
  ];

  return (
    <>
      <PageHeader title="서비스 관리" description="홈페이지에 노출되는 서비스 카드를 관리합니다" />
      <DataTable columns={columns} data={services} />

      <SlidePanel isOpen={!!editing} onClose={() => setEditing(null)} title="서비스 수정">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">서비스명</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">상세 설명</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">이미지 URL</label>
            <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">노출 여부</span>
            <ToggleSwitch checked={form.visible} onChange={() => setForm({ ...form, visible: !form.visible })} />
          </div>
          <button onClick={handleSave} className="w-full py-3 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">저장</button>
        </div>
      </SlidePanel>
    </>
  );
}
