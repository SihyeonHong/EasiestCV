"use client";

import React from "react";

import { ArrowLeftIcon } from "@/app/components/tiptap/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/app/components/tiptap/tiptap-icons/highlighter-icon";
import { ColorHighlightPopoverContent } from "@/app/components/tiptap/tiptap-ui/color-highlight-popover";
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/app/components/tiptap/tiptap-ui-primitive/toolbar";

interface MobileToolbarContentProps {
  onBack: () => void;
}

export default function MobileToolbarContent({
  onBack,
}: MobileToolbarContentProps) {
  return (
    <div className="flex flex-wrap items-center">
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          <HighlighterIcon className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ColorHighlightPopoverContent />
    </div>
  );
}
