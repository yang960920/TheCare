/** /api/popups — 팝업 공지 API
 *  GET:  목록 조회
 *  POST: 새 팝업 추가
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const popups = await prisma.popup.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(popups);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const popup = await prisma.popup.create({ data: body });
    return NextResponse.json(popup, { status: 201 });
  } catch {
    return NextResponse.json({ error: "팝업 등록 실패" }, { status: 400 });
  }
}
