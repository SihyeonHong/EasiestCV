import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query("SELECT * FROM user_home WHERE userid = $1", [
      userId,
    ]);

    if (!result[0]) {
      return ApiError.userNotFound("홈 데이터를 찾을 수 없습니다.");
    }

    return ApiSuccess.data(result[0]);
  } catch (error: unknown) {
    return handleApiError(error, "홈 데이터 조회 실패");
  }
}
