/** /api/services — 서비스 API
 *  GET: 목록 조회 (정렬순)
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}
