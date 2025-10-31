import { NextResponse } from "next/server";

import { UserSiteMeta } from "@/types/user-data";
import { ApiError, validateRequiredFields } from "@/utils/api-error";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    const result = await query<UserSiteMeta>(
      "SELECT * FROM user_site_meta WHERE userid = $1",
      [userid],
    );

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return ApiError.server("메타데이터 조회 중 오류가 발생했습니다.");
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

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Meta update error:", error);
    return ApiError.server("메타데이터 저장 중 오류가 발생했습니다.");
  }
}
