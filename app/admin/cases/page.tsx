/** app/admin/cases/page.tsx — 시공사례 관리 페이지
 *
 *  기능:
 *  - 서비스 타입별 필터링 탭
 *  - 시공사례 추가/수정/삭제
 *  - Before/After 이미지 파일 업로드 (Blob)
 */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

/* ── 타입 ── */
interface CaseStudy {
  id: string;
  serviceType: string;
  title: string;
  description: string;
  location: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  visible: boolean;
  order: number;
}

/* ── 서비스 타입 탭 정의 ── */
const SERVICE_TABS = [
  { key: "all", label: "전체" },
  { key: "cleaning", label: "입주청소" },
  { key: "grout", label: "줄눈시공" },
  { key: "elasticcoat", label: "탄성코트" },
  { key: "nanocoat", label: "나노코팅" },
  { key: "newsyndrome", label: "새집증후군" },
];

/* ── 빈 폼 초기값 ── */
const EMPTY_FORM = {
  serviceType: "cleaning",
  title: "",
  description: "",
  location: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  visible: true,
  order: 0,
};

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);

  /* ── 데이터 로드 ── */
  const loadCases = async () => {
    try {
      const res = await fetch("/api/cases?all=true");
      const data = await res.json();
      setCases(data);
    } catch { /* empty */ }
  };

  useEffect(() => { loadCases(); }, []);

  /* ── 필터링된 목록 ── */
  const filteredCases = activeTab === "all"
    ? cases
    : cases.filter((c) => c.serviceType === activeTab);

  /* ── 파일 업로드 핸들러 ── */
  const handleFileUpload = async (file: File, type: "before" | "after") => {
    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({
          ...prev,
          [type === "before" ? "beforeImageUrl" : "afterImageUrl"]: data.url,
        }));
      }
    } catch { /* empty */ }
    setUploading(null);
  };

  /* ── 저장 (생성/수정) ── */
  const handleSave = async () => {
    if (!form.title.trim()) return alert("제목을 입력해주세요.");

    try {
      if (editingId) {
        const res = await fetch(`/api/cases/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setCases((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const res = await fetch("/api/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setCases((prev) => [created, ...prev]);
      }
      closeForm();
    } catch { /* empty */ }
  };

  /* ── 삭제 ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/cases/${deleteTarget}`, { method: "DELETE" });
      setCases((prev) => prev.filter((c) => c.id !== deleteTarget));
      setDeleteTarget(null);
    } catch { /* empty */ }
  };

  /* ── 노출 토글 ── */
  const toggleVisibility = async (item: CaseStudy) => {
    try {
      const res = await fetch(`/api/cases/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      const updated = await res.json();
      setCases((prev) => prev.map((c) => (c.id === item.id ? updated : c)));
    } catch { /* empty */ }
  };

  /* ── 수정 모드 진입 ── */
  const openEdit = (item: CaseStudy) => {
    setEditingId(item.id);
    setForm({
      serviceType: item.serviceType,
      title: item.title,
      description: item.description,
      location: item.location,
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      visible: item.visible,
      order: item.order,
    });
    setShowForm(true);
  };

  /* ── 폼 닫기 ── */
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div>
      <PageHeader
        title="시공사례 관리"
        description="서비스별 Before/After 시공사례를 관리합니다"
      />

      {/* ── 서비스 타입 필터 탭 ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-gold text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 추가 버튼 ── */}
      <button
        onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
        className="mb-6 px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors"
      >
        + 시공사례 추가
      </button>

      {/* ── 시공사례 리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl border p-4 ${!item.visible ? "opacity-50" : ""}`}>
            {/* 이미지 */}
            <div className="grid grid-cols-2 gap-2 mb-4 rounded-lg overflow-hidden">
              <div className="relative aspect-[4/3] bg-slate-100">
                {item.beforeImageUrl ? (
                  <Image src={item.beforeImageUrl} alt="Before" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Before</div>
                )}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">BEFORE</div>
              </div>
              <div className="relative aspect-[4/3] bg-slate-100">
                {item.afterImageUrl ? (
                  <Image src={item.afterImageUrl} alt="After" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">After</div>
                )}
                <div className="absolute top-1 left-1 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded">AFTER</div>
              </div>
            </div>

            {/* 정보 */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
                  {SERVICE_TABS.find((t) => t.key === item.serviceType)?.label || item.serviceType}
                </span>
                {item.location && <span className="text-xs text-slate-400">{item.location}</span>}
              </div>
              <h3 className="font-bold text-navy">{item.title}</h3>
              {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                수정
              </button>
              <button onClick={() => toggleVisibility(item)} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${item.visible ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                {item.visible ? "노출 중" : "숨김"}
              </button>
              <button onClick={() => setDeleteTarget(item.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16 text-slate-400">등록된 시공사례가 없습니다.</div>
      )}

      {/* ── 추가/수정 모달 ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-bold text-lg text-navy mb-4">
              {editingId ? "시공사례 수정" : "시공사례 추가"}
            </h2>

            <div className="space-y-4">
              {/* 서비스 타입 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">서비스 타입</label>
                <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {SERVICE_TABS.filter((t) => t.key !== "all").map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">제목 *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="예: 양주 옥정동 아파트 화장실" />
              </div>

              {/* 위치 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">위치 (태그)</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="예: 화장실, 현관, 베란다" />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">설명</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="시공 내용 설명 (선택)" />
              </div>

              {/* Before 이미지 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Before 이미지</label>
                <input ref={beforeFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "before");
                }} />
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => beforeFileRef.current?.click()} disabled={uploading === "before"} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors disabled:opacity-50">
                    {uploading === "before" ? "업로드 중..." : "파일 선택"}
                  </button>
                  {form.beforeImageUrl && (
                    <div className="relative w-16 h-12 rounded overflow-hidden">
                      <Image src={form.beforeImageUrl} alt="Before" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* After 이미지 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">After 이미지</label>
                <input ref={afterFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "after");
                }} />
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => afterFileRef.current?.click()} disabled={uploading === "after"} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors disabled:opacity-50">
                    {uploading === "after" ? "업로드 중..." : "파일 선택"}
                  </button>
                  {form.afterImageUrl && (
                    <div className="relative w-16 h-12 rounded overflow-hidden">
                      <Image src={form.afterImageUrl} alt="After" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* 순서 */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">순서 (낮을수록 먼저)</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeForm} className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                취소
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors">
                {editingId ? "수정 완료" : "추가하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 삭제 확인 모달 ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="시공사례 삭제"
        message="이 시공사례를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
