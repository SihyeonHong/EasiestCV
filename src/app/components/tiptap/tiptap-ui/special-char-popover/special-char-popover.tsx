"use client";

import { type Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import * as React from "react";

// --- UI Primitives ---
import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Button,
  ButtonGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/tiptap/tiptap-ui-primitive/popover";
import { useIsMobile } from "@/hooks/tiptap/use-mobile";
import { useTiptapEditor } from "@/hooks/tiptap/use-tiptap-editor";

type SpecialChar = {
  char: string;
  labelKey: string;
  descriptionKey: string;
};

export interface SpecialCharPopoverContentProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Saved cursor position before popover opens.
   */
  savedPosition?: number | null;
  /**
   * Callback when a special character is inserted.
   */
  onInsert?: () => void;
}

export interface SpecialCharPopoverProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
}

export const SpecialCharPopoverButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { tooltipLabel?: string }
>(({ className, children, tooltipLabel, ...props }, ref) => (
  <Button
    type="button"
    className={className}
    data-style="ghost"
    data-appearance="default"
    role="button"
    tabIndex={-1}
    aria-label={tooltipLabel}
    tooltip={tooltipLabel}
    ref={ref}
    {...props}
  >
    {children ?? <span className="tiptap-button-icon">『』</span>}
  </Button>
));

SpecialCharPopoverButton.displayName = "SpecialCharPopoverButton";

export function SpecialCharPopoverContent({
  editor,
  savedPosition,
  onInsert,
}: SpecialCharPopoverContentProps) {
  const isMobile = useIsMobile();
  const t = useTranslations("editor");

  const BRACKET_CHARS: SpecialChar[] = React.useMemo(
    () => [
      {
        char: "『』",
        labelKey: "doubleQuotation",
        descriptionKey: "insertDoubleQuotation",
      },
      {
        char: "「」",
        labelKey: "singleQuotation",
        descriptionKey: "insertSingleQuotation",
      },
      {
        char: "〈〉",
        labelKey: "angleBrackets",
        descriptionKey: "insertAngleBrackets",
      },
      {
        char: "《》",
        labelKey: "doubleAngleBrackets",
        descriptionKey: "insertDoubleAngleBrackets",
      },
    ],
    [],
  );

  const OTHER_CHARS: SpecialChar[] = React.useMemo(
    () => [
      {
        char: "·",
        labelKey: "middleDot",
        descriptionKey: "insertMiddleDot",
      },
      {
        char: "⋯",
        labelKey: "midlineEllipsis",
        descriptionKey: "insertMidlineEllipsis",
      },
      {
        char: "‐",
        labelKey: "hyphen",
        descriptionKey: "insertHyphen",
      },
      {
        char: "–",
        labelKey: "enDash",
        descriptionKey: "insertEnDash",
      },
      {
        char: "—",
        labelKey: "emDash",
        descriptionKey: "insertEmDash",
      },
    ],
    [],
  );

  const handleInsertChar = React.useCallback(
    (char: string) => {
      if (!editor || !editor.isEditable) return;

      try {
        // 커서 위치가 저장되어 있으면 복원, 없으면 현재 위치 사용
        if (savedPosition !== null && savedPosition !== undefined) {
          editor
            .chain()
            .focus()
            .setTextSelection(savedPosition)
            .insertContent(char)
            .run();
        } else {
          // 저장된 위치가 없으면 현재 커서 위치에 삽입
          editor.chain().focus().insertContent(char).run();
        }

        onInsert?.();
      } catch (error) {
        console.error("Failed to insert special character:", error);
      }
    },
    [editor, savedPosition, onInsert],
  );

  return (
    <Card className="shadow-xl">
      <CardBody className={isMobile ? "p-0" : ""}>
        <CardItemGroup orientation="vertical">
          <ButtonGroup orientation="horizontal">
            {BRACKET_CHARS.map((specialChar) => (
              <Button
                key={specialChar.char}
                type="button"
                onClick={() => handleInsertChar(specialChar.char)}
                aria-label={t(specialChar.descriptionKey)}
                tooltip={t(specialChar.labelKey)}
                data-style="ghost"
              >
                <span className="text-[1.2em]">{specialChar.char}</span>
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup orientation="horizontal">
            {OTHER_CHARS.map((specialChar) => (
              <Button
                key={specialChar.char}
                type="button"
                onClick={() => handleInsertChar(specialChar.char)}
                aria-label={t(specialChar.descriptionKey)}
                tooltip={t(specialChar.labelKey)}
                data-style="ghost"
              >
                <span className="text-[1.2em]">{specialChar.char}</span>
              </Button>
            ))}
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
}

export function SpecialCharPopover({
  editor: providedEditor,
  ...props
}: SpecialCharPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const [savedPosition, setSavedPosition] = React.useState<number | null>(null);
  const t = useTranslations("editor");

  // Popover가 열릴 때 커서 위치 저장
  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open && editor) {
        // Popover가 열릴 때 현재 커서 위치 저장
        const selection = editor.state.selection;
        setSavedPosition(selection.$anchor.pos);
      } else {
        // Popover가 닫힐 때 저장된 위치 초기화
        setSavedPosition(null);
      }
    },
    [editor],
  );

  // 특수기호 삽입 후 Popover 닫기
  const handleInsert = React.useCallback(() => {
    setIsOpen(false);
    setSavedPosition(null);
  }, []);

  if (!editor || !editor.isEditable) {
    return null;
  }

  const tooltipLabel = t("specialChar");

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <SpecialCharPopoverButton
          aria-label={tooltipLabel}
          tooltipLabel={tooltipLabel}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent aria-label={tooltipLabel} className="ml-3">
        <SpecialCharPopoverContent
          editor={editor}
          savedPosition={savedPosition}
          onInsert={handleInsert}
        />
      </PopoverContent>
    </Popover>
  );
}

export default SpecialCharPopover;
