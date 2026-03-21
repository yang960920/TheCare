/** app/admin/hero/page.tsx — 히어로 섹션 관리
 *
 *  구성:
 *  - 좌측: 편집 폼 (헤드라인/서브카피/CTA/배경 이미지 URL)
 *  - 우측: 실시간 미리보기 패널
 *  - 저장 버튼 (UI + 토스트 피드백)
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAdminStore } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import { Save, Eye } from "lucide-react";

export default function AdminHeroPage() {
  const { hero, updateHero, addToast } = useAdminStore();
  const [form, setForm] = useState({ ...hero });

  // loadAll() 완료 후 폼 상태 동기화
  useEffect(() => {
    if (hero.headline) setForm({ ...hero });
  }, [hero]);

  /** 폼 필드 변경 핸들러 */
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /** 저장 버튼 클릭 */
  const handleSave = async () => {
    try {
      await updateHero(form);
      addToast("히어로 섹션이 저장되었습니다.");
    } catch {
      addToast("저장 실패. 다시 시도해주세요.", "error");
    }
  };

  return (
    <>
      <PageHeader title="히어로 관리" description="메인 페이지 상단 히어로 섹션을 편집합니다">
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">
          <Save size={16} />
          저장
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── 편집 폼 ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">메인 헤드라인</label>
            <input type="text" value={form.headline} onChange={(e) => handleChange("headline", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">서브 카피</label>
            <textarea rows={3} value={form.subCopy} onChange={(e) => handleChange("subCopy", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA 버튼 1 텍스트</label>
              <input type="text" value={form.cta1Text} onChange={(e) => handleChange("cta1Text", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA 버튼 1 링크</label>
              <input type="text" value={form.cta1Link} onChange={(e) => handleChange("cta1Link", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA 버튼 2 텍스트</label>
              <input type="text" value={form.cta2Text} onChange={(e) => handleChange("cta2Text", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CTA 버튼 2 링크</label>
              <input type="text" value={form.cta2Link} onChange={(e) => handleChange("cta2Link", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">배경 이미지 URL</label>
            <input type="text" value={form.bgImageUrl} onChange={(e) => handleChange("bgImageUrl", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
          </div>
        </div>

        {/* ── 실시간 미리보기 ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50">
            <Eye size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">미리보기</span>
          </div>
          <div className="relative h-80 sm:h-96 overflow-hidden">
            {form.bgImageUrl && (
              <Image src={form.bgImageUrl} alt="히어로 미리보기" fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/90 via-[#0A2540]/70 to-[#0A2540]/50" />
            <div className="absolute inset-0 flex items-center p-8">
              <div className="max-w-md">
                <h2 className="text-white font-bold text-xl sm:text-2xl mb-3 leading-tight whitespace-pre-line">{form.headline}</h2>
                <p className="text-white/70 text-sm mb-5 whitespace-pre-line">{form.subCopy}</p>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-[#00D4FF] text-white text-xs font-bold rounded-lg">{form.cta1Text}</span>
                  <span className="px-4 py-2 bg-white/10 border border-white/20 text-white text-xs font-medium rounded-lg">{form.cta2Text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
