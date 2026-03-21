/** Footer.tsx — 사이트 하단 푸터
 *
 *  구성:
 *  - 회사 정보 (로고 + 설명)
 *  - 빠른 링크 (서비스, 고객지원)
 *  - 연락처 정보 (전화, 이메일, 주소)
 *  - 저작권 표시
 */
import Link from "next/link";
import Image from "next/image";

/* ── 빠른 링크 목록 정의 ── */
const QUICK_LINKS = [
  { href: "/about", label: "회사소개" },
  { href: "/reviews", label: "고객 후기" },
  { href: "/quote", label: "견적문의" },
  { href: "/academy", label: "아카데미" },
  { href: "/points", label: "포인트 적립" },
];

const SERVICE_LINKS = [
  { href: "/about", label: "줄눈 시공" },
  { href: "/about", label: "입주 청소" },
  { href: "/about", label: "탄성 코트" },
  { href: "/about", label: "나노 코팅" },
  { href: "/about", label: "새집증후군 제거" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* ── 메인 푸터 콘텐츠 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* ── 회사 정보 영역 ── */}
          <div className="lg:col-span-1">
            {/* 로고 */}
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
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-cyan">
              서비스
            </h3>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 빠른 링크 ── */}
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-cyan">
              바로가기
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 연락처 정보 ── */}
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-cyan">
              연락처
            </h3>
            <div className="space-y-3 text-sm text-white/60">
              {/* 전화번호 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>031-0000-0000</span>
              </div>
              {/* 이메일 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>bbonomall1021@gmail.com</span>
              </div>
              {/* 주소 */}
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>경기도 양주시 화합로1710번길 76<br />4층 공장435호 (옥정동, 슈프림더브릭스타워)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단 저작권 바 ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© 2025 더케어. All rights reserved.</p>
            <p>사업자등록번호: 282-55-00733 | 대표: 문성민</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
