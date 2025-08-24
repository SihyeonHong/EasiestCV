import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { ApiErrorResponse } from "@/models/api";
import { ChangePWRequest, User } from "@/models/user.model";
import { get, patch, put } from "@/utils/http";

export const useUserInfo = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");
  const tChangePW = useTranslations("changePassword");

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: queryKeys.user({ userid }),
    queryFn: async () => {
      const response = await get<User>(`/users/user?userid=${userid}`);
      if (!response) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      return response;
    },
    retry: false,
  });

  const {
    mutate: updateUserInfo,
    status: updateStatus,
    error: updateError,
  } = useMutation({
    mutationFn: (payload: User) => put(`/users/user`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user({ userid }) });
      alert(tMessage("saveSuccess"));
    },
    onError: (error: AxiosError) => {
      console.error("회원정보 수정 오류:", error);

      // 네트워크 에러
      if (!error.response) {
        alert(
          error.code === "ECONNABORTED"
            ? tError("timeout")
            : tError("networkError"),
        );
        return;
      }

      // 서버 에러
      const errorData = error.response.data as ApiErrorResponse;
      const status = error.response.status;

      // 주요 케이스만 처리
      if (status === 400 && errorData?.errorType === "VALIDATION_ERROR") {
        console.log(errorData.message);
        alert(tError("missingFields"));
      } else {
        console.log(status, errorData.message);
        alert(tError("saveFail"));
      }
    },
  });

  const { mutate: changePWMutation, status: changePWStatus } = useMutation({
    mutationFn: (payload: ChangePWRequest) => patch(`/users/changePW`, payload),
    onSuccess: () => {
      alert(tChangePW("changeSuccess"));
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error("전체 에러", error);

      // 네트워크 에러
      if (!error.response || error.request?.status === 0) {
        console.log("네트워크 에러");
        alert(tError("networkError"));
        return;
      }

      // 서버 응답 있음
      if (error.response.data?.error) {
        console.error("서버 에러:", error.response.data.error);
      }

      if (error.response?.status === 401) {
        alert(tChangePW("invalidCurrent")); // "현재 비밀번호가 올바르지 않습니다."
      } else {
        alert(tChangePW("changeFail")); // "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요."
      }
    },
  });

  return {
    user,
    isUserLoading,
    isUserError,
    updateUserInfo,
    updateStatus,
    updateError,
    changePWMutation,
    changePWStatus,
  };
};
