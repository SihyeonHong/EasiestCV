import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { ApiErrorResponse } from "@/models/api";
import { SignupRequest } from "@/models/user.model";
import { post } from "@/utils/http";

export default function useSignUp() {
  const tSignup = useTranslations("signup");
  const tError = useTranslations("error");

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignupRequest) => {
      await post(`/users/signup`, data);
    },
    onSuccess: () => {
      alert(tSignup("signupSuccess"));
      window.location.reload();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.log("회원가입 실패: ", error);

      // 네트워크 에러 (서버에 연결 불가)
      if (!error.response) {
        alert(tError("networkError"));
        console.error("네트워크 에러:", error.message);
        return;
      }

      // 서버에서 응답은 왔지만 에러인 경우
      const { status, data } = error.response;
      const message = data.message || tSignup("signupFail");

      switch (status) {
        case 400:
          alert(tError("missingFields"));
          break;
        case 409:
          alert(tSignup("duplicateId"));
          break;
        case 500:
          alert(tError("serverError"));
          break;
        default:
          alert(message);
          break;
      }

      console.error(`회원가입 에러 (HTTP ${status}):`, message);
    },
  });

  return {
    signup,
    isSigningUp,
  };
}
