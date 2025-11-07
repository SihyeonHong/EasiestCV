import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { ReturnedTid } from "@/types/tab";
import { SignupRequest } from "@/types/user-account";
import { query } from "@/utils/database";

export async function POST(request: NextRequest) {
  try {
    const { userid, username, email, password } =
      (await request.json()) as SignupRequest;

    if (!userid || !username || !email || !password) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // users에 회원정보 생성
    await query(
      "INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4)",
      [userid, username, email, hashedPassword],
    );

    // Home 생성
    await query(
      "INSERT INTO user_home (userid, intro_html, img_url) VALUES ($1, $2, $3)",
      [userid, "", ""],
    );

    // 새 탭 1개 생성: DB가 자동생성해준 tid 받아서 slug 업데이트
    const generatedTid: ReturnedTid = await query(
      "INSERT INTO tabs (userid, tname, torder, slug) VALUES ($1, $2, $3, $4) RETURNING tid",
      [userid, "Tab1", 0, ""],
    );
    if (generatedTid && generatedTid[0]?.tid) {
      await query("UPDATE tabs SET slug = $1 WHERE tid = $2", [
        generatedTid[0].tid.toString(),
        generatedTid[0].tid,
      ]);
    }

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    // 중복 키 에러 처리
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { message: "이미 사용 중인 아이디입니다." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "회원가입 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
