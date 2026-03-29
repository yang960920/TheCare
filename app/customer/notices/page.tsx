/** app/customer/notices/page.tsx — 공지사항 게시판 (사용자용) */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Pagination from "@/components/ui/Pagination";

interface Notice {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  /* 페이징 상태 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetch("/api/notices")
      .then((r) => r.json())
      .then((data: Notice[]) => setNotices(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ═══ 히어로 ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold font-semibold text-sm tracking-wider uppercase">Notices</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">공지사항</h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl">더케어의 최신 소식과 이벤트를 확인하세요</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 공지사항 목록 ═══ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16 text-navy/40">공지사항을 불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 text-navy/40">등록된 공지사항이 없습니다.</div>
          ) : (
            <>
              <div className="space-y-3">
                {notices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((notice, i) => (
                  <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-cream rounded-xl gold-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(expanded === notice.id ? null : notice.id)}
                    className="w-full text-left px-5 py-4 flex items-center gap-3"
                  >
                    {notice.pinned && (
                      <span className="text-xs bg-gold text-white px-2 py-0.5 rounded font-bold flex-shrink-0">중요</span>
                    )}
                    <span className="font-semibold text-navy flex-1 text-sm md:text-base">{notice.title}</span>
                    <span className="text-navy/30 text-xs flex-shrink-0">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                    <svg
                      className={`w-4 h-4 text-navy/30 transition-transform ${expanded === notice.id ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expanded === notice.id && (
                    <div className="px-5 pb-5 text-navy/60 text-sm leading-relaxed border-t border-gold/10 pt-4 whitespace-pre-wrap">
                      {notice.content}
                    </div>
                  )}
                </motion.div>
              ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(notices.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
