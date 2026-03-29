/** app/customer/points/page.tsx — 포인트 신청/사용 게시판 (사용자용)
 *
 *  - 포인트 적립 신청 폼
 *  - 사용 신청 게시글 목록
 *  - 이름 마스킹 (홍길동 → 홍**)
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Pagination from "@/components/ui/Pagination";

interface PointApp {
  id: string;
  applicantName: string;
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

/** 이름 마스킹: 홍길동 → 홍** */
function maskName(name: string): string {
  if (name.length <= 1) return "*";
  return name[0] + "*".repeat(name.length - 1);
}

export default function PointsPage() {
  const [applications, setApplications] = useState<PointApp[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"earn" | "use">("earn");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* 페이징 상태 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  /* 폼 필드 */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [formType, setFormType] = useState<"earn" | "use">("earn");
  const [requestedPoints, setRequestedPoints] = useState(0);

  useEffect(() => {
    fetch("/api/points")
      .then((r) => r.json())
      .then((data: PointApp[]) => setApplications(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, []);

  const filtered = applications.filter((a) => a.type === tab);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !content.trim()) {
      alert("이름, 연락처, 내용을 모두 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: name,
          phone,
          type: formType,
          content,
          requestedPoints: formType === "use" ? requestedPoints : 0,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setApplications((prev) => [created, ...prev]);
        setSubmitted(true);
      }
    } catch { /* empty */ }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "대기": "bg-yellow-50 text-yellow-600",
      "승인": "bg-green-50 text-green-600",
      "거절": "bg-red-50 text-red-600",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[status] || "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Points</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">포인트 신청/사용</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">포인트 적립 신청 및 사용 요청을 관리합니다</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 메인 콘텐츠 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 이벤트 배너 */}
          {events.filter((e) => e.visible).map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 md:p-8 rounded-2xl shadow-lg border border-white/20 text-white"
              style={{ backgroundColor: e.bgColor || "#00D4FF" }}
            >
              <h3 className="font-display font-bold text-xl md:text-2xl mb-2">{e.title}</h3>
              <p className="opacity-90 whitespace-pre-wrap text-sm md:text-base leading-relaxed mb-4">{e.description}</p>
              <div className="inline-block px-3 py-1.5 rounded-lg bg-black/10 backdrop-blur-sm text-xs font-semibold">
                이벤트 기간: {e.startDate} ~ {e.endDate}
              </div>
            </motion.div>
          ))}

          {/* 탭 전환 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTab("earn"); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "earn" ? "bg-gold text-white" : "bg-cream text-navy/60 hover:text-navy"}`}
            >
              적립 신청
            </button>
            <button
              onClick={() => { setTab("use"); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "use" ? "bg-gold text-white" : "bg-cream text-navy/60 hover:text-navy"}`}
            >
              사용 신청
            </button>
          </div>

          {/* 신청 버튼 */}
          <button
            onClick={() => { setShowForm(true); setFormType(tab); setSubmitted(false); setName(""); setPhone(""); setContent(""); setRequestedPoints(0); }}
            className="mb-6 px-6 py-2.5 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors text-sm"
          >
            + {tab === "earn" ? "적립" : "사용"} 신청하기
          </button>

          {/* 신청 목록 */}
          {loading ? (
            <div className="text-center py-16 text-navy/40">데이터를 불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-navy/40">등록된 {tab === "earn" ? "적립" : "사용"} 신청이 없습니다.</div>
          ) : (
            <>
              <div className="space-y-4">
                {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-cream rounded-xl p-5 gold-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy text-sm">{maskName(app.applicantName)}</span>
                        {statusBadge(app.status)}
                      </div>
                      <span className="text-navy/30 text-xs">{new Date(app.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <p className="text-navy/60 text-sm leading-relaxed mb-2">{app.content}</p>
                    {app.type === "use" && app.requestedPoints > 0 && (
                      <div className="text-sm text-gold font-medium">요청 포인트: {app.requestedPoints.toLocaleString()}P</div>
                    )}
                    {app.approvedPoints > 0 && (
                      <div className="text-sm text-green-600 font-medium">승인 포인트: {app.approvedPoints.toLocaleString()}P</div>
                    )}
                    {app.approvalDetails && (
                      <div className="text-xs text-navy/40 mt-1">{app.approvalDetails}</div>
                    )}
                    {app.adminReply && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-gold/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gold">관리자 답변</span>
                          {app.adminReplyDate && <span className="text-[10px] text-navy/30">{app.adminReplyDate}</span>}
                        </div>
                        <p className="text-navy/60 text-sm">{app.adminReply}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filtered.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>

      {/* ═══ 신청 폼 모달 ═══ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            {!submitted ? (
              <>
                <h2 className="font-bold text-lg text-navy mb-4">
                  {formType === "earn" ? "포인트 적립 신청" : "포인트 사용 신청"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">이름 *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="홍길동" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">연락처 *</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="010-1234-5678" />
                  </div>
                  {formType === "use" && (
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">요청 포인트</label>
                      <input type="number" value={requestedPoints} onChange={(e) => setRequestedPoints(parseInt(e.target.value) || 0)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">내용 *</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={formType === "earn" ? "후기 작성 사이트/횟수 등을 적어주세요" : "사용 요청 내용을 적어주세요"} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">취소</button>
                  <button onClick={handleSubmit} className="px-5 py-2.5 text-sm bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark">신청하기</button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-navy mb-2">신청이 완료되었습니다!</h3>
                <p className="text-navy/50 text-sm mb-6">관리자 확인 후 처리됩니다.</p>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gold text-white font-semibold rounded-lg">확인</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
