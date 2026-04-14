"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ImagePlusIcon } from "@/app/components/tiptap/tiptap-icons/image-plus-icon";
import { BlockquoteButton } from "@/app/components/tiptap/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/app/components/tiptap/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
} from "@/app/components/tiptap/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/app/components/tiptap/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/app/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/app/components/tiptap/tiptap-ui/mark-button";
import { SpecialCharPopover } from "@/app/components/tiptap/tiptap-ui/special-char-popover/special-char-popover";
import { TextAlignButton } from "@/app/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/app/components/tiptap/tiptap-ui/undo-redo-button";
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/app/components/tiptap/tiptap-ui-primitive/toolbar";

interface MainToolbarContentProps {
  onHighlighterClick: () => void;
  onImageClick: () => void;
  isMobile: boolean;
  onPrint?: () => void;
}

export default function MainToolbarContent({
  onHighlighterClick,
  onImageClick,
  isMobile,
  onPrint,
}: MainToolbarContentProps) {
  const t = useTranslations("tooltips");

  return (
    <div className="flex flex-wrap items-center">
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="underline" />
        <MarkButton type="code" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <SpecialCharPopover />
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button data-style="ghost" onClick={onImageClick} title={t("image")}>
          <ImagePlusIcon className="tiptap-button-icon" />
        </Button>
        {onPrint && (
          <Button data-style="ghost" onClick={onPrint} title={t("exportPdf")}>
            <Printer className="tiptap-button-icon h-[18px] w-[18px]" />
          </Button>
        )}
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}
    </div>
  );
}
