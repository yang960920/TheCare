/** /api/upload — 이미지 업로드 API (Vercel Blob)
 *
 *  POST: FormData(file) → Blob에 업로드 → { url } 반환
 *
 *  사용처:
 *  - 관리자 서비스 이미지
 *  - 관리자 히어로 배경 이미지
 *  - 관리자 팝업 이미지
 *  - 관리자 아카데미 과정 이미지
 *  - 고객 후기 이미지
 */
import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 5MB 이하만 가능합니다" },
        { status: 400 }
      );
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다" },
        { status: 400 }
      );
    }

    // Vercel Blob에 업로드
    const blob = await put(`thecare/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("업로드 실패:", e);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}

/** DELETE: 기존 이미지 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL이 없습니다" }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("삭제 실패:", e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
