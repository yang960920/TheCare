/** /api/services/[id] — 서비스 개별 수정
 *  PATCH: 수정 (이름·설명·이미지·공개 토글 등)
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
    const service = await prisma.service.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
