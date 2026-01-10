import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { ApiErrorResponse } from "@/types/error";
import { User } from "@/types/user-account";
import { get, post } from "@/utils/http";

export default function useAuth() {
  const queryClient = useQueryClient();
  const tError = useTranslations("error");

  const { data: me } = useQuery({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      try {
        return await get<User>(`/users/me`);
      } catch {
        return null;
      }
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await post(`/users/logout`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (!error.response) {
        alert(tError("networkError"));
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
    },
  });

  return {
    me,
    logout,
    isLoggingOut,
  };
}
