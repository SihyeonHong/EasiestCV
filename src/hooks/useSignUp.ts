import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { ApiErrorResponse } from "@/types/error";
import { SignupRequest } from "@/types/user-account";
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
      // 네트워크 에러 (서버에 연결 불가)
      if (!error.response) {
        alert(tError("networkError"));
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
    },
  });

  return {
    signup,
    isSigningUp,
  };
}
