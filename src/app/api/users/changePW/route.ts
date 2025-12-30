import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { SignupRequest } from "@/types/user-account";
import { query } from "@/utils/database";

export async function PATCH(request: NextRequest) {
  try {
    const { userid, currentPassword, newPassword } = await request.json();

    // 입력값 검증
    if (!userid || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "필수 입력값이 누락되었습니다." },
        { status: 400 },
      );
    }

    // 사용자 조회
    const result = await query<SignupRequest>(
      "SELECT * FROM users WHERE userid = $1",
      [userid],
    );
    if (result.length <= 0) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, result[0].password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "현재 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    // 비밀번호만 newPassword로 바꾸는 patch 쿼리
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = $1 WHERE userid = $2", [
      hashedPassword,
      userid,
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다.",
      },
      { status: 200 },
    );
  } catch {
    console.error("비밀번호 변경 실패");

    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
