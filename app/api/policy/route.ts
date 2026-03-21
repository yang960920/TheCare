/** /api/policy — 포인트 정책 API
 *  GET:   조회
 *  PATCH: 수정
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const policy = await prisma.pointPolicy.findUnique({
    where: { id: "policy_main" },
  });
  return NextResponse.json(policy);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const policy = await prisma.pointPolicy.update({
      where: { id: "policy_main" },
      data: { text: body.text },
    });
    return NextResponse.json(policy);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
