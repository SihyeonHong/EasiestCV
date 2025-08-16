import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { useRouter } from "@/i18n/routing";
import { ApiErrorResponse } from "@/models/api";
import { LoginForm, SignupRequest } from "@/models/user.model";
import { get, post } from "@/utils/http";

interface LoginResponse {
  message: string;
  user: {
    userid: string;
  };
}

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");
  const tInitPage = useTranslations("initpage");

  const { data: me, isLoading } = useQuery({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      try {
        const response = await get<{ userid: string }>(`/users/me`);
        return response;
      } catch {
        return null;
      }
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await post<LoginResponse>(`/users/login`, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
      router.push(`/${response.user.userid}/admin`);
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
          alert(tInitPage("loginFail"));
          break;
      }

      console.error(`${errorType || "UNKNOWN"} (HTTP ${status}):`, message);
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      if (!confirm(tMessage("confirmLogout"))) {
        return null; // 취소된 경우 null 반환
      }
      const currentUserId = me?.userid;
      const response = await post<{ message: string }>(`/users/logout`);
      return { response, currentUserId };
    },
    onSuccess: (data) => {
      if (!data) return; // confirm 취소된 경우 아무것도 하지 않음

      const { currentUserId } = data;
      if (currentUserId) {
        router.push(`/${currentUserId}`);
      } else {
        router.push("/");
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.log("로그아웃 실패: ", error);

      // 네트워크 에러 (서버에 연결 불가)
      if (!error.response) {
        alert(tError("networkError"));
        console.error("네트워크 에러:", error.message);
        return;
      }

      // 서버에서 응답은 왔지만 에러인 경우
      const { status, data } = error.response;
      const message = data.message || tError("unknownError");

      if (status === 500) {
        alert(tError("networkError"));
      } else {
        alert(message);
      }

      console.error(`로그아웃 에러 (HTTP ${status}):`, message);
    },
  });

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignupRequest) => {
      await post(`/users/signup`, data);
    },
    onSuccess: () => {
      alert(tInitPage("signupSuccess"));
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
      const message = data.message || tInitPage("signupFail");

      switch (status) {
        case 400:
          alert(tError("missingFields"));
          break;
        case 409:
          alert(tInitPage("duplicateId"));
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
    me,
    isLoading,
    login,
    isLoggingIn,
    logout,
    isLoggingOut,
    signup,
    isSigningUp,
  };
}
