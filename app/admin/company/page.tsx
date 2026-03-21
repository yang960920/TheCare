/** app/admin/company/page.tsx — 회사 정보 관리 */
"use client";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import { Save, Building2 } from "lucide-react";

export default function AdminCompanyPage() {
  const { company, updateCompany, addToast } = useAdminStore();
  const [form, setForm] = useState({ ...company });

  // loadAll() 완료 후 폼 상태 동기화
  useEffect(() => {
    if (company.name) setForm({ ...company });
  }, [company]);

  const handleSave = async () => {
    try {
      await updateCompany(form);
      addToast("회사 정보가 저장되었습니다.");
    } catch {
      addToast("저장 실패. 다시 시도해주세요.", "error");
    }
  };

  /** 통계 수치 변경 핸들러 */
  const handleStatChange = (index: number, key: "label" | "value", val: string) => {
    const updated = [...form.stats];
    updated[index] = { ...updated[index], [key]: val };
    setForm({ ...form, stats: updated });
  };

  return (
    <>
      <PageHeader title="회사 정보 관리" description="홈페이지에 노출되는 회사 기본 정보와 통계 수치를 관리합니다">
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">
          <Save size={16} /> 저장
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── 기본 정보 ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={18} className="text-cyan-500" />
            <h3 className="font-semibold text-slate-900">기본 정보</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">회사명</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">대표자명</label><input type="text" value={form.ceo} onChange={(e) => setForm({...form, ceo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">사업자번호</label><input type="text" value={form.businessNumber} onChange={(e) => setForm({...form, businessNumber: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">주소</label><input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">대표 전화</label><input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">이메일</label><input type="text" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" /></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">※ 이 정보는 푸터 및 견적문의 페이지에 자동 반영됩니다.</p>
        </div>

        {/* ── 홈 노출 통계 수치 ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-5">홈페이지 노출 통계 수치</h3>
          <div className="space-y-4">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">항목명</label>
                  <input type="text" value={stat.label} onChange={(e) => handleStatChange(i, "label", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-slate-700 mb-1">수치</label>
                  <input type="text" value={stat.value} onChange={(e) => handleStatChange(i, "value", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-cyan-500" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">※ 홈페이지 &apos;숫자로 보는 더케어&apos; 섹션에 표시됩니다.</p>
        </div>
      </div>
    </>
  );
}
