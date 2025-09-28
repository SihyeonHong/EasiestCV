import { useState, useCallback } from "react";

import { GCSRefreshRequest } from "@/models/tab.model";
import { del } from "@/utils/http";
import { parseImgSrc } from "@/utils/parseImgSrc";
import useDebounce from "@/utils/useDebounce";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface UseAutoSaveProps {
  userid: string;
  tid: number;
  updateFn: (params: { tid: number; newContent: string }) => void;
  revertFn: (tid: number) => void;
  editor?: {
    getSelection(): { index: number; length: number } | null;
    setSelection(
      index: number,
      length: number,
      source?: "user" | "silent" | "api",
    ): void;
  } | null;
}

export function useAutoSave({
  userid,
  tid,
  updateFn,
  revertFn,
  editor,
}: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const [lastSelection, setLastSelection] = useState<{
    index: number;
    length: number;
  } | null>(null);

  const autoSave = useDebounce(async ({ content, editor }) => {
    if (saveStatus === "saving") {
      return; // 이미 저장 중이면 중복 저장 방지
    }

    // 현재 에디터 상태 저장
    const currentSelection = editor?.getSelection?.() || null;
    const currentContent = content;

    setSaveStatus("saving");

    // 텍스트 업로드
    try {
      updateFn({ tid, newContent: content });
    } catch (error) {
      setSaveStatus("error");
      console.error("자동저장 실패:", error);
      return;
    }

    // 업로드 후, 파일 리스트 refresh
    try {
      const data: GCSRefreshRequest = {
        userid,
        tid,
        newList: parseImgSrc(content),
      };
      await del(`/files`, { data });
    } catch (error) {
      console.warn(error);
    }

    // 저장 완료 후 에디터 상태가 변경되었는지 확인
    if (editor && currentSelection) {
      const newSelection = editor.getSelection();
      // 선택 영역이 변경된 경우에만 복원
      if (
        !newSelection ||
        newSelection.index !== currentSelection.index ||
        newSelection.length !== currentSelection.length
      ) {
        editor.setSelection(
          currentSelection.index,
          currentSelection.length,
          "silent",
        );
      }
    }

    setSaveStatus("saved");
  }, 1000);

  const handleRevert = useCallback(() => {
    setSaveStatus("saving");
    try {
      revertFn(tid);
    } catch (error) {
      setSaveStatus("error");
      console.error("Revert failed:", error);
    }
    setSaveStatus("saved");
  }, [tid, revertFn]);

  const handleContentChange = useCallback(
    (newValue: string) => {
      if (saveStatus === "saving") {
        return; // 저장 중일 때는 아무 작업도 하지 않음
      }
      setSaveStatus("unsaved");
      autoSave({ content: newValue, editor });
    },
    [autoSave, editor, saveStatus],
  );

  return {
    saveStatus,
    setSaveStatus,
    handleRevert,
    handleContentChange,
  };
}
