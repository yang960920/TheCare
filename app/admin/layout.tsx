/** app/admin/layout.tsx — 어드민 전용 레이아웃
 *
 *  구성:
 *  - 좌측 고정 사이드바 (240px, 다크 슬레이트 #0F172A)
 *    - 로고, 메뉴 항목(아이콘+텍스트), active 표시, 로그아웃
 *  - 상단 헤더 (현재 페이지 타이틀, 관리자 아바타)
 *  - 모바일: 햄버거 → 오버레이 드로어
 *  - 일반 사이트 GNB/Footer 미노출
 */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Wrench,
  Star,
  GraduationCap,
  Gift,
  FileText,
  Building2,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Camera,
  Megaphone,
  Coins,
} from "lucide-react";
import ToastContainer from "@/components/admin/Toast";
import { useAdminStore } from "@/store/adminStore";

/* ── 사이드바 메뉴 항목 정의 ── */
const MENU_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "대시보드" },
  { href: "/admin/hero", icon: ImageIcon, label: "히어로 관리" },
  { href: "/admin/services", icon: Wrench, label: "서비스 관리" },
  { href: "/admin/cases", icon: Camera, label: "시공사례 관리" },
  { href: "/admin/reviews", icon: Star, label: "후기 관리" },
  { href: "/admin/academy", icon: GraduationCap, label: "아카데미 관리" },
  { href: "/admin/notices", icon: Megaphone, label: "공지사항 관리" },
  { href: "/admin/points-manage", icon: Coins, label: "포인트 신청관리" },
  { href: "/admin/points", icon: Gift, label: "포인트·이벤트" },
  { href: "/admin/quotes", icon: FileText, label: "견적 문의" },
  { href: "/admin/company", icon: Building2, label: "회사 정보" },
  { href: "/admin/popup", icon: Bell, label: "팝업·공지" },
];

/* ── 경로에 따른 페이지 타이틀 매핑 ── */
function getPageTitle(pathname: string): string {
  const item = MENU_ITEMS.find((m) =>
    m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href)
  );
  return item?.label || "관리자";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ── 관리자 로그인 상태 ── */
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const loadAll = useAdminStore((s) => s.loadAll);

  /* sessionStorage에서 로그인 상태 복원 + 데이터 로드 */
  useEffect(() => {
    const saved = sessionStorage.getItem("adminLoggedIn");
    if (saved === "true") {
      setIsAdminLoggedIn(true);
      loadAll();
    }
    setIsLoaded(true);
  }, [loadAll]);

  /* 로그인 처리 */
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loginId, pw: loginPw }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem("adminLoggedIn", "true");
        setLoginError("");
        loadAll();
      } else {
        setLoginError(data.error || "로그인 실패");
      }
    } catch {
      setLoginError("서버 오류가 발생했습니다.");
    }
  };

  /* 로그아웃 처리 */
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("adminLoggedIn");
  };

  /** 현재 경로가 메뉴 항목과 일치하는지 확인 */
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  /* ── 로딩 중 ── */
  if (!isLoaded) return null;

  /* ══════════════════════════════════
   *  관리자 로그인 페이지 (미인증 시)
   * ══════════════════════════════════ */
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* 로고 */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="THE CARE" className="h-14 mx-auto mb-4 object-contain" />
            <p className="text-slate-400 text-sm">관리자 로그인</p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleAdminLogin} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디 입력"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  /* ── 사이드바 콘텐츠 (데스크탑/모바일 공용) ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* 로고 영역 — 메인 홈페이지로 이동 */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="THE CARE"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="text-slate-500 text-[10px] mt-1 ml-1">관리자 패널</div>
      </div>

      {/* 메뉴 항목 리스트 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="text-cyan-400" />}
            </Link>
          );
        })}
      </nav>

      {/* 하단 로그아웃 버튼 */}
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleAdminLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-colors w-full">
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── 데스크탑 고정 사이드바 ── */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-60 bg-[#0F172A] z-30">
        <SidebarContent />
      </aside>

      {/* ── 모바일 오버레이 드로어 ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-[#0F172A] z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── 메인 콘텐츠 영역 ── */}
      <div className="lg:ml-60">
        {/* 상단 헤더 */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* 모바일 햄버거 + 페이지 타이틀 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-bold text-slate-900">
                {getPageTitle(pathname)}
              </h1>
            </div>

            {/* 관리자 프로필 (더미) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:block">관리자</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* 토스트 알림 컨테이너 */}
      <ToastContainer />
    </div>
  );
}
