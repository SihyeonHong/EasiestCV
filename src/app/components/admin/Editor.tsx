"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { EditorContent as TiptapEditorContent, useEditor } from "@tiptap/react";
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

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
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

  useEffect(() => {
    if (!editor) return;

    const content =
      tid === 0 ? homeData?.intro || "" : currentTab?.contents || "";
    editor.commands.setContent(content);
    setSaveStatus("saved");
  }, [tid, homeData, currentTab, setSaveStatus, editor]);

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
