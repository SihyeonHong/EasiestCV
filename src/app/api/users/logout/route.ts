import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";

export async function POST() {
  try {
    const response = ApiSuccess.created();

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return handleApiError(error, "로그아웃 실패");
  }
}
