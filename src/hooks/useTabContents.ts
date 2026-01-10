import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { UpdateContentsRequest } from "@/app/api/contents/route";
import { queryKeys } from "@/constants/queryKeys";
import { useTabs } from "@/hooks/useTabs";
import { ApiErrorResponse } from "@/types/error";
import { Tab } from "@/types/tab";
import { post, put } from "@/utils/http";

export const useTabContents = (userid: string) => {
  const queryClient = useQueryClient();
  const tEditor = useTranslations("editor");
  const tError = useTranslations("error");

  const { tabs: serverTabs } = useTabs(userid);

  // 탭 내용만 업데이트
  const { mutate: updateContentsMutation } = useMutation({
    mutationFn: (updateContentsRequest: UpdateContentsRequest) =>
      put(`/contents`, updateContentsRequest),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Tab[]>(queryKeys.tabs({ userid }), (oldTabs) => {
        if (!oldTabs) return oldTabs;
        return oldTabs.map((tab) =>
          tab.tid === variables.tid
            ? { ...tab, contents: variables.contents }
            : tab,
        );
      });
    },
    onError: (error) => {
      // 위에서 saveStatus 바꿔야 해서
      throw error;
    },
  });

  // GCS에 이미지 업로드
  const { mutateAsync: uploadImgToGCS } = useMutation({
    mutationFn: (formData: FormData) =>
      post<{ imageUrl: string }>(`/tabs/img`, formData),
    onError: (error: AxiosError) => {
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

      if (status === 400) {
        switch (errorData?.errorType) {
          case "FILE_SIZE_ERROR":
            alert(tError("fileSizeError"));
            break;
          case "INVALID_IMAGE_TYPE":
            alert(tError("invalidImageType"));
            break;
          default:
            alert(tError("imgUploadFail"));
        }
      } else {
        alert(tError("imgUploadFail"));
      }
    },
  });

  const updateContents = ({
    tid,
    newContent,
  }: {
    tid: number;
    newContent: string;
  }) => {
    const updateContentsRequest: UpdateContentsRequest = {
      userid,
      tid,
      contents: newContent,
    };
    updateContentsMutation(updateContentsRequest);
  };

  // 내용 되돌리기
  const backUpTabsRef = useRef<Tab[] | null>(null);
  useEffect(() => {
    if (serverTabs.length > 0 && !backUpTabsRef.current) {
      backUpTabsRef.current = [...serverTabs];
    }
  }, [serverTabs]);

  const revertContents = (tid: number): null | void => {
    try {
      if (!backUpTabsRef.current) {
        alert(tError("revertNoBackup"));
        return null;
      }

      const backupTab = backUpTabsRef.current.find((tab) => tab.tid === tid);

      if (!backupTab || backupTab.contents === null) {
        alert(tError("revertNoBackupForTab"));
        return null;
      }

      const confirm = window.confirm(tEditor("revertConfirm"));
      if (!confirm) return null;

      updateContentsMutation({
        userid,
        tid,
        contents: backupTab.contents,
      });
    } catch {
      alert(tError("revertError"));
    }
  };

  return {
    tabs: serverTabs,
    updateContents,
    revertContents,
    uploadImgToGCS,
  };
};
