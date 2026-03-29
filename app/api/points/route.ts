/** /api/points — 포인트 신청/사용 API */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.pointApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (e) {
    console.error("포인트 신청 조회 실패:", e);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await prisma.pointApplication.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("포인트 신청 생성 실패:", e);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
