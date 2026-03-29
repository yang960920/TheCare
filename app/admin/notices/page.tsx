/** app/admin/notices/page.tsx — 공지사항 관리 (관리자) */
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface Notice {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  visible: boolean;
  createdAt: string;
}

const EMPTY_FORM = { title: "", content: "", pinned: false, visible: true };

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const loadNotices = async () => {
    try {
      const res = await fetch("/api/notices?all=true");
      const data = await res.json();
      setNotices(data);
    } catch { /* empty */ }
  };

  useEffect(() => { loadNotices(); }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return alert("제목을 입력해주세요.");
    try {
      if (editingId) {
        const res = await fetch(`/api/notices/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const updated = await res.json();
        setNotices((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
      } else {
        const res = await fetch("/api/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const created = await res.json();
        setNotices((prev) => [created, ...prev]);
      }
      closeForm();
    } catch { /* empty */ }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/notices/${deleteTarget}`, { method: "DELETE" });
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget));
      setDeleteTarget(null);
    } catch { /* empty */ }
  };

  const togglePinned = async (n: Notice) => {
    try {
      const res = await fetch(`/api/notices/${n.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinned: !n.pinned }) });
      const updated = await res.json();
      setNotices((prev) => prev.map((x) => (x.id === n.id ? updated : x)));
    } catch { /* empty */ }
  };

  const openEdit = (n: Notice) => {
    setEditingId(n.id);
    setForm({ title: n.title, content: n.content, pinned: n.pinned, visible: n.visible });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); };

  return (
    <div>
      <PageHeader title="공지사항 관리" description="고객에게 보여지는 공지사항을 관리합니다" />
      <button onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }} className="mb-6 px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors">
        + 공지사항 추가
      </button>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className={`bg-white rounded-xl border p-4 ${!n.visible ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {n.pinned && <span className="text-xs bg-gold text-white px-2 py-0.5 rounded font-bold">📌 고정</span>}
                <h3 className="font-bold text-navy">{n.title}</h3>
              </div>
              <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{n.content}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(n)} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg">수정</button>
              <button onClick={() => togglePinned(n)} className={`px-3 py-1.5 text-xs rounded-lg ${n.pinned ? "bg-gold/10 text-gold" : "bg-slate-100 text-slate-500"}`}>
                {n.pinned ? "고정 해제" : "고정"}
              </button>
              <button onClick={() => setDeleteTarget(n.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">삭제</button>
            </div>
          </div>
        ))}
        {notices.length === 0 && <div className="text-center py-16 text-slate-400">등록된 공지사항이 없습니다.</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="font-bold text-lg text-navy mb-4">{editingId ? "공지사항 수정" : "공지사항 추가"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">제목 *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">내용 *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="rounded" /> 상단 고정
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeForm} className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark">{editingId ? "수정 완료" : "추가하기"}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="공지사항 삭제" message="이 공지사항을 삭제하시겠습니까?" onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}
