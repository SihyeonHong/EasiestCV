"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";

// --- Tiptap Node ---
import "@/app/components/tiptap/tiptap-node/blockquote-node/blockquote-node.css";
import "@/app/components/tiptap/tiptap-node/code-block-node/code-block-node.css";
import "@/app/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.css";
import "@/app/components/tiptap/tiptap-node/list-node/list-node.css";
import "@/app/components/tiptap/tiptap-node/image-node/image-node.css";
import "@/app/components/tiptap/tiptap-node/heading-node/heading-node.css";
import "@/app/components/tiptap/tiptap-node/paragraph-node/paragraph-node.css";

// --- UI Primitives ---
import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { ArrowLeftIcon } from "@/app/components/tiptap/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/app/components/tiptap/tiptap-icons/highlighter-icon";
import { ImagePlusIcon } from "@/app/components/tiptap/tiptap-icons/image-plus-icon";
import { LinkIcon } from "@/app/components/tiptap/tiptap-icons/link-icon";
import { HorizontalRule } from "@/app/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
// --- Tiptap UI ---
import { BlockquoteButton } from "@/app/components/tiptap/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/app/components/tiptap/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/app/components/tiptap/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/app/components/tiptap/tiptap-ui/heading-dropdown-menu";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/app/components/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/app/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/app/components/tiptap/tiptap-ui/mark-button";
import { TextAlignButton } from "@/app/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/app/components/tiptap/tiptap-ui/undo-redo-button";
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/app/components/tiptap/tiptap-ui-primitive/toolbar";
// --- Icons ---
import { useCursorVisibility } from "@/hooks/tiptap/use-cursor-visibility";
import { useIsMobile } from "@/hooks/tiptap/use-mobile";
import { useWindowSize } from "@/hooks/tiptap/use-window-size";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";

// --- Styles ---
import "@/app/components/tiptap/tiptap-templates/simple/simple-editor.css";

interface Props {
  userid: string;
  tid: number;
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onImageClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  onImageClick: () => void;
  isMobile: boolean;
}) => {
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
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
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
        <Button data-style="ghost" onClick={onImageClick}>
          <ImagePlusIcon className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}
    </div>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <div className="flex flex-wrap items-center">
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </div>
);

export default function Editor({ userid, tid }: Props) {
  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
    });

  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
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
        class: "simple-editor",
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

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
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

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

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
      <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />

      <div className="simple-editor-wrapper">
        <EditorContext.Provider value={{ editor }}>
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                onImageClick={() => setIsImageUploaderOpen(true)}
                isMobile={isMobile}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>

          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content bg-white dark:bg-[hsl(var(--background))]"
          />
        </EditorContext.Provider>
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
