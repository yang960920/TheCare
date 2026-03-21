/** /api/academy/courses/[id] — 아카데미 과정 개별 수정·삭제 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { id: _, createdAt, updatedAt, ...data } = body;
    const course = await prisma.academyCourse.update({
      where: { id },
      data,
    });
    return NextResponse.json(course);
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
    await prisma.academyCourse.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 400 });
  }
}
