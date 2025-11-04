import { ApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function PATCH(request: Request) {
  try {
    const { userid, intro } = await request.json();

    await query("UPDATE user_home SET intro_html = $1 WHERE userid = $2", [
      intro,
      userid,
    ]);

    return ApiSuccess.updated();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("server error: ", error);
      return ApiError.server();
    } else {
      console.error("unexpected error: ", error);
      return ApiError.unknown();
    }
  }
}
