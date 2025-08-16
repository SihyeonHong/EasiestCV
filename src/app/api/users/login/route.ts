import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { SignupRequest } from "@/models/user.model";
import { query } from "@/utils/database";

export async function POST(request: NextRequest) {
  const startAll = Date.now();
  try {
    const startBody = Date.now();
    const { userid, password } = await request.json();
    console.log("Parsing request body took", Date.now() - startBody, "ms");

    if (!userid || !password) {
      return NextResponse.json(
        {
          message: "아이디와 비밀번호를 입력해주세요.",
          errorType: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    const startQuery = Date.now();
    const result = await query<SignupRequest>(
      "SELECT * FROM users WHERE userid = $1",
      [userid],
    );
    console.log("DB query took", Date.now() - startQuery, "ms");

    // 사용자가 존재하지 않는 경우
    if (result.length === 0) {
      console.error(`로그인 실패 - 존재하지 않는 사용자: ${userid}`);
      return NextResponse.json(
        {
          message: "존재하지 않는 아이디입니다.",
          errorType: "USER_NOT_FOUND",
        },
        { status: 404 },
      );
    }

    const startCompare = Date.now();
    const isMatch = await bcrypt.compare(password, result[0].password);
    console.log("bcrypt.compare took", Date.now() - startCompare, "ms");

    // 비밀번호가 틀린 경우
    if (!isMatch) {
      console.error(`로그인 실패 - 비밀번호 불일치: ${userid}`);
      return NextResponse.json(
        {
          message: "비밀번호가 틀렸습니다.",
          errorType: "WRONG_PASSWORD",
        },
        { status: 401 },
      );
    }

    // 환경변수
    const payload = { userid: result[0].userid };
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET이 환경변수에 설정되지 않았습니다.");
      return NextResponse.json(
        {
          message: "서버 내부 오류가 발생했습니다.",
          errorType: "SERVER_ERROR",
        },
        { status: 500 },
      );
    }

    const startJwt = Date.now();
    const token = jwt.sign(payload, secret, { expiresIn: "12h" });
    console.log("JWT signing took", Date.now() - startJwt, "ms");

    const response = NextResponse.json(
      {
        message: "로그인 성공",
        user: {
          userid: result[0].userid,
        },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: undefined, // session cookie
      expires: undefined, // session cookie
      path: "/",
    });

    console.log("Total login time:", Date.now() - startAll, "ms");
    return response;
  } catch (error) {
    console.error("로그인 처리 중 에러:", error);

    return NextResponse.json(
      {
        message: "서버 내부 오류가 발생했습니다.",
        errorType: "SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
