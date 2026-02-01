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
  const t = useTranslations("error");

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
      // 네트워크 에러 (서버에 연결 불가)
      if (!error.response) {
        alert(t("networkError"));
        return;
      }

      // 서버에서 응답은 왔지만 에러인 경우
      const { data } = error.response;
      const errorType = data.errorType;

      switch (errorType) {
        case "MISSING_FIELDS":
          alert(t("missingFields"));
          break;
        case "USER_NOT_FOUND":
          alert(t("userNotFound"));
          break;
        case "WRONG_PASSWORD":
          alert(t("passwordMismatch"));
          break;
        case "SERVER_ERROR":
          alert(t("serverError"));
          break;
        default:
          alert(t("loginFail"));
          break;
      }
    },
  });

  return {
    login,
    isLoggingIn,
  };
}
