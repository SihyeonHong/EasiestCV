import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { User } from "@/models/user.model";
import { query } from "@/util/database";

// 환경변수 확인
const { email_service, user, pass } = process.env;

if (!email_service || !user || !pass) {
  throw new Error("Missing email configuration in environment variables");
}

function generateRandomPW(): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

// 트랜스포터 전역 설정
const transporter = nodemailer.createTransport({
  service: email_service,
  auth: {
    user: user,
    pass: pass,
  },
});

interface ResetPasswordRequest {
  userid: string;
  email: string;
}

export async function PUT(request: NextRequest) {
  try {
    const { userid, email } = (await request.json()) as ResetPasswordRequest;

    if (!userid || !email) {
      return NextResponse.json(
        { message: "아이디와 이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    // 사용자 확인
    const result = await query<User>("SELECT * FROM users WHERE userid = $1", [
      userid,
    ]);

    if (result.length === 0 || email !== result[0].email) {
      return NextResponse.json(
        { message: "일치하는 사용자가 없습니다." },
        { status: 404 },
      );
    }

    // 임시 비밀번호 생성
    const tempPassword = generateRandomPW();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const mailOptions = {
      from: user,
      to: email,
      subject: "Easiest CV : Your Temporary Password",
      text: "Your Temporary Password: " + tempPassword,
    };

    // 이메일 전송 및 DB 업데이트
    try {
      await transporter.sendMail(mailOptions);

      // 이메일 전송 성공 시에만 DB 업데이트
      await query("UPDATE users SET password = $1 WHERE userid = $2", [
        hashedPassword,
        userid,
      ]);

      return NextResponse.json(
        { message: "임시 비밀번호가 이메일로 전송되었습니다." },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      throw new Error("이메일 전송에 실패했습니다.");
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        message: "비밀번호 재설정 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
