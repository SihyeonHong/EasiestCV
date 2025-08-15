import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { SignupRequest } from "@/models/user.model";
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

    // DB에 사용자 정보 저장
    await query(
      "INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4)",
      [userid, username, email, hashedPassword],
    );

    // 사용자 기본 정보 생성
    await query("INSERT INTO userinfo (userid) VALUES ($1)", [userid]);

    // 기본 탭 생성
    await query(
      "INSERT INTO tabs (userid, tname, torder) VALUES ($1, $2, $3)",
      [userid, "Tab1", 0],
    );

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
