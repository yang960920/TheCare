/** /api/academy/courses — 아카데미 과정 API
 *  GET:  목록 조회
 *  POST: 새 과정 추가
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.academyCourse.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const course = await prisma.academyCourse.create({ data: body });
    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json({ error: "과정 등록 실패" }, { status: 400 });
  }
}
