"use client";

import hljs, { HLJSApi } from "highlight.js";
import { useTranslations } from "next-intl";
import QuillDefault from "quill";
import type QuillType from "quill";
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

declare global {
  interface Window {
    hljs: HLJSApi;
  }
}

// Quill 타입 정의
interface QuillBlot {
  domNode: HTMLElement;
  insertAt(index: number, text: string, def?: unknown): void;
  deleteAt(index: number, length: number): void;
  length(): number;
}

interface QuillBlotStatic {
  new (...args: unknown[]): QuillBlot;
  blotName: string;
  tagName: string;
  create(value?: string): HTMLElement;
  value(node: HTMLElement): string;
}

const Quill = QuillDefault as unknown as {
  import(path: string): unknown;
  register(definition: Record<string, unknown>, overwrite?: boolean): void;
  register(path: string, def: unknown, overwrite?: boolean): void;
};

const BlockEmbed = Quill.import("blots/block/embed") as QuillBlotStatic;

class CustomCodeBlock extends BlockEmbed implements QuillBlot {
  declare domNode: HTMLPreElement; // pre 태그임을 명시
  static blotName = "code-block";
  static tagName = "PRE";

  static override create(value?: string): HTMLPreElement {
    const node = super.create(value) as HTMLPreElement;
    const code = document.createElement("code");
    node.setAttribute("spellcheck", "false");
    node.appendChild(code);

    if (typeof value === "string") {
      code.textContent = value;
    }

    return node;
  }

  static override value(node: HTMLElement): string {
    const code = node.querySelector("code");
    return code?.textContent || "";
  }

  override insertAt(index: number, text: string) {
    const code = this.domNode.querySelector("code");
    if (!code) return;
    const current = code.textContent || "";
    code.textContent = current.slice(0, index) + text + current.slice(index);
  }

  override deleteAt(index: number, length: number) {
    const code = this.domNode.querySelector("code");
    if (!code) return;
    const current = code.textContent || "";
    code.textContent = current.slice(0, index) + current.slice(index + length);
  }

  override length(): number {
    const code = this.domNode.querySelector("code");
    return code?.textContent?.length || 0;
  }
}

Quill.register({ "formats/code-block": CustomCodeBlock }, true);

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

  const modules = useMemo(() => {
    return {
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
    };
  }, []);

  const { quill, quillRef } = useQuill({ modules, formats });

  const applyHighlighting = useCallback(() => {
    if (quill) {
      const codeBlocks = quill.root.querySelectorAll("pre code");
      codeBlocks.forEach((codeEl) => {
        if (codeEl instanceof HTMLElement) {
          hljs.highlightElement(codeEl);
        }
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
    });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  useEffect(() => {
    if (quill) {
      const initialContent =
        tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
      quill.clipboard.dangerouslyPasteHTML(initialContent);

      setTimeout(() => {
        applyHighlighting();
      }, 100);
    }
    setSaveStatus("saved");
  }, [tid, quill, applyHighlighting]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        handleContentChange(html);

        setTimeout(() => {
          applyHighlighting();
        }, 50);
      });
    }
  }, [quill, handleContentChange, applyHighlighting]);

  useEffect(() => {
    if (quill) {
      const toolbar = quill.getModule("toolbar");
      if (toolbar && typeof toolbar === "object" && "addHandler" in toolbar) {
        const toolbarWithHandler = toolbar as {
          addHandler: (type: string, handler: () => void) => void;
        };
        toolbarWithHandler.addHandler("image", handleClickImage);
      }
    }
  }, [quill]);

  // 코드블럭 Tab/Shift+Enter 커스텀
  useEffect(() => {
    if (!quill) return;

    // Tab: 코드블럭 내 공백 삽입
    quill.keyboard.addBinding({ key: 9 }, (range: QuillType.RangeStatic) => {
      const [block] = quill.getLine(range.index);
      if (block?.domNode.tagName === "PRE") {
        quill.insertText(range.index, "  ");
        quill.setSelection(range.index + 2, 0);
        return false;
      }
      return true;
    });

    // Shift+Enter: 코드블럭 내 줄바꿈
    quill.keyboard.addBinding(
      { key: 13, shiftKey: true },
      (range: QuillType.RangeStatic) => {
        const [block] = quill.getLine(range.index);
        if (block?.domNode.tagName === "PRE") {
          quill.insertText(range.index, "\n");
          quill.setSelection(range.index + 1, 0);
          return false;
        }
        return true;
      },
    );
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
