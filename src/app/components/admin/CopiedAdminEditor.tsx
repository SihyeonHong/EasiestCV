"use client";

import hljs, { HLJSApi } from "highlight.js";
import { useTranslations } from "next-intl";
import QuillDefault from "quill";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useQuill } from "react-quilljs";

import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { formats } from "@/constants/editor";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useEditorStyles } from "@/hooks/useEditorStyles";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";
import extractFileName from "@/utils/extractFileName";

// ------------------ Quill 타입 안전 처리 ------------------
const Quill = QuillDefault as unknown as {
  import(path: string): unknown;
  register(definition: Record<string, unknown>, overwrite?: boolean): void;
  register(path: string, def: unknown, overwrite?: boolean): void;
};

// ------------------ CustomCodeBlock ------------------

const Block = Quill.import("blots/block") as any;
const Container = Quill.import("blots/container") as any;

class CodeLine extends Block {
  static blotName = "code-line";
  static tagName = "CODE";

  static create(value?: string) {
    const node = super.create() as HTMLElement;
    node.setAttribute("contenteditable", "true");
    node.textContent = value || "";
    return node;
  }

  static value(node: HTMLElement) {
    return node.textContent || "";
  }
}

class CustomCodeBlock extends Container {
  static blotName = "code-block";
  static tagName = "PRE";

  static create() {
    const node = super.create() as HTMLPreElement;
    node.setAttribute("spellcheck", "false");
    return node;
  }

  static formats() {
    return true;
  }

  insertBefore(child: any, ref: any) {
    if (!(child instanceof CodeLine)) {
      child = Quill.create("code-line", child.textContent || "");
    }
    super.insertBefore(child, ref);
  }
}

Quill.register(
  { "formats/code-block": CustomCodeBlock, "formats/code-line": CodeLine },
  true,
);

// ------------------ AdminEditor ------------------

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  useEditorStyles();

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as Window).hljs = hljs as HLJSApi;
    }
  }, []);

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

  const handleClickImage = () => {
    if (quill) {
      const selection = quill.getSelection();
      setSavedSelection(selection);
      setIsImageUploaderOpen(true);
    }
  };

  const modules = useMemo(
    () => ({
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
      },
    }),
    [],
  );

  const { quill, quillRef } = useQuill({ modules, formats });

  const applyHighlighting = useCallback(() => {
    if (quill) {
      const codeBlocks = quill.root.querySelectorAll("pre code");
      codeBlocks.forEach((codeEl) => {
        if (codeEl instanceof HTMLElement) hljs.highlightElement(codeEl);
      });
    }
  }, [quill]);

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
        setTimeout(() => refreshImages(), 1000);
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
    });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  useEffect(() => {
    if (quill) {
      const initialContent =
        tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
      quill.clipboard.dangerouslyPasteHTML(initialContent);
      setTimeout(() => applyHighlighting(), 100);
    }
    setSaveStatus("saved");
  }, [tid, quill, applyHighlighting]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        handleContentChange(html);
        setTimeout(() => applyHighlighting(), 50);
      });
    }
  }, [quill, handleContentChange, applyHighlighting]);

  // ------------------ Toolbar 핸들러 ------------------
  useEffect(() => {
    if (!quill) return;

    const toolbar = quill.getModule("toolbar") as {
      addHandler: (format: string, handler: () => void) => void;
    } | null;

    if (toolbar) {
      toolbar.addHandler("image", handleClickImage);
      toolbar.addHandler("code-block", () => {
        const range = quill.getSelection(true);
        if (range) {
          quill.formatLine(range.index, range.length, "code-block", true);
        }
      });
    }
  }, [quill]);

  // ------------------ 코드블럭 Tab/Shift+Enter ------------------
  useEffect(() => {
    if (!quill) return;

    type Range = { index: number; length: number };

    quill.keyboard.addBinding({ key: 9 }, (range: Range) => {
      const [block] = quill.getLine(range.index);
      if (block?.domNode.tagName === "PRE") {
        quill.insertText(range.index, "  ");
        quill.setSelection(range.index + 2, 0);
        return false;
      }
      return true;
    });

    quill.keyboard.addBinding({ key: 13, shiftKey: true }, (range: Range) => {
      const [block] = quill.getLine(range.index);
      if (block?.domNode.tagName === "PRE") {
        quill.insertText(range.index, "\n");
        quill.setSelection(range.index + 1, 0);
        return false;
      }
      return true;
    });
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
