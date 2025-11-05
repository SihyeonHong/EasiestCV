import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { SaveStatus } from "@/types/tab";
import { UserSiteMeta } from "@/types/user-data";
import { get, put } from "@/utils/http";

export const useMetadata = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const { data: userSiteMeta } = useQuery({
    queryKey: queryKeys.meta({ userid }),
    queryFn: async () => {
      return await get<UserSiteMeta>(`/meta/?userid=${userid}`);
    },
  });

  const {
    mutate: updateMeta,
    isPending: isUpdatingMeta,
    error: updateMetaError,
  } = useMutation({
    mutationFn: (payload: UserSiteMeta) => put(`/meta`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meta({ userid }) });
      alert(tMessage("saveSuccess"));
    },
    onError: (error: unknown) => {
      alert(tError("saveFail"));
      console.error(error);
    },
  });

  // 메타데이터 수정 저장 상태 계산
  const getMetaSaveStatus = (
    localTitle: string,
    localDescription: string,
  ): SaveStatus => {
    if (isUpdatingMeta) return "saving";
    if (updateMetaError) return "error";

    // 서버 데이터와 로컬 데이터 비교
    const serverTitle = userSiteMeta?.title || "";
    const serverDescription = userSiteMeta?.description || "";

    const isDataEqual =
      serverTitle.trim() === localTitle.trim() &&
      serverDescription.trim() === localDescription.trim();

    return isDataEqual ? "saved" : "unsaved";
  };

  return {
    userSiteMeta,
    updateMeta,
    getMetaSaveStatus,
  };
};
