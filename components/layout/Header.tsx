/** Header.tsx — 글로벌 네비게이션 바 (GNB)
 * 
 *  기능:
 *  - 로고(좌측) + 메뉴 링크(우측) 배치
 *  - usePathname으로 현재 페이지 active 스타일 표시
 *  - 스크롤 시 배경 blur + 반투명 전환
 *  - 모바일: 햄버거 버튼 → 슬라이드 다운 메뉴
 *  - 로그인 상태에 따라 로그인/마이페이지 버튼 표시
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

/* ── 네비게이션 메뉴 항목 정의 ── */
const NAV_ITEMS = [
  { href: "/about", label: "회사소개" },
  { href: "/reviews", label: "후기" },
  { href: "/quote", label: "견적문의" },
  { href: "/academy", label: "아카데미·수강신청" },
  { href: "/points", label: "포인트 적립" },
];

export default function Header() {
  const pathname = usePathname(); // 현재 경로 확인용
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 상태 추적
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 열림/닫힘
  const { user, isLoggedIn } = useAuthStore(); // 로그인 상태

  /* ── 스크롤 이벤트 리스너 등록 ── */
  useEffect(() => {
    const handleScroll = () => {
      // 50px 이상 스크롤 시 헤더 배경 변경
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── 페이지 이동 시 모바일 메뉴 자동 닫기 ── */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* ── 현재 경로와 메뉴 링크 비교하여 active 여부 반환 ── */
  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "header-blur shadow-sm" // 스크롤 시: 흰색 배경 + 블러
        : "bg-transparent"                         // 최상단: 투명 배경
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── 로고 영역 ── */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="더케어 로고"
              width={555}
              height={219}
              className={`h-[60px] md:h-[68px] w-auto object-contain transition-all duration-300 ${isScrolled
                  ? "drop-shadow-[0_0_3px_rgba(180,140,50,0.7)] [filter:drop-shadow(0_0_1px_rgba(120,90,20,0.9))_drop-shadow(0_0_6px_rgba(200,160,60,0.4))]"
                  : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                }`}
              priority
            />
          </Link>

          {/* ── 데스크탑 네비게이션 메뉴 ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? "text-cyan bg-cyan/10"  // active 상태: 시안 색상 강조
                  : isScrolled
                    ? "text-navy/70 hover:text-navy hover:bg-navy/5" // 스크롤 시: 어두운 텍스트
                    : "text-white/80 hover:text-white hover:bg-white/10" // 최상단: 밝은 텍스트
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* ── 로그인 상태별 버튼 ── */}
            {isLoggedIn && user ? (
              <Link
                href="/mypage"
                className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive("/mypage")
                  ? "text-cyan bg-cyan/10"
                  : isScrolled
                    ? "text-navy/70 hover:text-navy hover:bg-navy/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user.nickname}
              </Link>
            ) : (
              <Link
                href="/auth"
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-cyan-dark text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
              >
                로그인
              </Link>
            )}
          </nav>

          {/* ── 모바일 햄버거 버튼 ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled
              ? "text-navy hover:bg-navy/5"
              : "text-white hover:bg-white/10"
              }`}
            aria-label="메뉴 열기/닫기"
          >
            {/* 햄버거 아이콘 ↔ X 아이콘 전환 */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── 모바일 슬라이드 다운 메뉴 ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}     // 초기 상태: 숨김
            animate={{ opacity: 1, height: "auto" }} // 열릴 때: 자연스럽게 펼침
            exit={{ opacity: 0, height: 0 }}          // 닫힐 때: 접히며 사라짐
            className="lg:hidden overflow-hidden bg-white border-t border-slate-light/50"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                    ? "text-cyan bg-cyan/10"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* 모바일 로그인/마이페이지 */}
              {isLoggedIn && user ? (
                <Link
                  href="/mypage"
                  className="mt-2 px-5 py-3 bg-gradient-to-r from-navy to-navy-light text-white text-sm font-semibold rounded-lg text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.nickname}님 마이페이지
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="mt-2 px-5 py-3 bg-gradient-to-r from-cyan to-cyan-dark text-white text-sm font-semibold rounded-lg text-center"
                >
                  로그인 / 회원가입
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
