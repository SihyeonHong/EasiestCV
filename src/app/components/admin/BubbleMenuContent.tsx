"use client";

import type { Editor } from "@tiptap/react";
import { useState, useCallback, useEffect } from "react";

import {
  isLinkActive,
  LinkContent,
} from "@/app/components/tiptap/tiptap-ui/link-popover";
import { LinkButton } from "@/app/components/tiptap/tiptap-ui/link-popover";
import { MarkButton } from "@/app/components/tiptap/tiptap-ui/mark-button";
import { TextAlignButton } from "@/app/components/tiptap/tiptap-ui/text-align-button";

interface BubbleMenuContentProps {
  editor: Editor;
  userid: string;
}

export default function BubbleMenuContent({
  editor,
  userid,
}: BubbleMenuContentProps) {
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const linkActive = isLinkActive(editor);

  // 링크가 활성화되면 자동으로 링크 편집 영역 표시
  useEffect(() => {
    if (linkActive) {
      setShowLinkEditor(true);
    } else {
      setShowLinkEditor(false);
    }
  }, [linkActive]);

  const isLinkEditorVisible = showLinkEditor || linkActive;

  const handleLinkToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowLinkEditor((prev) => !prev);
    },
    [],
  );

  return (
    <div className="z-20 rounded-lg border bg-background-secondary shadow-lg">
      {/* 상단: 포맷팅 바 */}
      <div className="flex items-center gap-0.5 p-1">
        <MarkButton editor={editor} type="bold" />
        <MarkButton editor={editor} type="italic" />
        <MarkButton editor={editor} type="underline" />
        <MarkButton editor={editor} type="strike" />

        <div className="bg-border-primary mx-0.5 h-4 w-px" />

        <TextAlignButton editor={editor} align="left" />
        <TextAlignButton editor={editor} align="center" />
        <TextAlignButton editor={editor} align="right" />

        <div className="bg-border-primary mx-0.5 h-4 w-px" />

        <LinkButton
          onClick={handleLinkToggle}
          data-active-state={isLinkEditorVisible ? "on" : "off"}
          aria-pressed={isLinkEditorVisible}
        />
      </div>

      {/* 하단: 링크 편집 영역 (조건부) */}
      {isLinkEditorVisible && (
        <div className="border-border-primary border-t">
          <LinkContent editor={editor} userid={userid} />
        </div>
      )}
    </div>
  );
}
