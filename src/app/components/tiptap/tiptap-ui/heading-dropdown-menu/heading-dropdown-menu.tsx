"use client";

import { Type } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

// --- Icons ---
import { ChevronDownIcon } from "@/app/components/tiptap/tiptap-icons/chevron-down-icon";
// --- Tiptap UI ---
import {
  HeadingButton,
  setParagraph,
  isParagraphActive,
} from "@/app/components/tiptap/tiptap-ui/heading-button";
import type { UseHeadingDropdownMenuConfig } from "@/app/components/tiptap/tiptap-ui/heading-dropdown-menu";
import { useHeadingDropdownMenu } from "@/app/components/tiptap/tiptap-ui/heading-dropdown-menu";
// --- UI Primitives ---
import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Button,
  ButtonGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Card,
  CardBody,
} from "@/app/components/tiptap/tiptap-ui-primitive/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/tiptap/tiptap-ui-primitive/dropdown-menu";
import { useTiptapEditor } from "@/hooks/tiptap/use-tiptap-editor";

export interface HeadingDropdownMenuProps
  extends Omit<ButtonProps, "type">,
    UseHeadingDropdownMenuConfig {
  /**
   * Whether to render the dropdown menu in a portal
   * @default false
   */
  portal?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = React.forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels = [1, 2, 3, 4, 5, 6],
      hideWhenUnavailable = false,
      portal = false,
      onOpenChange,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = React.useState(false);
    const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
      editor,
      levels,
      hideWhenUnavailable,
    });
    const t = useTranslations("editor");

    const handleOpenChange = React.useCallback(
      (open: boolean) => {
        if (!editor || !canToggle) return;
        setIsOpen(open);
        onOpenChange?.(open);
      },
      [canToggle, editor, onOpenChange],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <DropdownMenu modal open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Format text as heading"
            aria-pressed={isActive}
            tooltip="Heading"
            {...buttonProps}
            ref={ref}
          >
            <Icon className="tiptap-button-icon" />
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" portal={portal}>
          <Card>
            <CardBody>
              <ButtonGroup>
                {levels.map((level) => (
                  <DropdownMenuItem key={`heading-${level}`} asChild>
                    <HeadingButton
                      editor={editor}
                      level={level}
                      text={`Heading ${level}`}
                      showTooltip={false}
                    />
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={
                      editor && isParagraphActive(editor) ? "on" : "off"
                    }
                    role="button"
                    tabIndex={-1}
                    aria-label={t("plainText")}
                    aria-pressed={editor ? isParagraphActive(editor) : false}
                    onClick={() => {
                      if (editor) {
                        setParagraph(editor);
                      }
                    }}
                  >
                    <Type className="tiptap-button-icon" />
                    <span className="tiptap-button-text">{t("plainText")}</span>
                  </Button>
                </DropdownMenuItem>
              </ButtonGroup>
            </CardBody>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

HeadingDropdownMenu.displayName = "HeadingDropdownMenu";

export default HeadingDropdownMenu;
