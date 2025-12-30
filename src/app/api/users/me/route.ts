import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return ApiError.validation("인증 토큰이 없습니다.", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET이 환경변수에 설정되지 않았습니다.");
    }

    const decoded = jwt.verify(token, secret) as { userid: string };

    return ApiSuccess.data({ userid: decoded.userid });
  } catch (error: unknown) {
    return handleApiError(error, "사용자 정보 조회 실패");
  }
}
