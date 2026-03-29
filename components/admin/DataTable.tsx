/** DataTable.tsx — 어드민 공통 데이터 테이블
 *
 *  기능:
 *  - 제네릭 타입으로 어떤 데이터든 표시 가능
 *  - 컬럼 정의 (key, 라벨, 렌더 함수)
 *  - 가로 스크롤 (모바일 반응형)
 */
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── 컬럼 정의 타입 ── */
export interface Column<T> {
  key: string;
  label: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

/* ── Props 타입 ── */
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  itemsPerPage?: number;
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
  itemsPerPage = 15,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지 데이터 추출
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* 가로 스크롤 래퍼 (모바일 대응) */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {/* 테이블 헤더 */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {/* 테이블 바디 */}
          <tbody className="divide-y divide-slate-100">
            {currentData.length === 0 ? (
              /* 데이터 없을 때 */
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr
                  key={startIndex + index}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 text-sm ${col.className || ""}`}>
                      {col.render(item, startIndex + index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── 페이지네이션 하단 바 ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              다음
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                총 <span className="font-medium text-navy">{data.length}</span>개 중{" "}
                <span className="font-medium">{startIndex + 1}</span>-
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, data.length)}
                </span>
                개 표시
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                      page === currentPage
                        ? "z-10 bg-gold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
