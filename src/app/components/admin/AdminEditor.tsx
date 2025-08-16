import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState, useRef } from "react";

import ImageUploader from "@/app/components/admin/ImageUploader";
import { Button } from "@/app/components/common/Button";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";
import { cn } from "@/utils/classname";
import extractFileName from "@/utils/extractFileName";
import { addTooltips } from "@/utils/quillTooltips";
import useDebounce from "@/utils/useDebounce";

import "react-quill/dist/quill.snow.css";

const ReactQuillComponent = dynamic(() => import("react-quill"), {
  ssr: false,
});

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface QuillWrapper {
  quill: import("quill").default;
  options: Record<string, unknown>;
  container: HTMLElement;
  controls: Record<string, unknown>;
  handlers: Record<string, unknown>;
}

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const quillRef = useRef<HTMLDivElement>(null);

  const tEditor = useTranslations("editor");
  const tError = useTranslations("error");

  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);
  const [value, setValue] = useState("");
  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

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
  }, [tid, homeData, currentTab]);

  useEffect(() => {
    const timer = setTimeout(() => addTooltips(quillRef), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setSaveStatus("unsaved");
    autoSave(newValue);
  };

  const handleRevert = () => {
    setSaveStatus("saving");
    try {
      if (tid === 0) revertIntro();
      else revertContents(tid);

      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      console.error("Revert failed:", error);
    }
  };

  const getStatusDisplay = () => {
    switch (saveStatus) {
      case "saving":
        return {
          text: tEditor("saving"),
          className: "text-blue-600",
          icon: "⏳",
        };
      case "saved":
        return {
          text: tEditor("saved"),
          className: "text-green-600",
          icon: "✓",
        };
      case "unsaved":
        return {
          text: tEditor("unsaved"),
          className: "text-orange-600",
          icon: "○",
        };
      case "error":
        return {
          text: tEditor("error"),
          className: "text-red-600",
          icon: "✗",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  const quillInstanceRef = useRef<QuillWrapper | null>(null);

  const refreshImages = () => {
    const quillInstance = quillInstanceRef.current?.quill;
    if (quillInstance) {
      const images = quillInstance.root.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.src;
        img.src = "";
        img.src = src;
        img.alt = extractFileName(src);
      });
    }
  };

  const insertImage = (imageUrl: string) => {
    const quillInstance = quillInstanceRef.current?.quill;

    // 1. Quill 인스턴스가 존재하고 올바른 타입인지 확인
    if (quillInstance && typeof quillInstance.getSelection === "function") {
      try {
        // 2. 현재 커서 위치(선택 영역) 가져오기
        const range = quillInstance.getSelection(true);
        // 3. 삽입할 위치 결정: range가 null이면 문서 끝에 삽입
        const index = range ? range.index : quillInstance.getLength();

        // 4. 이미지 삽입. insertEmbed(위치, 타입, 값): 특정 위치에 미디어 요소 삽입
        quillInstance.insertEmbed(index, "image", imageUrl);
        // 5. 커서를 이미지 다음 위치로 이동
        quillInstance.setSelection(index + 1);

        setTimeout(() => {
          refreshImages();
        }, 1000);
      } catch (error) {
        alert(tError("imgInsertFail"));
        console.error("Error inserting image:", error);
      }
    } else {
      console.error("Quill instance is not available or invalid");
    }
  };

  const handleClickImage = function (this: QuillWrapper) {
    // this가 Quill 인스턴스를 가리킴
    quillInstanceRef.current = this;
    setIsImageUploaderOpen(true);
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image"],
          [{ align: [] }, { color: [] }, { background: [] }],
        ],
        handlers: {
          image: handleClickImage,
        },
      },
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-end justify-between gap-1">
        <div className="flex items-end gap-2">
          <Button variant="destructive" size="sm" onClick={handleRevert}>
            {tEditor("revert")}
          </Button>
          <p className="prose prose-slate text-sm">{tEditor("autoSaveInfo")}</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-sm",
            statusDisplay.className,
          )}
        >
          <span>{statusDisplay.icon}</span>
          <span>{statusDisplay.text}</span>
        </div>
      </div>

      <div ref={quillRef}>
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
        tid={tid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={insertImage}
      />
    </div>
  );
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "image",
  "align",
  "color",
  "background",
];
