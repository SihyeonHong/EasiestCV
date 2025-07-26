import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/common/Button";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";
import { cn } from "@/util/classname";
import useDebounce from "@/util/useDebounce";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import ImageUploader from "./ImageUploader";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const tEditor = useTranslations("editor");

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

  const handleClickImage = () => {
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
      <ReactQuill
        className="bg-white dark:bg-[hsl(var(--background))]"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleValueChange}
      />
      <ImageUploader
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
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
