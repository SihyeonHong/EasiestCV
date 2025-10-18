"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import {
  EditorContent as TiptapEditorContent,
  useEditor,
  Editor as TiptapEditorType,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";

// --- Tiptap Node ---

// --- UI Components ---
import EditorPanel from "@/app/components/admin/EditorPanel";
import ImageUploader from "@/app/components/admin/ImageUploader";
import TiptapToolbar from "@/app/components/admin/TiptapToolbar";
import {
  ToolbarProvider,
  useToolbar,
} from "@/app/components/admin/ToolbarProvider";
import { HorizontalRule } from "@/app/components/tiptap/tiptap-node/horizontal-rule-node";
// --- Hooks ---
import { useAutoSave } from "@/hooks/useAutoSave";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";

interface Props {
  userid: string;
  tid: number;
}

export default function Editor({ userid, tid }: Props) {
  return (
    <ToolbarProvider>
      <EditorContent userid={userid} tid={tid} />
    </ToolbarProvider>
  );
}

function EditorContent({ userid, tid }: Props) {
  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);
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

  const editor: TiptapEditorType | null = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
      handleKeyDown: (view, event): boolean => {
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
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // 현재 위치가 리스트 아이템인지 확인
          const isInListItem = $from.node(-1)?.type.name === "listItem";

          if (isInListItem) {
            return (
              editor?.chain().focus().sinkListItem("listItem").run() || false
            );
          } else {
            // 일반 텍스트에서 Tab 키를 눌렀을 때는 들여쓰기 문자 삽입
            // 유니코드 &emsp; (em space)를 사용하여 실제 들여쓰기 효과 생성
            return (
              editor?.chain().focus().insertContent("\u2003\u2003").run() ||
              false
            );
          }
        }

        // Enter 키를 눌렀을 때 코드 블록에서 들여쓰기 유지
        if (event.key === "Enter") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // 현재 위치가 코드 블록인지 확인 (Tiptap의 isActive 메서드 사용)
          const isInCodeBlock = editor?.isActive("codeBlock") || false;
          console.log("Is in code block (isActive):", isInCodeBlock);

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

            console.log("Current line text:", JSON.stringify(currentLine));
            console.log("Current line length:", currentLine.length);
            console.log("Line start position:", lineStart);
            console.log("Current position:", currentPos);

            // 현재 줄의 앞쪽 공백/들여쓰기 추출 (모든 종류의 공백 포함)
            const indentMatch = currentLine.match(/^(\s*)/);
            const indent = indentMatch ? indentMatch[1] : "";

            console.log("Extracted indent:", JSON.stringify(indent));
            console.log("Indent length:", indent.length);

            // Enter 키 기본 동작 실행 후 들여쓰기 삽입
            setTimeout(() => {
              if (indent && indent.length > 0) {
                console.log("Inserting indent:", JSON.stringify(indent));
                editor?.chain().focus().insertContent(indent).run();
              } else {
                console.log("No indent to insert");
              }
            }, 10);

            return false; // 기본 Enter 동작 허용
          }
        }

        return false;
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleContentChange(html);
    },
  });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  // 에디터 초기 로드 or 탭 변경시 콘텐츠 동기화
  useEffect(() => {
    if (!editor) return;

    const content =
      tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EditorPanel saveStatus={saveStatus} onRevert={handleRevert} />

      <div className="w-full overflow-auto border">
        <TiptapToolbar
          editor={editor}
          mobileView={mobileView}
          onHighlighterClick={() => setMobileView("highlighter")}
          onLinkClick={() => setMobileView("link")}
          onImageClick={() => setIsImageUploaderOpen(true)}
          onBack={() => setMobileView("main")}
          toolbarRef={toolbarRef}
        />

        <TiptapEditorContent
          editor={editor}
          role="presentation"
          className="mx-auto flex w-full flex-1 flex-col bg-white p-4 transition-all duration-200 focus-within:border-2 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-500 dark:bg-[hsl(var(--background))]"
        />
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
