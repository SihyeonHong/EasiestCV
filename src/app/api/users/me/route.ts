import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { User } from "@/types/user-account";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return ApiError.validation("인증 토큰이 없습니다.", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return ApiError.missingEnvVar("JWT_SECRET");
    }

    const decoded = jwt.verify(token, secret) as { userid: string };

    const result = await query<User>(
      "SELECT userid, username, email FROM users WHERE userid = $1",
      [decoded.userid],
    );

    if (result.length === 0) {
      return ApiError.userNotFound();
    }

    return ApiSuccess.data(result[0]);
  } catch (error: unknown) {
    return handleApiError(error, "사용자 정보 조회 실패");
  }
}
