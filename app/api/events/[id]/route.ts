/** /api/events/[id] — 이벤트 개별 수정·삭제 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const event = await prisma.pointEvent.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pointEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 400 });
  }
}
