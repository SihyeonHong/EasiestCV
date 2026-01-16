import { readFileSync } from "fs";
import { join } from "path";

import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

import { DEFAULT_IMG } from "@/constants/constants";
import { ReturnedTid } from "@/types/tab";
import { SignupRequest } from "@/types/user-account";
import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import makeUserSiteMeta from "@/utils/makeUserSiteMeta";
import { normalizeHtmlWhitespace } from "@/utils/sanitize";
import { validateMissingFields } from "@/utils/validateMissingFields";

export async function POST(request: NextRequest) {
  try {
    const { userid, username, email, password } =
      (await request.json()) as SignupRequest;

    const errorResponse = validateMissingFields({
      userid,
      username,
      email,
      password,
    });
    if (errorResponse) {
      return errorResponse;
    }

    // 검증 완료
    // 새 회원정보 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4)",
      [userid, username, email, hashedPassword],
    );

    // 새 회원 기본 정보 생성: home, metadata, tab
    await query(
      "INSERT INTO user_home (userid, intro_html, img_url) VALUES ($1, $2, $3)",
      [userid, "", DEFAULT_IMG],
    );

    const defaultMeta = makeUserSiteMeta(userid, username);
    await query(
      "INSERT INTO user_site_meta (userid, title, description) VALUES ($1, $2, $3)",
      [defaultMeta.userid, defaultMeta.title, defaultMeta.description],
    );

    // 새 탭에 템플릿 넣기 위한 파일 읽기
    let templateContent = "";
    try {
      const templatePath = join(
        process.cwd(),
        "public",
        "papers-template.html",
      );
      const rawTemplate = readFileSync(templatePath, "utf-8");
      templateContent = normalizeHtmlWhitespace(rawTemplate);
    } catch {
      console.error("템플릿 파일 읽기 실패");
      // 템플릿 파일을 읽지 못해도 계속 진행 (빈 문자열 사용)
    }

    // DB가 자동생성해준 tid 받아서 slug 업데이트
    const generatedTid: ReturnedTid = await query(
      "INSERT INTO tabs (userid, tname, torder, slug, contents) VALUES ($1, $2, $3, $4, $5) RETURNING tid",
      [userid, "Papers", 0, "", templateContent],
    );
    if (generatedTid && generatedTid[0]?.tid) {
      await query("UPDATE tabs SET slug = $1 WHERE tid = $2", [
        generatedTid[0].tid.toString(),
        generatedTid[0].tid,
      ]);
    }

    return ApiSuccess.created();
  } catch (error: unknown) {
    return handleApiError(error, "회원가입 실패");
  }
}
