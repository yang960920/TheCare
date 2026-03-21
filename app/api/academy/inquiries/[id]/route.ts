/** /api/academy/inquiries/[id] — 수강 신청 상태 수정 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const inquiry = await prisma.academyInquiry.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
