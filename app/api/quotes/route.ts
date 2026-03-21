/** /api/quotes — 견적 문의 API
 *  GET:  목록 조회 (최신순)
 *  POST: 새 문의 등록 (사용자 견적 폼에서 호출)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quotes = await prisma.quoteInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quote = await prisma.quoteInquiry.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        serviceType: body.serviceType,
        area: body.area,
        memo: body.memo ?? "",
        status: "미확인",
      },
    });
    return NextResponse.json(quote, { status: 201 });
  } catch {
    return NextResponse.json({ error: "견적 등록 실패" }, { status: 400 });
  }
}
