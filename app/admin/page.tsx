/** app/admin/page.tsx — 어드민 대시보드
 *
 *  구성:
 *  1. 상단 요약 카드 4개 (견적 문의/후기/아카데미/이벤트)
 *  2. Recharts 라인 차트: 월별 견적 문의 추이
 *  3. Recharts 바 차트: 서비스별 문의 비율
 *  4. 최근 견적 문의 목록 5건 테이블
 *  5. 빠른 바로가기 버튼
 */
"use client";

import Link from "next/link";
import { useAdminStore } from "@/store/adminStore";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  FileText,
  Star,
  GraduationCap,
  Gift,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── 월별 견적 문의 추이 더미 데이터 ── */
const MONTHLY_DATA = [
  { month: "9월", count: 42 },
  { month: "10월", count: 55 },
  { month: "11월", count: 48 },
  { month: "12월", count: 67 },
  { month: "1월", count: 73 },
  { month: "2월", count: 61 },
  { month: "3월", count: 85 },
];

/* ── 서비스별 문의 비율 더미 데이터 ── */
const SERVICE_DATA = [
  { name: "줄눈", value: 32 },
  { name: "입주청소", value: 28 },
  { name: "탄성코트", value: 15 },
  { name: "나노코팅", value: 14 },
  { name: "새집증후군", value: 11 },
];

export default function AdminDashboard() {
  const { quotes, reviews, courses, events } = useAdminStore();

  /* ── 요약 카드 데이터 계산 ── */
  const summaryCards = [
    {
      label: "이번 달 견적 문의",
      value: quotes.length,
      icon: FileText,
      color: "bg-blue-500",
      href: "/admin/quotes",
    },
    {
      label: "등록된 후기",
      value: reviews.length,
      icon: Star,
      color: "bg-amber-500",
      href: "/admin/reviews",
    },
    {
      label: "진행 중 과정",
      value: courses.filter((c) => c.visible).length,
      icon: GraduationCap,
      color: "bg-emerald-500",
      href: "/admin/academy",
    },
    {
      label: "활성 이벤트",
      value: events.filter((e) => e.visible).length,
      icon: Gift,
      color: "bg-purple-500",
      href: "/admin/points",
    },
  ];

  return (
    <>
      <PageHeader title="대시보드" description="더케어 관리자 현황을 한눈에 확인하세요" />

      {/* ═══════════════════════════════════════
       *  요약 카드 4개
       * ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{card.label}</div>
            </Link>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════
       *  차트 영역 (라인 + 바)
       * ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 월별 견적 문의 추이 (라인 차트) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-500" />
            <h3 className="font-semibold text-slate-900">월별 견적 문의 추이</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="건수" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 서비스별 문의 비율 (바 차트) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-emerald-500" />
            <h3 className="font-semibold text-slate-900">서비스별 문의 비율</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SERVICE_DATA} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#00D4FF" radius={[6, 6, 0, 0]} name="비율(%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══════════════════════════════════════
       *  최근 견적 문의 5건 + 바로가기
       * ═══════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">최근 견적 문의</h3>
          <Link href="/admin/quotes" className="text-sm text-cyan-600 hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-500 font-medium pb-3">접수일</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">고객명</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">서비스</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {quotes.slice(0, 5).map((q) => (
                <tr key={q.id} className="border-b border-slate-50">
                  <td className="py-3 text-sm text-slate-600">{q.createdAt}</td>
                  <td className="py-3 text-sm text-slate-900 font-medium">{q.customerName}</td>
                  <td className="py-3 text-sm text-slate-600">{q.serviceType}</td>
                  <td className="py-3"><StatusBadge status={q.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
