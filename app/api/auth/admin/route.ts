/** /api/auth/admin — 관리자 로그인 검증 API
 *  POST: { id, pw } → 환경변수와 비교 → 성공/실패
 *
 *  클라이언트에 하드코딩된 비밀번호를 제거하고
 *  서버 측 환경변수(ADMIN_ID, ADMIN_PW)로 검증합니다.
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, pw } = await req.json();

  const validId = process.env.ADMIN_ID ?? "admin";
  const validPw = process.env.ADMIN_PW ?? "thecare1234";

  if (id === validId && pw === validPw) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." },
    { status: 401 }
  );
}
