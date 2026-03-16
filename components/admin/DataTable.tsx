/** DataTable.tsx — 어드민 공통 데이터 테이블
 *
 *  기능:
 *  - 제네릭 타입으로 어떤 데이터든 표시 가능
 *  - 컬럼 정의 (key, 라벨, 렌더 함수)
 *  - 가로 스크롤 (모바일 반응형)
 */
"use client";

import React from "react";

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
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<T>) {
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
            {data.length === 0 ? (
              /* 데이터 없을 때 */
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 text-sm ${col.className || ""}`}>
                      {col.render(item, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
