/** Footer.tsx — 사이트 하단 푸터 (사업자등록증 정보 반영)
 *
 *  구성:
 *  - 회사 정보 (로고 + 설명)
 *  - 서비스 바로가기
 *  - 고객지원 바로가기
 *  - 연락처
 *  - 사업자 등록 정보 (하단 바)
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── 서비스 링크 ── */
const SERVICE_LINKS = [
  { href: "/services/cleaning", label: "입주 청소" },
  { href: "/services/grout", label: "줄눈 시공" },
  { href: "/services/elasticcoat", label: "탄성 코트" },
  { href: "/services/nanocoat", label: "나노 코팅" },
  { href: "/services/newsyndrome", label: "새집증후군 제거" },
];

/* ── 고객지원 링크 ── */
const SUPPORT_LINKS = [
  { href: "/about", label: "회사소개" },
  { href: "/academy", label: "아카데미" },
  { href: "/customer/notices", label: "공지사항" },
  { href: "/customer/points", label: "포인트 신청/사용" },
  { href: "/quote", label: "견적 및 예약 문의" },
];

interface CompanyInfo {
  name: string;
  ceo: string;
  businessNumber: string;
  address: string;
  phone: string;
  email: string;
}

export default function Footer() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetch("/api/company")
      .then((r) => r.json())
      .then((data: CompanyInfo) => setCompany(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-navy text-white">
      {/* ── 메인 푸터 콘텐츠 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── 회사 정보 영역 ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="더케어 로고"
                width={555}
                height={219}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              프리미엄 청소 전문 기업 더케어입니다.<br />
              깨끗한 공간, 건강한 생활을 약속합니다.
            </p>
          </div>

          {/* ── 서비스 링크 ── */}
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-gold">
              서비스
            </h3>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 고객지원 링크 ── */}
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-gold">
              고객지원
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 연락처 정보 ── */}
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-gold">
              연락처
            </h3>
            <div className="space-y-3 text-sm text-white/60">
              {/* 전화번호 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{company?.phone || "031-0000-0000"}</span>
              </div>
              {/* 이메일 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{company?.email || "iumwebstudio@gmail.com"}</span>
              </div>
              {/* 주소 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{company?.address || "경기도 양주시 화합로1710번길 76, 4층 공장435호(옥정동, 슈프림더브릭스타워)"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단 사업자 정보 바 ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© 2025 {company?.name || "더케어"}. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>사업자등록번호: {company?.businessNumber || "282-55-00733"}</span>
              <span>|</span>
              <span>대표: {company?.ceo || "문성민"}</span>
              <span>|</span>
              <span>개업일: 2022.10.27</span>
              <span>|</span>
              <span>업태: 서비스업, 교육서비스업</span>
              <span>|</span>
              <span>종목: 건축물 일반 청소업, 교육(줄눈, 청소)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
