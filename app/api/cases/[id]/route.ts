/** /api/cases/[id] — 개별 시공사례 API
 *
 *  PATCH:  시공사례 수정
 *  DELETE: 시공사례 삭제
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
    const updated = await prisma.caseStudy.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("시공사례 수정 실패:", e);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("시공사례 삭제 실패:", e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
