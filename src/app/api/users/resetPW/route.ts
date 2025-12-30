import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

import { Locale } from "@/i18n/routing";
import { ResetPasswordRequest, User } from "@/types/user-account";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import { generateRandomPW } from "@/utils/generateRandomPW";
import { tempPWTemplate } from "@/utils/tempPWTemplate";

// 환경변수 확인
const { email_host, email_port, email_user, email_pass } = process.env;

if (!email_host || !email_port || !email_user || !email_pass) {
  throw new Error("Environment Variables");
}

// 트랜스포터 전역 설정
const transporter = nodemailer.createTransport({
  host: email_host,
  port: email_port,
  secure: true,
  auth: {
    user: email_user,
    pass: email_pass,
  },
} as nodemailer.TransportOptions);

export async function PUT(request: NextRequest) {
  try {
    const { userid, email, locale } =
      (await request.json()) as ResetPasswordRequest;

    if (!userid || !email) {
      return ApiError.missingFields(["userid", "email"]);
    }

    // 사용자 확인
    const result = await query<User>("SELECT * FROM users WHERE userid = $1", [
      userid,
    ]);

    if (result.length === 0 || email !== result[0].email) {
      return ApiError.userNotFound();
    }

    // 임시 비밀번호 생성
    const tempPassword = generateRandomPW();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 이메일 내용 생성
    const t = translations[locale as Locale] || translations.en;
    const mailOptions = {
      from: email_user,
      to: email,
      subject: t.subject,
      html: tempPWTemplate({ tempPassword, locale }),
    };

    // 이메일 전송 및 DB 업데이트
    try {
      await transporter.sendMail(mailOptions);

      // 이메일 전송 성공 시에만 DB 업데이트
      await query("UPDATE users SET password = $1 WHERE userid = $2", [
        hashedPassword,
        userid,
      ]);

      return ApiSuccess.success("임시 비밀번호가 이메일로 전송되었습니다.");
    } catch {
      console.error("이메일 전송 실패");
      throw new Error("이메일 전송에 실패했습니다.");
    }
  } catch (error: unknown) {
    return handleApiError(error, "비밀번호 재설정 실패");
  }
}

const translations = {
  en: {
    subject: "Easiest CV: Your Temporary Password",
    text: (temp: string) => `Your Temporary Password: ${temp}`,
  },
  ko: {
    subject: "Easiest CV: 임시 비밀번호 안내",
    text: (temp: string) => `임시 비밀번호: ${temp}`,
  },
};
