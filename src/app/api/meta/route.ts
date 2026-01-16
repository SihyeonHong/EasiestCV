import { UserSiteMeta } from "@/types/user-data";
import { validateRequiredFields, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    const result = await query<UserSiteMeta>(
      "SELECT * FROM user_site_meta WHERE userid = $1",
      [userid],
    );

    return ApiSuccess.data<UserSiteMeta | null>(result[0] ?? null);
  } catch (error: unknown) {
    return handleApiError(error, "메타데이터 조회 실패");
  }
}

export async function PUT(request: Request) {
  try {
    const { userid, title, description } = await request.json();

    // 필수 필드 검증
    const validationError = validateRequiredFields({
      userid,
      title,
      description,
    });
    if (validationError) {
      return validationError;
    }

    // UPSERT: 존재하면 업데이트, 없으면 생성
    await query<UserSiteMeta>(
      `INSERT INTO user_site_meta (userid, title, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (userid)
       DO UPDATE SET title = $2, description = $3
       RETURNING *`,
      [userid, title, description],
    );

    return ApiSuccess.updated();
  } catch (error: unknown) {
    return handleApiError(error, "메타데이터 저장 실패");
  }
}
