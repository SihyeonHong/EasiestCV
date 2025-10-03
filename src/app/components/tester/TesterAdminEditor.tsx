"use client";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import { common, createLowlight } from "lowlight";

import "@/style/tiptap.css";

const lowlight = createLowlight(common);
import TesterEditorToolbar from "@/app/components/tester/TesterEditorToolbar";

interface Props {
  userid: string;
  tid: number;
}

export default function TesterAdminEditor({ userid, tid }: Props) {
  const initialValue = `${userid} - ${tid}`;
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Underline,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Code,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight,
      Image,
      Link,
    ],
    content: initialValue,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });
  //   const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  //   const handleImageInsert = (imageUrl: string) => {
  // insertImage(imageUrl, (errorKey: string) => {
  //   alert(tError(errorKey));
  // });
  //   };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TesterEditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose prose-slate max-w-none" />
      {/* <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} /> */}

      {/* <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      /> */}
    </div>
  );
}
