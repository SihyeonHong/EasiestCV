import { NextRequest } from "next/server";

import { CheckEmailResponse } from "@/types/user-account";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return ApiError.missingFields(["email"]);
    }

    const rows = await query<{ userid: string }>(
      "SELECT userid FROM users WHERE email = $1",
      [email],
    );

    const exists = rows.length > 0;
    const userids = rows.map((row) => row.userid);

    const data: CheckEmailResponse = { exists, userids };

    return ApiSuccess.data(data);
  } catch (error: unknown) {
    return handleApiError(error, "이메일 중복 확인 실패");
  }
}
