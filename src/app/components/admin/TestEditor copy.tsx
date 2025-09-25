"use client";

import React, { useMemo } from "react";
import { useQuill } from "react-quilljs";

import { formats } from "@/constants/editor";
import { useEditorStyles } from "@/hooks/useEditorStyles";

export default function TestEditor() {
  useEditorStyles();

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          ["code", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image"],
          [{ align: [] }, { color: [] }, { background: [] }],
        ],
      },
    };
  }, []);

  const { quill, quillRef } = useQuill({ modules, formats });

  return (
    <div>
      <div
        ref={quillRef}
        className="min-h-96 border-2 bg-white dark:bg-black"
      />
    </div>
  );
}
