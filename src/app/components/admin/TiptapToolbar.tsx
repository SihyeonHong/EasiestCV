"use client";

import { Editor } from "@tiptap/core";
import { EditorContext } from "@tiptap/react";
import React from "react";

import MainToolbarContent from "@/app/components/admin/MainToolbarContent";
import MobileToolbarContent from "@/app/components/admin/MobileToolbarContent";
import { Toolbar } from "@/app/components/tiptap/tiptap-ui-primitive/toolbar";
import { useIsMobile } from "@/hooks/tiptap/use-mobile";

interface TiptapToolbarProps {
  editor: Editor | null;
  mobileView: "main" | "highlighter";
  onHighlighterClick: () => void;
  onImageClick: () => void;
  onBack: () => void;
  toolbarRef: React.RefObject<HTMLDivElement>;
  onPrint?: () => void;
}

export default function TiptapToolbar({
  editor,
  mobileView,
  onHighlighterClick,
  onImageClick,
  onBack,
  toolbarRef,
  onPrint,
}: TiptapToolbarProps) {
  const isMobile = useIsMobile();

  if (!editor) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar ref={toolbarRef}>
        {mobileView === "main" ? (
          <MainToolbarContent
            onHighlighterClick={onHighlighterClick}
            onImageClick={onImageClick}
            isMobile={isMobile}
            onPrint={onPrint}
          />
        ) : (
          <MobileToolbarContent onBack={onBack} />
        )}
      </Toolbar>
    </EditorContext.Provider>
  );
}
