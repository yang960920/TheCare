/** app/layout.tsx — 루트 레이아웃
 *
 *  역할:
 *  - 전역 메타데이터 설정 (SEO 타이틀, 설명)
 *  - Google Fonts 프리로드
 *  - Header(GNB) + Footer 공통 배치
 *  - 모든 페이지에 글로벌 CSS 적용
 */
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ── SEO 메타데이터 설정 ── */
export const metadata: Metadata = {
  title: "CleanMaster | 프리미엄 청소 전문 기업",
  description:
    "줄눈 시공, 입주 청소, 탄성 코트, 나노 코팅, 새집증후군 제거까지. 클린마스터가 깨끗한 공간을 만들어 드립니다.",
};

/* ── 루트 레이아웃 컴포넌트 ── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        {/* 상단 네비게이션 */}
        <Header />

        {/* 페이지 콘텐츠 영역 */}
        <main className="flex-1">{children}</main>

        {/* 하단 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
