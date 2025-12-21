"use client";

import Editor from "@/app/components/admin/Editor";
import { ToolbarProvider } from "@/app/components/admin/ToolbarProvider";

interface Props {
  userid: string;
  tid: number;
}

export default function EditorContainer({ userid, tid }: Props) {
  return (
    <ToolbarProvider>
      <Editor userid={userid} tid={tid} />
    </ToolbarProvider>
  );
}
