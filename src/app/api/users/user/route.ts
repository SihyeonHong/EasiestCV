import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
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
      return ApiError.userNotFound();
    }

    return ApiSuccess.data(result[0]);
  } catch (error: unknown) {
    return handleApiError(error, "사용자 정보 조회 실패");
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
      return ApiError.validation("올바른 이메일 형식이 아닙니다.");
    }

    await query(
      "UPDATE users SET username = $1, email = $2 WHERE userid = $3",
      [username, email, userid],
    );

    return ApiSuccess.updated(undefined, "회원정보가 수정되었습니다.");
  } catch (error: unknown) {
    return handleApiError(error, "회원정보 수정 실패");
  }
}
