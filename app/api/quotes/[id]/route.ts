/** /api/quotes/[id] — 견적 문의 개별 수정
 *  PATCH: 상태 변경 / 연락 이력 업데이트
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
    const quote = await prisma.quoteInquiry.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
