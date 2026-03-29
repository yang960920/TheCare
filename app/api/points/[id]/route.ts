/** /api/points/[id] — 개별 포인트 신청 API (관리자 승인/답글) */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await prisma.pointApplication.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("포인트 신청 수정 실패:", e);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pointApplication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("포인트 신청 삭제 실패:", e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
