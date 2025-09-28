"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Editor from "@/app/components/admin/Editor";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";

interface Props {
  userid: string;
  tid: number;
}

export default function EditorContainer({ userid, tid }: Props) {
  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  // Quill 에디터 인스턴스를 ref로 관리
  const editorRef = useRef<unknown>(null);

  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  const initialContent =
    tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";

  // 업데이트 함수를 메모이제이션하여 불필요한 리렌더링 방지
  const handleUpdate = useCallback(
    async (params: { tid: number; newContent: string }) => {
      try {
        if (tid === 0) {
          await mutateUploadIntro(params);
        } else {
          await updateContents(params);
        }
      } catch (error) {
        console.error("Update failed:", error);
      }
    },
    [tid, mutateUploadIntro, updateContents],
  );

  // 되돌리기 함수도 메모이제이션
  const handleRevert = useCallback(
    (targetTid: number) => {
      if (tid === 0) {
        revertIntro(targetTid);
      } else {
        revertContents(targetTid);
      }
    },
    [tid, revertIntro, revertContents],
  );

  return (
    <Editor
      ref={editorRef}
      userid={userid}
      tid={tid}
      initialContent={initialContent}
      updateFn={handleUpdate}
      revertFn={handleRevert}
    />
  );
}
