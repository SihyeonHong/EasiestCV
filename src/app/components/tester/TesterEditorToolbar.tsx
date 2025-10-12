"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  CodeSquare,
  Eraser,
  TextSelect,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/common/Tooltip";

interface TesterEditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  shortcut?: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  shortcut,
  children,
}: ToolbarButtonProps) {
  const [isActiveState, setIsActiveState] = useState(isActive);

  const handleClick = () => {
    setIsActiveState(!isActiveState);
    onClick();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          data-active={isActiveState}
          disabled={disabled}
          className="data-[active=true]:bg-zinc-200 dark:data-[active=true]:bg-zinc-700"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {tooltip}
          {shortcut && (
            <kbd className="bg-muted ml-2 rounded border px-1 py-0.5 text-xs">
              {shortcut}
            </kbd>
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function TesterEditorToolbar({
  editor,
}: TesterEditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="border-input flex flex-wrap gap-1 rounded-md border bg-transparent p-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="굵게"
          shortcut="Ctrl+B"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="기울임"
          shortcut="Ctrl+I"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="취소선"
          shortcut="Ctrl+Shift+X"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="밑줄"
          shortcut="Ctrl+U"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="형광펜"
          shortcut="Ctrl+Shift+H"
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 w-[1px]" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="제목 1"
          shortcut="Ctrl+Alt+1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="제목 2"
          shortcut="Ctrl+Alt+2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="제목 3"
          shortcut="Ctrl+Alt+3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="글머리 기호 목록"
          shortcut="Ctrl+Shift+8"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="번호 매기기 목록"
          shortcut="Ctrl+Shift+7"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="인용구"
          shortcut="Ctrl+Shift+B"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="인라인 코드"
          shortcut="Ctrl+E"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="코드 블록"
          shortcut="Ctrl+Alt+C"
        >
          <CodeSquare className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          tooltip="서식 지우기"
        >
          <Eraser className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          tooltip="스타일 지우기"
        >
          <TextSelect className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 w-[1px]" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("링크 URL을 입력하세요:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
          tooltip="링크"
          shortcut="Ctrl+K"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("이미지 URL을 입력하세요:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          tooltip="이미지"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
