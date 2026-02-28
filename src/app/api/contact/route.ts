import { NextRequest } from "next/server";

import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { SENDER_EMAIL, transporter } from "@/utils/mailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email: user_email, subject, content } = await request.json();

    const mailOptions = {
      from: "user@easiest-cv.com",
      to: SENDER_EMAIL,
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
