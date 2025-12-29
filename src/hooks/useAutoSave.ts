import { useState, useCallback } from "react";

import { GCSRefreshRequest, SaveStatus } from "@/types/tab";
import { del } from "@/utils/http";
import { parseGcsFiles } from "@/utils/parseGcsFiles";
import useDebounce from "@/utils/useDebounce";

interface UseAutoSaveProps {
  userid: string;
  tid: number;
  mutateUploadIntro: (content: string) => void;
  updateContents: (params: { tid: number; newContent: string }) => void;
  revertIntro: () => void;
  revertContents: (tid: number) => void;
}

export function useAutoSave({
  userid,
  tid,
  mutateUploadIntro,
  updateContents,
  revertIntro,
  revertContents,
}: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const autoSave = useDebounce(async (content: string) => {
    setSaveStatus("saving");

    // 텍스트 업로드
    try {
      if (tid === 0) {
        mutateUploadIntro(content);
      } else {
        updateContents({
          tid: tid,
          newContent: content,
        });
      }
    } catch (error) {
      setSaveStatus("error");
      console.error("자동저장 실패:", error);
    }

    // 업로드 후, 파일 리스트 refresh
    try {
      const data: GCSRefreshRequest = {
        userid,
        tid,
        newList: parseGcsFiles(content),
      };
      del(`/files`, { data });
    } catch (error) {
      console.warn(error);
    }

    // 저장 상태 변경
    setSaveStatus("saved");
  }, 2000);

  const handleRevert = useCallback(() => {
    setSaveStatus("saving");
    try {
      if (tid === 0) revertIntro();
      else revertContents(tid);

      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      console.error("Revert failed:", error);
    }
  }, [tid, revertIntro, revertContents]);

  const handleContentChange = useCallback(
    (newValue: string) => {
      setSaveStatus("unsaved");
      autoSave(newValue);
    },
    [autoSave],
  );

  return {
    saveStatus,
    setSaveStatus,
    handleRevert,
    handleContentChange,
  };
}
