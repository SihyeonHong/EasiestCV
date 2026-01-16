import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";

// 환경변수 확인
const { email_host, email_port, email_pass } = process.env;

if (!email_host || !email_port || !email_pass) {
  throw new Error("Environment Variables");
}

const ADMIN_EMAIL = "admin@easiest-cv.com";

// 트랜스포터 전역 설정
const transporter = nodemailer.createTransport({
  host: email_host,
  port: email_port,
  secure: true,
  auth: {
    user: ADMIN_EMAIL,
    pass: email_pass,
  },
} as nodemailer.TransportOptions);

export async function POST(request: NextRequest) {
  try {
    const { name, email: user_email, subject, content } = await request.json();

    const mailOptions = {
      from: "user@easiest-cv.com",
      to: ADMIN_EMAIL,
      replyTo: user_email,
      subject: subject,
      text: `
From: ${name} <${user_email}>

${content}
  `,
    };
    await transporter.sendMail(mailOptions);
    return ApiSuccess.created();
  } catch (error: unknown) {
    return handleApiError(error, "문의 메일 전송 실패");
  }
}
