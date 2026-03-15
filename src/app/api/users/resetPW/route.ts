import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

import { Locale } from "@/i18n/routing";
import { ResetPasswordRequest, User } from "@/types/user-account";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import { generateRandomPW } from "@/utils/generateRandomPW";
import { SENDER_EMAIL, transporter } from "@/utils/mailer";
import { tempPWTemplate } from "@/utils/tempPWTemplate";

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
      from: SENDER_EMAIL,
      to: email,
      subject: t.subject,
      html: tempPWTemplate({ tempPassword, locale }),
    };

    // 이메일 전송 및 DB 업데이트
    await transporter.sendMail(mailOptions);

    await query("UPDATE users SET password = $1 WHERE userid = $2", [
      hashedPassword,
      userid,
    ]);

    return ApiSuccess.updated();
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
