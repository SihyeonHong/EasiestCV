"use client";

import {
  EditorContent as TiptapEditorContent,
  useEditor,
  Editor as TiptapEditorType,
} from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import React, { useEffect, useState } from "react";

// --- UI Components ---
import ImageUploader from "@/app/components/admin/ImageUploader";
import SavePanel from "@/app/components/admin/SavePanel";
import SettingInTab from "@/app/components/admin/SettingInTab";
import TiptapToolbar from "@/app/components/admin/TiptapToolbar";
import { useToolbar } from "@/app/components/admin/ToolbarProvider";
import LoadingPage from "@/app/components/LoadingPage";
import { LinkPopover } from "@/app/components/tiptap/tiptap-ui/link-popover";
// --- Hooks ---
import { useAutoSave } from "@/hooks/useAutoSave";
import { useHome } from "@/hooks/useHome";
import { useTabContents } from "@/hooks/useTabContents";
// --- Types & Utils ---
import { Tab } from "@/types/tab";
import { normalizeHtmlWhitespace } from "@/utils/sanitize";
import { createEditorProps } from "@/utils/tiptap-editor-config";
import { getTiptapExtensions } from "@/utils/tiptap-extensions";

interface Props {
  userid: string;
  tid: number;
}

export default function Editor({ userid, tid }: Props) {
  const { userHome, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabContents(userid);
  const {
    mobileView,
    setMobileView,
    isImageUploaderOpen,
    setIsImageUploaderOpen,
  } = useToolbar();

  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
    });

  const toolbarRef = React.useRef<HTMLDivElement>(null);

  // 템플릿 삽입 관련
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  const templateHtmlCacheRef = React.useRef<string | null>(null);
  const templateHtmlPromiseRef = React.useRef<Promise<string> | null>(null);
  const lastSelectionRef = React.useRef<{ from: number; to: number } | null>(
    null,
  );

  const getNormalizedTemplateHtml =
    React.useCallback(async (): Promise<string> => {
      if (templateHtmlCacheRef.current) return templateHtmlCacheRef.current;
      if (templateHtmlPromiseRef.current) return templateHtmlPromiseRef.current;

      templateHtmlPromiseRef.current = (async () => {
        const response = await fetch("/papers-template.html");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch papers-template.html: ${response.status} ${response.statusText}`,
          );
        }

        const rawTemplate = await response.text();
        const normalized = normalizeHtmlWhitespace(rawTemplate);
        templateHtmlCacheRef.current = normalized;
        return normalized;
      })();

      try {
        return await templateHtmlPromiseRef.current;
      } finally {
        templateHtmlPromiseRef.current = null;
      }
    }, []);

  const editor: TiptapEditorType | null = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: createEditorProps((view, event) => {
      // Tab 키를 눌렀을 때 에디터 내에서 들여쓰기 처리
      if (event.key === "Tab") {
        event.preventDefault();

        // Shift + Tab: 내어쓰기
        if (event.shiftKey) {
          return (
            editor?.chain().focus().liftListItem("listItem").run() || false
          );
        }

        // Tab: 들여쓰기 (리스트 아이템이면 리스트 들여쓰기, 아니면 일반 들여쓰기)
        const { state } = view as {
          state: {
            selection: {
              $from: {
                node: (depth: number) => { type: { name: string } } | null;
                pos: number;
              };
            };
          };
        };
        const { selection } = state;
        const { $from } = selection;

        // 현재 위치가 리스트 아이템인지 확인
        const isInListItem = $from.node(-1)?.type.name === "listItem";

        if (isInListItem) {
          return (
            editor?.chain().focus().sinkListItem("listItem").run() || false
          );
        } else {
          // 일반 텍스트: 들여쓰기 문자 삽입
          return (
            editor?.chain().focus().insertContent("\u2003\u2003").run() || false
          );
        }
      }

      // 코드 블록에서 Enter 키 눌렀을 때 들여쓰기 유지
      if (event.key === "Enter") {
        const { state } = view as {
          state: {
            selection: { $from: { pos: number } };
            doc: { textBetween: (from: number, to: number) => string };
          };
        };
        const { selection } = state;
        const { $from } = selection;

        // 현재 위치가 코드 블록인지 확인 (Tiptap의 isActive 메서드 사용)
        const isInCodeBlock = editor?.isActive("codeBlock") || false;

        if (isInCodeBlock) {
          // 현재 줄의 시작 위치 찾기 (줄바꿈을 기준으로)
          const currentPos = $from.pos;
          const doc = state.doc;

          // 현재 위치에서 앞으로 가면서 줄바꿈을 찾기
          let lineStart = currentPos;
          for (let i = currentPos - 1; i >= 0; i--) {
            const char = doc.textBetween(i, i + 1);
            if (char === "\n") {
              lineStart = i + 1;
              break;
            }
          }

          // 현재 줄의 텍스트 추출
          const currentLine = doc.textBetween(lineStart, currentPos);

          // 현재 줄의 앞쪽 공백/들여쓰기 추출 (모든 종류의 공백 포함)
          const indentMatch = currentLine.match(/^(\s*)/);
          const indent = indentMatch ? indentMatch[1] : "";

          // Enter 키 기본 동작 실행 후 들여쓰기 삽입
          setTimeout(() => {
            if (indent && indent.length > 0) {
              editor?.chain().focus().insertContent(indent).run();
            }
          }, 10);

          return false; // 기본 Enter 동작 허용
        }
      }

      return false;
    }),
    extensions: getTiptapExtensions(),
    content: "",
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    },
    onFocus: ({ editor }) => {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleContentChange(html);
    },
  });

  const handleAddTemplate = React.useCallback(async () => {
    if (!editor) return;
    if (isAddingTemplate) return;

    setIsAddingTemplate(true);
    try {
      const templateHtml = await getNormalizedTemplateHtml();
      if (!templateHtml) return;

      const lastSelection = lastSelectionRef.current;
      if (lastSelection) {
        editor
          .chain()
          .focus()
          .insertContentAt(lastSelection, templateHtml)
          .run();
      } else {
        editor.chain().focus("end").insertContent(templateHtml).run();
      }
    } catch (error) {
      console.error("템플릿 삽입 실패:", error);
      alert("템플릿을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsAddingTemplate(false);
    }
  }, [editor, getNormalizedTemplateHtml, isAddingTemplate]);

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  // 에디터 초기 로드 or 탭 변경시 콘텐츠 동기화
  useEffect(() => {
    if (!editor) return;
    let content;

    if (tid === 0 && userHome) {
      content = userHome.intro_html || "";
    } else if (tid !== 0 && currentTab) {
      content = currentTab.contents || "";
    }

    if (content === undefined) return; // 빈 문자열은 인정
    editor.commands.setContent(content);

    setSaveStatus("saved");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tid, editor]);

  const handleImageInsert = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  if (!editor) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {tid !== 0 && (
        <SettingInTab
          onAddTemplate={handleAddTemplate}
          isAddingTemplate={isAddingTemplate}
          getTemplateHtml={getNormalizedTemplateHtml}
        />
      )}
      <SavePanel saveStatus={saveStatus} onRevert={handleRevert} />

      <div className="w-full border">
        <TiptapToolbar
          editor={editor}
          mobileView={mobileView}
          onHighlighterClick={() => setMobileView("highlighter")}
          onLinkClick={() => setMobileView("link")}
          onImageClick={() => setIsImageUploaderOpen(true)}
          onBack={() => setMobileView("main")}
          toolbarRef={toolbarRef}
        />

        <div className="overflow-auto">
          <BubbleMenu editor={editor}>
            <div className="bg-background-secondary flex items-center gap-1 rounded-lg border p-1 shadow-lg">
              <LinkPopover editor={editor} />
            </div>
          </BubbleMenu>
          <TiptapEditorContent
            editor={editor}
            role="presentation"
            className="mx-auto flex w-full flex-1 flex-col bg-editor-color p-4 transition-all duration-200 focus-within:border-2 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-500"
          />
        </div>
      </div>

      <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      />
    </div>
  );
}
