/** /api/reviews/[id] — 후기 개별 수정·삭제
 *  PATCH:  수정 (관리자 답변, 공개 토글 등)
 *  DELETE: 삭제
 */
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
    const review = await prisma.review.update({
      where: { id },
      data,
    });
    return NextResponse.json(review);
  } catch (e) {
    console.error("Review PATCH error:", e);
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 400 });
  }
}
