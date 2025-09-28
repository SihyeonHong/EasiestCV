"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ForwardedRef, forwardRef } from "react";
import { useQuill } from "react-quilljs";

import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { formats } from "@/constants/editor";
import { useAutoSave } from "@/hooks/useAutoSave";
import extractFileName from "@/utils/extractFileName";

interface Props {
  userid: string;
  tid: number;
  initialContent: string;
  updateFn: (params: { tid: number; newContent: string }) => void;
  revertFn: (tid: number) => void;
}

const Editor = forwardRef(
  (
    { userid, tid, initialContent, updateFn, revertFn }: Props,
    ref: ForwardedRef<unknown>,
  ) => {
    const tError = useTranslations("error");

    const [savedSelection, setSavedSelection] = useState<{
      index: number;
      length: number;
    } | null>(null);

    const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

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

    // ref를 통해 외부에서 Quill 인스턴스에 접근 가능하도록 설정
    useEffect(() => {
      if (quill && ref && typeof ref === "object") {
        ref.current = quill;
      }
    }, [quill, ref]);

    const { saveStatus, handleContentChange, handleRevert } = useAutoSave({
      userid,
      tid,
      updateFn,
      revertFn,
      editor: quill,
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
          const index = savedSelection
            ? savedSelection.index
            : quill.getLength();

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

    // 초기 컨텐츠 설정
    useEffect(() => {
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(initialContent);
      }
    }, [initialContent, quill]);

    // 텍스트 변경 및 자동저장을 위한 useEffect
    useEffect(() => {
      if (quill) {
        const handleTextChange = (
          delta: unknown,
          oldContents: unknown,
          source: string,
        ) => {
          // 'user' 소스에 의한 변경일 때만 저장 처리
          if (source === "user") {
            const html = quillRef.current.firstChild.innerHTML;
            handleContentChange(html);
          }
        };

        quill.on("text-change", handleTextChange);
        return () => {
          quill.off("text-change", handleTextChange);
        };
      }
    }, [quill, handleContentChange, tid]);

    return (
      <div className="flex flex-1 flex-col gap-4">
        <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />
        <div ref={quillRef} className="min-h-96 border-2 bg-white" />
        <ImageUploader
          userid={userid}
          isOpen={isImageUploaderOpen}
          onClose={() => setIsImageUploaderOpen(false)}
          onImageInsert={(imageUrl) => {
            insertImage(imageUrl, (errorKey: string) => {
              alert(tError(errorKey));
            });
          }}
        />
      </div>
    );
  },
);

// 컴포넌트 이름 지정
Editor.displayName = "Editor";

export default Editor;
