"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@/style/tiptap.css";

interface Props {
  userid: string;
  tid: number;
}

export default function TesterAdminEditor({ userid, tid }: Props) {
  const initialValue = `${userid} - ${tid}`;
  const editor = useEditor({
    extensions: [StarterKit],
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
      <EditorContent editor={editor} />
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
