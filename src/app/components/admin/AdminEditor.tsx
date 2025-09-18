// import hljs from "highlight.js";
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

  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<{
    index: number;
    length: number;
  } | null>(null);

  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );

  //   const { getCurrentSelection, setCurrentSelection } = useEditor({
  //     onImageClick: () => setIsImageUploaderOpen(true),
  //   });

  const handleClickImage = () => {
    if (quill) {
      const selection = quill.getSelection(); // 클릭 시점의 커서 위치 저장
      setSavedSelection(selection);
      setIsImageUploaderOpen(true);
    }
  };

  const modules = useMemo(() => {
    return {
      //   syntax: {
      //     highlight: (text: string) => hljs.highlightAuto(text).value,
      //   },
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          ["code", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image"],
          [{ align: [] }, { color: [] }, { background: [] }],
        ],
        // handlers: {
        //   image: handleClickImage,
        // },
      },
    };
  }, []);

  const { quill, quillRef } = useQuill({ modules, formats });

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

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
      //   getCurrentSelection,
      //   setCurrentSelection,
    });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (quill) {
      const initialContent =
        tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
      quill.clipboard.dangerouslyPasteHTML(initialContent);
    }
    setSaveStatus("saved");
  }, [tid, quill]);
  // homeData, currentTab이 dependancy array에 들어가면 자동저장 때마다 내용 다시 로드되고 커서 위치 초기화
  // setSaveStatus는 진짜 뭔 상관이겠습니까

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        handleContentChange(html);
      });
    }
  }, [quill, handleContentChange]);

  useEffect(() => {
    if (quill) {
      const toolbar = quill.getModule("toolbar");

      // 타입 가드로 안전하게 체크
      if (toolbar && typeof toolbar === "object" && "addHandler" in toolbar) {
        const toolbarWithHandler = toolbar as {
          addHandler: (type: string, handler: () => void) => void;
        };
        toolbarWithHandler.addHandler("image", handleClickImage);
      }
    }
  }, [quill]);

  const handleImageInsert = (imageUrl: string) => {
    insertImage(imageUrl, (errorKey: string) => {
      alert(tError(errorKey));
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />

      <div
        ref={quillRef}
        className="min-h-96 border-2 bg-white dark:bg-black"
      />

      <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      />
    </div>
  );
}
