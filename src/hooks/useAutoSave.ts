import { useState, useCallback } from "react";

import useDebounce from "@/utils/useDebounce";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface UseAutoSaveProps {
  tid: number;
  mutateUploadIntro: (content: string) => void;
  updateContents: (params: { tid: number; newContent: string }) => void;
  revertIntro: () => void;
  revertContents: (tid: number) => void;
}

export function useAutoSave({
  tid,
  mutateUploadIntro,
  updateContents,
  revertIntro,
  revertContents,
}: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const autoSave = useDebounce(async (content: string) => {
    setSaveStatus("saving");

    try {
      if (tid === 0) {
        mutateUploadIntro(content);
      } else {
        updateContents({
          tid: tid,
          newContent: content,
        });
      }
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      console.error("자동저장 실패:", error);
    }
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
