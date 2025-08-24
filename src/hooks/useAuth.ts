import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { useRouter } from "@/i18n/routing";
import { ApiErrorResponse } from "@/models/api";
import { get, post } from "@/utils/http";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

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

  return {
    me,
    isLoading,
    logout,
    isLoggingOut,
  };
}
