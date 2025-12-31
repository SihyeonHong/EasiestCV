import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { useRouter } from "@/i18n/routing";
import { ApiErrorResponse } from "@/types/error";
import { LoginForm, User } from "@/types/user-account";
import { post } from "@/utils/http";

export default function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await post<User>(`/users/login`, data);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth(), response);
      setTimeout(() => {
        router.push(`/${response.userid}/admin`);
      }, 50);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.log("로그인 실패: ", error);

      // 네트워크 에러 (서버에 연결 불가)
      if (!error.response) {
        alert(tError("networkError"));
        console.error("네트워크 에러:", error.message);
        return;
      }

      // 서버에서 응답은 왔지만 에러인 경우
      const { status, data } = error.response;
      const errorType = data.errorType;
      const message = data.message || tError("unknownError");

      switch (errorType) {
        case "MISSING_FIELDS":
          alert(tError("missingFields"));
          break;
        case "USER_NOT_FOUND":
          alert(tMessage("noUser"));
          break;
        case "WRONG_PASSWORD":
          alert(tMessage("passwordMismatch"));
          break;
        case "SERVER_ERROR":
          alert(tError("serverError"));
          break;
        default:
          alert(tError("loginFail"));
          break;
      }

      console.error(`${errorType || "UNKNOWN"} (HTTP ${status}):`, message);
    },
  });

  return {
    login,
    isLoggingIn,
  };
}
