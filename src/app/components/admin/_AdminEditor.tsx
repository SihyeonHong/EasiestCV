// react-quill 라이브러리 사용한 구 버전

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useEditor } from "@/hooks/useEditor";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";

const ReactQuillComponent = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const tError = useTranslations("error");

  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  const [value, setValue] = useState("");
  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  const {
    wrapperRef,
    modules,
    formats,
    insertImage,
    getCurrentSelection,
    setCurrentSelection,
  } = useEditor({
    onImageClick: () => setIsImageUploaderOpen(true),
  });

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
      getCurrentSelection,
      setCurrentSelection,
    });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  useEffect(() => {
    if (tid === 0) {
      setValue(homeData?.intro || "");
    } else {
      setValue(currentTab?.contents || "");
    }
    setSaveStatus("saved");
  }, [tid, homeData, currentTab, setSaveStatus]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    handleContentChange(newValue);
  };

  const handleImageInsert = (imageUrl: string) => {
    insertImage(imageUrl, (errorKey: string) => {
      alert(tError(errorKey));
    });
  };

  // 디버깅용
  // 아니 해봤는데 어느 키인지는 중요하지 않은 것 같은데
  document
    .querySelector(".ql-editor")
    ?.addEventListener("keydown", function (e) {
      console.log("Key down event:", (e as KeyboardEvent).key);
      if ((e as KeyboardEvent).key === "Enter") {
        setTimeout(() => {
          const codeBlocks = document.querySelectorAll("pre.ql-syntax");
          console.log("코드블록 개수:", codeBlocks.length);
          // 100ms 후 체크
          setTimeout(() => {
            const codeBlocks = document.querySelectorAll("pre.ql-syntax");
            console.log("100ms후 - 코드블록 개수:", codeBlocks.length);
            codeBlocks.forEach((block, i) => {
              console.log(
                `코드블록 ${i} 길이:`,
                block.textContent?.length || 0,
              );
              if (block.textContent && block.textContent.length > 50) {
                console.log(
                  `코드블록 ${i} 내용:`,
                  block.textContent.substring(0, 50),
                );
              }
            });
          }, 100);
        }, 10);
      }
    });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />

      <div ref={wrapperRef}>
        <ReactQuillComponent
          className="bg-white dark:bg-[hsl(var(--background))]"
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={handleValueChange}
        />
      </div>

      <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      />
    </div>
  );
}
