/** /api/academy/inquiries — 아카데미 수강 신청 API
 *  GET:  목록 조회 (관리자)
 *  POST: 새 신청 (사용자)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inquiries = await prisma.academyInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiry = await prisma.academyInquiry.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        courseTitle: body.courseTitle,
        memo: body.memo ?? "",
        status: "미확인",
      },
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "신청 실패" }, { status: 400 });
  }
}
