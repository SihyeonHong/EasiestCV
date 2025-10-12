"use client";

import * as React from "react";

// --- Lib ---

// --- Hooks ---

// --- Tiptap UI ---
import type {
  UndoRedoAction,
  UseUndoRedoConfig,
} from "@/app/components/tiptap/tiptap-ui/undo-redo-button";
import {
  UNDO_REDO_SHORTCUT_KEYS,
  useUndoRedo,
} from "@/app/components/tiptap/tiptap-ui/undo-redo-button";

// --- UI Primitives ---
import { Badge } from "@/app/components/tiptap/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/tiptap/use-tiptap-editor";
import { parseShortcutKeys } from "@/utils/tiptap-utils";

export interface UndoRedoButtonProps
  extends Omit<ButtonProps, "type">,
    UseUndoRedoConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean;
}

export function HistoryShortcutBadge({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action],
}: {
  action: UndoRedoAction;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = React.forwardRef<
  HTMLButtonElement,
  UndoRedoButtonProps
>(
  (
    {
      editor: providedEditor,
      action,
      text,
      hideWhenUnavailable = false,
      onExecuted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } =
      useUndoRedo({
        editor,
        action,
        hideWhenUnavailable,
        onExecuted,
      });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleAction();
      },
      [handleAction, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canExecute}
        data-style="ghost"
        data-disabled={!canExecute}
        role="button"
        tabIndex={-1}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <HistoryShortcutBadge
                action={action}
                shortcutKeys={shortcutKeys}
              />
            )}
          </>
        )}
      </Button>
    );
  },
);

UndoRedoButton.displayName = "UndoRedoButton";
