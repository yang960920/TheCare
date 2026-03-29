/** Header.tsx — 글로벌 네비게이션 바 (드롭다운 메가메뉴)
 *
 *  구조:
 *  - THE CARE (로고) → 회사소개 직접 링크 (드롭다운 없음)
 *  - 입주청소 / 줄눈시공 / 탄성코트 / 나노코팅 / 새집증후군 → 각 드롭다운
 *  - 아카데미 / 고객센터 → 드롭다운
 *  - 데스크탑: hover 드롭다운, 모바일: 아코디언
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

/* ── 네비게이션 메뉴 정의 ── */
interface SubItem {
  href: string;
  label: string;
}

interface NavItem {
  label: string;
  href?: string;        // 직접 링크 (드롭다운 없을 때)
  children?: SubItem[]; // 서브메뉴 (드롭다운)
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "THE CARE",
    href: "/about",
  },
  {
    label: "입주청소",
    children: [
      { href: "/services/cleaning#info", label: "입주청소 안내" },
      { href: "/services/cleaning#scope", label: "시공범위 및 특화서비스" },
      { href: "/services/cleaning#cases", label: "시공사례" },
    ],
  },
  {
    label: "줄눈시공",
    children: [
      { href: "/services/grout#info", label: "줄눈시공 안내" },
      { href: "/services/grout#premium", label: "프리미엄 에폭시 (빅라이언)" },
      { href: "/services/grout#cases", label: "시공사례" },
    ],
  },
  {
    label: "탄성코트",
    children: [
      { href: "/services/elasticcoat#info", label: "탄성코트 안내" },
      { href: "/services/elasticcoat#products", label: "제품 및 시공범위" },
      { href: "/services/elasticcoat#cases", label: "시공사례" },
    ],
  },
  {
    label: "나노코팅",
    children: [
      { href: "/services/nanocoat#info", label: "나노코팅 안내" },
      { href: "/services/nanocoat#scope", label: "시공범위" },
      { href: "/services/nanocoat#cases", label: "시공사례" },
    ],
  },
  {
    label: "새집증후군",
    children: [
      { href: "/services/newsyndrome#info", label: "새집증후군 케어" },
      { href: "/services/newsyndrome#method", label: "시공방식" },
      { href: "/services/newsyndrome#cases", label: "시공사례" },
    ],
  },
  {
    label: "아카데미",
    children: [
      { href: "/academy#courses", label: "강의내용" },
      { href: "/academy#apply", label: "수강신청" },
      { href: "/academy#contact", label: "문의하기" },
    ],
  },
  {
    label: "고객센터",
    children: [
      { href: "/customer/notices", label: "공지사항" },
      { href: "/customer/reviews", label: "후기 게시판" },
      { href: "/customer/points", label: "포인트 신청/사용" },
      { href: "/quote", label: "견적 및 예약 문의" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenSubs, setMobileOpenSubs] = useState<Set<string>>(new Set());
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const { user, isLoggedIn, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* ── 스크롤 이벤트 ── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── 페이지 이동 시 메뉴 닫기 ── */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenSubs(new Set());
  }, [pathname]);

  /* ── 경로 active 여부 ── */
  const isActive = (item: NavItem) => {
    if (item.href) return pathname === item.href;
    return item.children?.some((c) => pathname.startsWith(c.href.split("#")[0])) ?? false;
  };

  /* ── 데스크탑 드롭다운 핸들러 ── */
  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  /* ── 모바일 아코디언 토글 ── */
  const toggleMobileSub = (label: string) => {
    setMobileOpenSubs((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  /* ── 텍스트 색상 헬퍼 ── */
  const getTextColor = (active: boolean) => {
    if (active) return "text-gold";
    return isScrolled ? "text-navy/70 hover:text-gold" : "text-white/80 hover:text-white";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "header-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── 로고 ── */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="더케어 로고"
              width={555}
              height={219}
              className={`h-[60px] md:h-[68px] w-auto object-contain transition-all duration-300 ${
                isScrolled
                  ? "drop-shadow-[0_0_3px_rgba(184,134,11,0.5)]"
                  : "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              }`}
              priority
            />
          </Link>

          {/* ── 데스크탑 네비게이션 ── */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);

              /* 직접 링크 (THE CARE) */
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${getTextColor(active)}`}
                  >
                    {item.label}
                  </Link>
                );
              }

              /* 드롭다운 메뉴 */
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${getTextColor(active)}`}
                  >
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 드롭다운 패널 */}
                  <AnimatePresence>
                    {openDropdown === item.label && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-light/50 overflow-hidden z-50"
                      >
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-navy/70 hover:text-gold hover:bg-gold-pale/30 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* ── 데스크탑 로그인/마이페이지 ── */}
          <div className="hidden xl:flex items-center ml-4">
            {isLoggedIn && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isScrolled ? "text-navy/70 hover:text-gold" : "text-white/80 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.nickname}
                  <svg className={`w-3.5 h-3.5 transition-transform ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-light/50 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <Link href="/mypage" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-navy/70 hover:text-gold hover:bg-gold-pale/30 transition-colors">
                          마이페이지
                        </Link>
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-navy/70 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          로그아웃
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth"
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isScrolled
                    ? "bg-gold text-white hover:bg-gold-dark"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                로그인
              </Link>
            )}
          </div>

          {/* ── 모바일 햄버거 버튼 ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`xl:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-navy hover:bg-navy/5" : "text-white hover:bg-white/10"
            }`}
            aria-label="메뉴 열기/닫기"
          >
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden overflow-hidden bg-white border-t border-slate-light/50"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-0.5 max-h-[75vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                /* 직접 링크 */
                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        isActive(item)
                          ? "text-gold bg-gold-pale/30"
                          : "text-navy/70 hover:text-gold hover:bg-gold-pale/20"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                /* 아코디언 메뉴 */
                const isOpen = mobileOpenSubs.has(item.label);
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleMobileSub(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        isActive(item)
                          ? "text-gold bg-gold-pale/30"
                          : "text-navy/70 hover:text-gold hover:bg-gold-pale/20"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isOpen && item.children && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 pb-2 space-y-0.5">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm text-navy/60 hover:text-gold rounded-lg transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {/* ── 모바일 로그인/마이페이지 ── */}
              <div className="border-t border-slate-light/50 mt-2 pt-3">
                {isLoggedIn && user ? (
                  <>
                    <Link
                      href="/mypage"
                      className="block px-4 py-3 rounded-lg text-sm font-semibold text-navy/70 hover:text-gold hover:bg-gold-pale/20 transition-colors"
                    >
                      마이페이지 ({user.nickname})
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-navy/70 hover:text-red-500 transition-colors"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="block px-4 py-3 rounded-lg text-sm font-semibold text-gold hover:bg-gold-pale/20 transition-colors"
                  >
                    로그인 / 회원가입
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
