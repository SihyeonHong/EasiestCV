import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { LoginForm, SignupRequest } from "@/models/user.model";
import { get, post } from "@/util/http";
import { queryKeys } from "@/constants/queryKeys";

interface LoginResponse {
  message: string;
  user: {
    userid: string;
  };
}

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("message");

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
    onError: (error: Error) => {
      console.log("Login Failed: ", error);
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      if (!confirm(t("confirmLogout"))) {
        throw new Error("Logout cancelled");
      }
      const currentUserId = me?.userid;
      const response = await post<{ message: string }>(`/users/logout`);
      return { response, currentUserId };
    },
    onSuccess: ({ currentUserId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
      if (currentUserId) {
        router.push(`/${currentUserId}`);
      } else {
        router.push("/");
      }
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
      } catch (error: any) {
        // 서버에서 보낸 에러 메시지를 그대로 throw
        throw new Error(
          error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
        );
      }
    },
    onSuccess: (response) => {
      alert(response.message); // 회원가입이 완료되었습니다.
      router.push("/"); // 로그인 페이지로 이동
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
