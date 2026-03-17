/** app/mypage/page.tsx — 마이페이지
 *
 *  기능:
 *  - 프로필 정보 표시 (이메일, 전화번호, 닉네임)
 *  - 닉네임 인라인 수정
 *  - 보유 포인트 + 적립/사용 내역
 *  - 내가 작성한 후기 목록
 *  - 로그아웃 버튼
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoggedIn, updateNickname, logout, userReviews } = useAuthStore();

  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [nicknameSaved, setNicknameSaved] = useState(false);

  /* ── 비로그인 시 auth 페이지로 ── */
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

  if (!user) return null;

  /* ── 내 후기 필터링 ── */
  const myReviews = userReviews.filter((r) => r.userId === user.id);

  /* ── 닉네임 수정 ── */
  const handleNicknameSave = () => {
    if (newNickname.trim()) {
      updateNickname(newNickname.trim());
      setEditingNickname(false);
      setNicknameSaved(true);
      setTimeout(() => setNicknameSaved(false), 2000);
    }
  };

  /* ── 로그아웃 ── */
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {/* ── 히어로 배너 ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan font-semibold text-sm tracking-wider uppercase">My Page</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 mb-4">
              마이페이지
            </h1>
            <p className="text-white/60 text-base md:text-lg">
              {user.nickname}님, 반갑습니다!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 메인 컨텐츠 ── */}
      <section className="section-padding bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* ══════ 프로필 정보 ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="font-display font-bold text-lg text-navy mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              프로필 정보
            </h2>

            <div className="space-y-4">
              {/* 이메일 */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-navy/60">이메일</span>
                <span className="text-sm text-navy">{user.email}</span>
              </div>

              {/* 전화번호 */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-navy/60">전화번호</span>
                <span className="text-sm text-navy">{user.phone || "미등록"}</span>
              </div>

              {/* 닉네임 (수정 가능) */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-navy/60">닉네임</span>
                <div className="flex items-center gap-2">
                  {editingNickname ? (
                    <>
                      <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 w-32"
                        autoFocus
                      />
                      <button
                        onClick={handleNicknameSave}
                        className="px-3 py-1.5 bg-cyan text-white text-xs font-semibold rounded-lg hover:bg-cyan-dark transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingNickname(false)}
                        className="px-3 py-1.5 bg-slate-100 text-navy/60 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-navy">{user.nickname}</span>
                      <button
                        onClick={() => {
                          setNewNickname(user.nickname);
                          setEditingNickname(true);
                        }}
                        className="px-2 py-1 text-xs text-cyan hover:bg-cyan/10 rounded-md transition-colors"
                      >
                        수정
                      </button>
                    </>
                  )}
                  {nicknameSaved && (
                    <span className="text-green-500 text-xs">✓ 저장됨</span>
                  )}
                </div>
              </div>

              {/* 로그인 방식 */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm font-medium text-navy/60">로그인 방식</span>
                <span className="text-sm text-navy capitalize">
                  {user.loginMethod === "email" ? "이메일" : user.loginMethod === "google" ? "Google" : "Naver"}
                </span>
              </div>

              {/* 가입일 */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-navy/60">가입일</span>
                <span className="text-sm text-navy">{user.createdAt}</span>
              </div>
            </div>
          </motion.div>

          {/* ══════ 포인트 현황 ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="font-display font-bold text-lg text-navy mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              포인트 현황
            </h2>

            {/* 보유 포인트 */}
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 mb-6 text-center">
              <div className="text-white/50 text-sm mb-1">보유 포인트</div>
              <div className="font-display font-black text-4xl text-cyan">
                {user.points.toLocaleString()}
              </div>
              <div className="text-white/50 text-sm">P</div>
            </div>

            {/* 포인트 내역 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-navy/70">적립·사용 내역</h3>
              {user.pointHistory.length === 0 ? (
                <p className="text-navy/40 text-sm text-center py-4">내역이 없습니다.</p>
              ) : (
                user.pointHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2.5 border-b border-slate-50"
                  >
                    <div>
                      <span className="text-sm text-navy">{entry.description}</span>
                      <span className="text-xs text-navy/40 ml-2">{entry.date}</span>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        entry.type === "earn" ? "text-cyan" : "text-red-400"
                      }`}
                    >
                      {entry.type === "earn" ? "+" : "-"}
                      {entry.amount.toLocaleString()}P
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* ══════ 내 후기 ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="font-display font-bold text-lg text-navy mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              내 후기
            </h2>

            {myReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-navy/40 text-sm mb-3">작성한 후기가 없습니다.</p>
                <button
                  onClick={() => router.push("/reviews")}
                  className="px-4 py-2 bg-cyan/10 text-cyan text-sm font-semibold rounded-lg hover:bg-cyan/20 transition-colors"
                >
                  후기 작성하러 가기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-cream rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 bg-cyan/10 text-cyan-dark rounded-full">
                        {review.serviceType}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-navy/70 leading-relaxed">{review.content}</p>
                    <p className="text-xs text-navy/40 mt-2">{review.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ══════ 로그아웃 ══════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center pb-8"
          >
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-red-200 text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
