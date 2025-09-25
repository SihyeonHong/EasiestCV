"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { useQuill } from "react-quilljs";

import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { formats } from "@/constants/editor";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";
import extractFileName from "@/utils/extractFileName";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const tError = useTranslations("error");
  const [savedSelection, setSavedSelection] = useState<{
    index: number;
    length: number;
  } | null>(null);
  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
    });

  const refreshImages = () => {
    if (quill) {
      const images = quill.root.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.src;
        img.src = "";
        img.src = src;
        img.alt = extractFileName(src);
      });
    }
  };

  const insertImage = (
    imageUrl: string,
    onError: (message: string) => void,
  ) => {
    if (quill && typeof quill.getSelection === "function") {
      try {
        // 커서 위치 저장되어 있으면 거기, 없으면 문서 맨 뒤에
        const index = savedSelection ? savedSelection.index : quill.getLength();

        quill.insertEmbed(index, "image", imageUrl);
        quill.setSelection(index + 1);

        setTimeout(() => {
          refreshImages();
        }, 1000);
      } catch (error) {
        onError("imgInsertFail");
        console.error("Error inserting image:", error);
      }
    } else {
      console.error("Quill instance is not available or invalid");
    }
  };

  const handleClickImage = () => {
    if (quill) {
      const selection = quill.getSelection(); // 클릭 시점의 커서 위치 저장
      setSavedSelection(selection);
      setIsImageUploaderOpen(true);
    } else {
      console.warn("handleClickImage - quill object not found");
    }
  };

  useEffect(() => {
    console.log("isImageUploaderOpen", isImageUploaderOpen);
  }, [isImageUploaderOpen]);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
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
      },
    };
  }, []);

  const { quill, quillRef } = useQuill({ modules, formats });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  useEffect(() => {
    if (quill) {
      const toolbar = quill.getModule("toolbar") as {
        addHandler: (type: string, handler: () => void) => void;
      };
      toolbar.addHandler("image", handleClickImage);
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      const initialContent =
        tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
      quill.clipboard.dangerouslyPasteHTML(initialContent);
    }
    setSaveStatus("saved");
  }, [tid, quill]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        handleContentChange(html);
      });
    }
  }, [quill, handleContentChange]);

  const handleImageInsert = (imageUrl: string) => {
    insertImage(imageUrl, (errorKey: string) => {
      alert(tError(errorKey));
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />

      <div ref={quillRef} className="min-h-96 border-2 bg-white"></div>

      <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      />
    </div>
  );
}
