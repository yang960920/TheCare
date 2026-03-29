/** /api/notices — 공지사항 API */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const where = all ? {} : { visible: true };
    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(notices);
  } catch (e) {
    console.error("공지사항 조회 실패:", e);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await prisma.notice.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("공지사항 생성 실패:", e);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
