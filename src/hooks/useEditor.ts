import { useTranslations } from "next-intl";
import { useRef, useEffect } from "react";

import { addTooltips } from "@/utils/quillTooltips";

interface QuillWrapper {
  quill: import("quill").default;
  options: Record<string, unknown>;
  container: HTMLElement;
  controls: Record<string, unknown>;
  handlers: Record<string, unknown>;
}

export function useEditor() {
  const tQuillTooltips = useTranslations("quillTooltips");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<QuillWrapper | null>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => addTooltips(wrapperRef, tQuillTooltips),
      100,
    );
    return () => clearTimeout(timer);
  }, []);

  const getCurrentSelection = () => {
    const quillInstance = quillInstanceRef.current?.quill;
    if (quillInstance && typeof quillInstance.getSelection === "function") {
      return quillInstance.getSelection(true);
    } else return null;
  };

  const setCurrentSelection = (
    selection: { index: number; length: number } | null,
  ) => {
    const quillInstance = quillInstanceRef.current?.quill;
    if (quillInstance) quillInstance.setSelection(selection);
  };

  return {
    wrapperRef,
    quillInstanceRef,
    getCurrentSelection,
    setCurrentSelection,
  };
}
