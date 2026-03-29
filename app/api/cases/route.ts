/** /api/cases — 시공사례 API
 *
 *  GET:  ?serviceType=cleaning → 해당 서비스 시공사례 조회 (visible만)
 *        ?all=true → 관리자용 전체 조회
 *  POST: 새 시공사례 생성
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const all = searchParams.get("all") === "true";

    const where: Record<string, unknown> = {};
    if (serviceType) where.serviceType = serviceType;
    if (!all) where.visible = true;

    const cases = await prisma.caseStudy.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(cases);
  } catch (e) {
    console.error("시공사례 조회 실패:", e);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await prisma.caseStudy.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("시공사례 생성 실패:", e);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
