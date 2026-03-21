/** /api/reviews — 후기 API
 *  GET:  목록 조회 (최신순)
 *  POST: 새 후기 등록
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const review = await prisma.review.create({
      data: {
        customerName: body.customerName,
        serviceType: body.serviceType,
        rating: body.rating ?? 5,
        content: body.content,
        imageUrl: body.imageUrl ?? "",
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "후기 등록 실패" }, { status: 400 });
  }
}
