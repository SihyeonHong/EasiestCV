import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { UpdateContentsRequest } from "@/app/api/contents/route";
import { queryKeys } from "@/constants/queryKeys";
import { ApiErrorResponse } from "@/models/api";
import { Tab } from "@/models/tab.model";
import { post, put } from "@/utils/http";

import { useTabs } from "./useTabs";

export const useTabContents = (userid: string) => {
  const queryClient = useQueryClient();
  const tEditor = useTranslations("editor");
  const tError = useTranslations("error");

  const { tabs: serverTabs } = useTabs(userid);

  // 탭 내용만 업데이트
  const { mutate: updateContentsMutation } = useMutation({
    mutationFn: (updateContentsRequest: UpdateContentsRequest) =>
      put(`/contents`, updateContentsRequest),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.tabs({ userid }) });
    },
    onError: (error) => {
      console.error("내용 저장 오류:", error);
    },
  });

  // GCS에 이미지 업로드
  const { mutateAsync: uploadImgToGCS } = useMutation({
    mutationFn: (formData: FormData) =>
      post<{ imageUrl: string }>(`/tabs/img`, formData),
    onError: (error: AxiosError) => {
      console.error("이미지 업로드 오류:", error);

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

      if (
        !backupTab ||
        backupTab.contents === undefined ||
        backupTab.contents === null
      ) {
        alert(tError("revertNoBackupForTab"));
        console.error(`탭 ID ${tid}에 대한 백업 데이터를 찾을 수 없습니다.`);
        return null;
      }

      const confirm = window.confirm(tEditor("revertConfirm"));
      if (!confirm) return null;

      updateContentsMutation({
        userid,
        tid,
        contents: backupTab.contents,
      });
    } catch (error) {
      alert(tError("revertError"));
      console.error("revertContents", error);
    }
  };

  return {
    tabs: serverTabs,
    updateContents,
    revertContents,
    uploadImgToGCS,
  };
};
