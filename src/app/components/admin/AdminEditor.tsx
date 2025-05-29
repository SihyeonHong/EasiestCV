import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import useDebounce from "@/util/useDebounce";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const t = useTranslations("editor");

  const { homeData, mutateUploadIntro } = useHome(userid);
  const { tabs, updateContents } = useTabs(userid);
  const [value, setValue] = useState("");
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

  useEffect(() => {
    if (tid === 0) {
      setValue(homeData?.intro || "");
    } else {
      const tab = tabs.find((t) => t.tid === tid);
      setValue(tab?.contents || "");
    }
    setSaveStatus("saved"); // 새 탭 로드시 저장된 상태로 초기화
  }, [tid, homeData, tabs]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setSaveStatus("unsaved");
    autoSave(newValue);
  };

  const getStatusDisplay = () => {
    switch (saveStatus) {
      case "saving":
        return {
          text: t("saving"),
          className: "text-blue-600",
          icon: "⏳",
        };
      case "saved":
        return {
          text: t("saved"),
          className: "text-green-600",
          icon: "✓",
        };
      case "unsaved":
        return {
          text: t("unsaved"),
          className: "text-orange-600",
          icon: "○",
        };
      case "error":
        return {
          text: t("error"),
          className: "text-red-600",
          icon: "✗",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-end justify-between">
        <p className="prose prose-slate text-sm">{t("autoSaveInfo")}</p>
        <div
          className={`flex items-center gap-1 text-sm ${statusDisplay.className}`}
        >
          <span>{statusDisplay.icon}</span>
          <span>{statusDisplay.text}</span>
        </div>
      </div>
      <ReactQuill
        className="bg-white dark:bg-[hsl(var(--background))]"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleValueChange}
      />
    </div>
  );
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    [{ align: [] }, { color: [] }, { background: [] }],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "clean",
];
