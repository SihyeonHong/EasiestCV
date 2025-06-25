import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { ApiErrorResponse } from "@/models/api";
import { LoginForm, SignupRequest } from "@/models/user.model";
import { get, post } from "@/util/http";

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
  const tInitPage = useTranslations("initPage");

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
        alert(tMessage("networkError"));
        console.error("네트워크 에러:", error.message);
        return;
      }

      // 서버에서 응답은 왔지만 에러인 경우
      const { status, data } = error.response;
      const errorType = data.errorType;
      const message = data.message || tMessage("unknownError");

      switch (errorType) {
        case "MISSING_FIELDS":
          alert(tMessage("missingFields"));
          break;
        case "USER_NOT_FOUND":
          alert(tMessage("noUser"));
          break;
        case "WRONG_PASSWORD":
          alert(tMessage("passwordMismatch"));
          break;
        case "SERVER_ERROR":
          alert(tMessage("serverError"));
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
        throw new Error("Logout cancelled");
      }
      const currentUserId = me?.userid;
      const response = await post<{ message: string }>(`/users/logout`);
      return { response, currentUserId };
    },
    onSuccess: ({ currentUserId }) => {
      if (currentUserId) {
        router.push(`/${currentUserId}`);
      } else {
        router.push("/");
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
    onError: (error: Error) => {
      if (error.message === "Logout cancelled") return;
      console.log("Logout Failed: ", error);
    },
  });

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignupRequest) => {
      try {
        const response = await post<{ message: string }>(`/users/signup`, data);
        return response;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          // Axios 에러인 경우, 서버에서 보낸 메시지를 그대로 throw
          throw new Error(
            error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
          );
        }
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    },
    onSuccess: (response) => {
      alert(response.message); // 회원가입이 완료되었습니다.
      router.push("/"); // 로그인 페이지로 이동 - 이거 안되더라 새로고침 해줘야 할듯
    },
    onError: (error: Error) => {
      console.log(error.message);
      alert(error.message); // 서버에서 전달받은 에러 메시지 표시
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
