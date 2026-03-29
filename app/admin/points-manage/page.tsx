/** app/admin/points-manage/page.tsx — 포인트 관리 (관리자)
 *
 *  기능:
 *  - 포인트 적립 신청 조회 및 승인 (드롭다운 항목 × 숫자)
 *  - 포인트 사용 신청 관리 및 답글
 */
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/admin/PageHeader";

interface PointApp {
  id: string;
  applicantName: string;
  phone: string;
  type: string;
  content: string;
  requestedPoints: number;
  approvedPoints: number;
  approvalDetails: string;
  status: string;
  adminReply: string;
  adminReplyDate: string;
  createdAt: string;
}

/* 적립 항목 드롭다운 옵션 */
const EARN_ITEMS = [
  { label: "후기 작성 (1건)", points: 50 },
  { label: "블로그 후기 (1건)", points: 100 },
  { label: "네이버 플레이스 후기 (1건)", points: 100 },
  { label: "카카오맵 후기 (1건)", points: 100 },
  { label: "추천인 적립", points: 200 },
];

export default function AdminPointsManagePage() {
  const [applications, setApplications] = useState<PointApp[]>([]);
  const [tab, setTab] = useState<"earn" | "use">("earn");
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [earnItem, setEarnItem] = useState(EARN_ITEMS[0]);
  const [earnCount, setEarnCount] = useState(1);

  useEffect(() => {
    fetch("/api/points").then((r) => r.json()).then(setApplications).catch(() => {});
  }, []);

  const filtered = applications.filter((a) => a.type === tab);

  /* 승인 처리 */
  const handleApprove = async (id: string) => {
    const total = earnItem.points * earnCount;
    const details = `${earnItem.label} × ${earnCount} = ${total}P`;
    try {
      const res = await fetch(`/api/points/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "승인", approvedPoints: total, approvalDetails: details }),
      });
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setApproveTarget(null);
    } catch { /* empty */ }
  };

  /* 거절 처리 */
  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/points/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "거절" }),
      });
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch { /* empty */ }
  };

  /* 답글 저장 */
  const handleReply = async (id: string) => {
    try {
      const res = await fetch(`/api/points/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: replyText, adminReplyDate: new Date().toISOString().split("T")[0] }),
      });
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setReplyTarget(null);
      setReplyText("");
    } catch { /* empty */ }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = { "대기": "bg-yellow-50 text-yellow-600", "승인": "bg-green-50 text-green-600", "거절": "bg-red-50 text-red-600" };
    return <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[status] || "bg-slate-100 text-slate-500"}`}>{status}</span>;
  };

  return (
    <div>
      <PageHeader title="포인트 관리" description="고객 포인트 적립 승인 및 사용 신청을 관리합니다" />

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("earn")} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "earn" ? "bg-gold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          적립 신청 ({applications.filter((a) => a.type === "earn").length})
        </button>
        <button onClick={() => setTab("use")} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "use" ? "bg-gold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          사용 신청 ({applications.filter((a) => a.type === "use").length})
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-navy">{app.applicantName}</span>
                  {statusBadge(app.status)}
                </div>
                <span className="text-xs text-slate-400">{app.phone} · {new Date(app.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-3">{app.content}</p>

            {app.type === "use" && app.requestedPoints > 0 && (
              <div className="text-sm text-gold font-medium mb-2">요청: {app.requestedPoints.toLocaleString()}P</div>
            )}
            {app.approvedPoints > 0 && <div className="text-sm text-green-600 font-medium mb-2">승인: {app.approvedPoints.toLocaleString()}P ({app.approvalDetails})</div>}
            {app.adminReply && (
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <span className="text-xs font-bold text-gold">관리자 답변</span> <span className="text-[10px] text-slate-400">{app.adminReplyDate}</span>
                <p className="text-sm text-slate-600 mt-1">{app.adminReply}</p>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex items-center gap-2 flex-wrap">
              {tab === "earn" && app.status === "대기" && (
                <>
                  <button onClick={() => { setApproveTarget(app.id); setEarnItem(EARN_ITEMS[0]); setEarnCount(1); }} className="px-3 py-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded-lg">승인</button>
                  <button onClick={() => handleReject(app.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">거절</button>
                </>
              )}
              {tab === "use" && (
                <>
                  {app.status === "대기" && (
                    <>
                      <button onClick={() => {
                        fetch(`/api/points/${app.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "승인", approvedPoints: app.requestedPoints }) })
                          .then((r) => r.json()).then((u) => setApplications((p) => p.map((a) => a.id === u.id ? u : a)));
                      }} className="px-3 py-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded-lg">승인</button>
                      <button onClick={() => handleReject(app.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">거절</button>
                    </>
                  )}
                </>
              )}
              <button onClick={() => { setReplyTarget(app.id); setReplyText(app.adminReply || ""); }} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg">
                {app.adminReply ? "답글 수정" : "답글 작성"}
              </button>
            </div>

            {/* 승인 드롭다운 (적립) */}
            {approveTarget === app.id && (
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-sm text-navy mb-3">적립 포인트 승인</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <select value={EARN_ITEMS.indexOf(earnItem)} onChange={(e) => setEarnItem(EARN_ITEMS[Number(e.target.value)])} className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]">
                    {EARN_ITEMS.map((item, i) => (
                      <option key={i} value={i}>{item.label} ({item.points}P)</option>
                    ))}
                  </select>
                  <span className="text-sm text-navy/40">×</span>
                  <input type="number" min={1} value={earnCount} onChange={(e) => setEarnCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 border rounded-lg px-3 py-2 text-sm text-center" />
                  <span className="text-sm font-bold text-green-600">= {(earnItem.points * earnCount).toLocaleString()}P</span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => setApproveTarget(null)} className="px-4 py-2 text-xs text-slate-500 hover:bg-white rounded-lg">취소</button>
                  <button onClick={() => handleApprove(app.id)} className="px-4 py-2 text-xs bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">승인 확정</button>
                </div>
              </div>
            )}

            {/* 답글 입력 */}
            {replyTarget === app.id && (
              <div className="mt-4 bg-slate-50 rounded-lg p-4">
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm mb-3" placeholder="관리자 답글을 입력하세요" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setReplyTarget(null)} className="px-4 py-2 text-xs text-slate-500 hover:bg-white rounded-lg">취소</button>
                  <button onClick={() => handleReply(app.id)} className="px-4 py-2 text-xs bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark">답글 저장</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 text-slate-400">등록된 {tab === "earn" ? "적립" : "사용"} 신청이 없습니다.</div>}
      </div>
    </div>
  );
}
