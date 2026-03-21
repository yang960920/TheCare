/** /api/hero — 히어로 섹션 API
 *  GET:   조회
 *  PATCH: 수정
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const hero = await prisma.heroSection.findUnique({
    where: { id: "hero_main" },
  });
  return NextResponse.json(hero);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const hero = await prisma.heroSection.update({
      where: { id: "hero_main" },
      data: body,
    });
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 400 });
  }
}
