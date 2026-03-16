/** Header.tsx — 글로벌 네비게이션 바 (GNB)
 * 
 *  기능:
 *  - 로고(좌측) + 메뉴 링크(우측) 배치
 *  - usePathname으로 현재 페이지 active 스타일 표시
 *  - 스크롤 시 배경 blur + 반투명 전환
 *  - 모바일: 햄버거 버튼 → 슬라이드 다운 메뉴
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "header-blur shadow-sm" // 스크롤 시: 블러 배경 + 그림자
          : "bg-transparent"        // 최상단: 투명 배경
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ── 로고 영역 ── */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* 로고 아이콘 (원형 그라디언트) */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan to-cyan-dark flex items-center justify-center">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            {/* 로고 텍스트 */}
            <span
              className={`font-display font-bold text-lg md:text-xl transition-colors ${
                isScrolled ? "text-navy" : "text-white"
              } group-hover:text-cyan`}
            >
              CleanMaster
            </span>
          </Link>

          {/* ── 데스크탑 네비게이션 메뉴 ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-cyan bg-cyan/10"  // active 상태: 시안 색상 강조
                    : isScrolled
                      ? "text-navy/70 hover:text-navy hover:bg-navy/5"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* CTA 버튼 — 견적문의로 유도 */}
            <Link
              href="/quote"
              className="ml-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-cyan-dark text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
            >
              무료 견적
            </Link>
          </nav>

          {/* ── 모바일 햄버거 버튼 ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
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
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-cyan bg-cyan/10"
                      : "text-navy/70 hover:text-navy hover:bg-navy/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* 모바일 CTA 버튼 */}
              <Link
                href="/quote"
                className="mt-2 px-5 py-3 bg-gradient-to-r from-cyan to-cyan-dark text-white text-sm font-semibold rounded-lg text-center"
              >
                무료 견적 받기
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
