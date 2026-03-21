/** /api/events — 포인트 이벤트 API
 *  GET:  목록 조회
 *  POST: 새 이벤트 추가
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.pointEvent.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = await prisma.pointEvent.create({ data: body });
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "이벤트 등록 실패" }, { status: 400 });
  }
}
