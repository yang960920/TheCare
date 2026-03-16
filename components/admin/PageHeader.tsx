/** PageHeader.tsx — 어드민 페이지 상단 헤더
 *
 *  용도:
 *  - 각 어드민 페이지 최상단에 페이지 제목 표시
 *  - 우측에 액션 버튼 슬롯 (신규 등록 버튼 등)
 */
"use client";

import React from "react";

interface PageHeaderProps {
  title: string;           // 페이지 제목
  description?: string;    // 설명 텍스트 (선택)
  children?: React.ReactNode; // 우측 액션 버튼 영역
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      {/* 좌측: 타이틀 + 설명 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        )}
      </div>
      {/* 우측: 액션 버튼 슬롯 */}
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
