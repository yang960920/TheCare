/** /api/company — 회사 정보 API
 *  GET:   조회
 *  PATCH: 수정
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const company = await prisma.companyInfo.findUnique({
    where: { id: "company_main" },
  });
  const stats = await prisma.companyStat.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ ...company, stats });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { stats, ...companyData } = body;

    // 회사 기본 정보 수정
    if (Object.keys(companyData).length > 0) {
      await prisma.companyInfo.update({
        where: { id: "company_main" },
        data: companyData,
      });
    }

    // 통계 수정 (전체 교체)
    if (stats && Array.isArray(stats)) {
      await prisma.companyStat.deleteMany();
      await prisma.companyStat.createMany({
        data: stats.map((s: { label: string; value: string }, i: number) => ({
          label: s.label,
          value: s.value,
          order: i + 1,
        })),
      });
    }

    const result = await prisma.companyInfo.findUnique({
      where: { id: "company_main" },
    });
    const updatedStats = await prisma.companyStat.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ ...result, stats: updatedStats });
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
