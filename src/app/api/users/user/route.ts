import { NextResponse } from "next/server";

import { ApiErrorResponse, DBError } from "@/types/error";
import { query } from "@/utils/database";
import { validateMissingFields } from "@/utils/validateMissingFields";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query("SELECT * FROM users WHERE userid = $1", [
      userId,
    ]);

    if (result.length === 0) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.error("사용자 정보 조회 실패");

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userid, username, email } = await request.json();

    const errorResponse = validateMissingFields({
      userid,
      username,
      email,
    });
    if (errorResponse) {
      return errorResponse;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: ApiErrorResponse = {
        message: "올바른 이메일 형식이 아닙니다.",
        errorType: "VALIDATION_ERROR",
      };
      return NextResponse.json(response, { status: 400 });
    }

    await query(
      "UPDATE users SET username = $1, email = $2 WHERE userid = $3",
      [username, email, userid],
    );

    return NextResponse.json({
      message: "회원정보가 수정되었습니다.",
    });
  } catch (error: unknown) {
    console.error("회원정보 수정 실패");

    // DB 연결 오류
    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as DBError;
      if (dbError.code === "ECONNREFUSED" || dbError.code === "ENOTFOUND") {
        const response: ApiErrorResponse = {
          message: "데이터베이스 연결에 실패했습니다.",
          errorType: "DATABASE_CONNECTION_ERROR",
        };
        return NextResponse.json(response, { status: 503 });
      }

      // DB 제약 조건 위반
      if (dbError.code === "23505") {
        // PostgreSQL unique constraint violation
        const response: ApiErrorResponse = {
          message: "중복된 데이터가 존재합니다.",
          errorType: "DUPLICATE_DATA",
        };
        return NextResponse.json(response, { status: 409 });
      }
    }

    // JSON 파싱 오류
    if (error instanceof SyntaxError) {
      const response: ApiErrorResponse = {
        message: "잘못된 요청 형식입니다.",
        errorType: "INVALID_JSON",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 일반적인 에러
    if (error instanceof Error) {
      const response: ApiErrorResponse = {
        message: error.message || "서버 내부 오류가 발생했습니다.",
        errorType: "INTERNAL_ERROR",
      };
      return NextResponse.json(response, { status: 500 });
    }

    // 알 수 없는 에러
    const response: ApiErrorResponse = {
      message: "알 수 없는 오류가 발생했습니다.",
      errorType: "UNKNOWN_ERROR",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
