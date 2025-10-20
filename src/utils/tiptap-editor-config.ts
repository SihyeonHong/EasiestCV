import { EditorOptions } from "@tiptap/react";

/**
 * Tiptap 에디터의 기본 설정을 생성하는 유틸리티 함수
 * handleKeyDown 핸들러를 주입받아 완전한 editorProps를 반환
 */
export const createEditorProps = (
  handleKeyDown: (view: unknown, event: KeyboardEvent) => boolean,
): EditorOptions["editorProps"] => ({
  attributes: {
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    "aria-label": "Main content area, start typing to enter text.",
  },
  handleKeyDown,
});
