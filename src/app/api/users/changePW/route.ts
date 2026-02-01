import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

import { SignupRequest } from "@/types/user-account";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function PATCH(request: NextRequest) {
  try {
    const { userid, currentPassword, newPassword } = await request.json();

    // 입력값 검증
    if (!userid || !currentPassword || !newPassword) {
      return ApiError.missingFields([
        "userid",
        "currentPassword",
        "newPassword",
      ]);
    }

    // 사용자 조회
    const result = await query<SignupRequest>(
      "SELECT * FROM users WHERE userid = $1",
      [userid],
    );
    if (result.length <= 0) {
      return ApiError.userNotFound();
    }

    const isMatch = await bcrypt.compare(currentPassword, result[0].password);
    if (!isMatch) {
      return ApiError.wrongPassword();
    }

    // 비밀번호만 newPassword로 바꾸는 patch 쿼리
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = $1 WHERE userid = $2", [
      hashedPassword,
      userid,
    ]);

    return ApiSuccess.updated();
  } catch (error: unknown) {
    return handleApiError(error, "비밀번호 변경 실패");
  }
}
