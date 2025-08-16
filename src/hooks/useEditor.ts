import { useRef, useEffect, useMemo } from "react";

import extractFileName from "@/utils/extractFileName";
import { addTooltips } from "@/utils/quillTooltips";

interface QuillWrapper {
  quill: import("quill").default;
  options: Record<string, unknown>;
  container: HTMLElement;
  controls: Record<string, unknown>;
  handlers: Record<string, unknown>;
}

interface UseEditorProps {
  onImageClick: (quillInstance: QuillWrapper) => void;
}

export function useEditor({ onImageClick }: UseEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<QuillWrapper | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => addTooltips(wrapperRef), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const insertImage = (
    imageUrl: string,
    onError: (message: string) => void,
  ) => {
    const quillInstance = quillInstanceRef.current?.quill;

    if (quillInstance && typeof quillInstance.getSelection === "function") {
      try {
        const range = quillInstance.getSelection(true);
        const index = range ? range.index : quillInstance.getLength();

        quillInstance.insertEmbed(index, "image", imageUrl);
        quillInstance.setSelection(index + 1);

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

  const handleClickImage = function (this: QuillWrapper) {
    quillInstanceRef.current = this;
    onImageClick(this);
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

  return {
    wrapperRef,
    quillInstanceRef,
    modules,
    formats,
    insertImage,
    refreshImages,
  };
}
