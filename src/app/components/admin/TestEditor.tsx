"use client";

import Quill from "quill";
import React, { useMemo } from "react";
import { useQuill } from "react-quilljs";

import { formats } from "@/constants/editor";
import { useEditorStyles } from "@/hooks/useEditorStyles";

export default function TestEditor() {
  useEditorStyles();

  const modules = useMemo(() => {
    if (typeof window !== "undefined") {
      interface BlockStatic {
        new (): {
          domNode: HTMLElement;
          format(name: string, value: unknown): void;
          statics: {
            blotName: string;
          };
        };
        create(value?: string): HTMLElement;
        formats(node: HTMLElement): unknown;
      }

      const Block = Quill.import("blots/block") as BlockStatic;

      class CodeBlock extends Block {
        static blotName = "code-block";
        static tagName = "div";

        static create(value: string) {
          const node = super.create();
          node.classList.add("ql-code-block");

          const pre = document.createElement("pre");
          pre.classList.add("hljs");
          const code = document.createElement("code");
          code.textContent = value || "";
          pre.appendChild(code);
          node.appendChild(pre);

          return node;
        }

        static formats() {
          return true;
        }

        format(name: string, value: unknown) {
          if (name === this.statics.blotName && value) return;
          super.format(name, value);
        }
      }

      Quill.register("formats/code-block", CodeBlock, true);
    }

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
      keyboard: {
        bindings: {
          tab: {
            key: 9,
            handler: function () {
              return true;
            },
          },
        },
      },
    };
  }, []);

  const { quillRef } = useQuill({ modules, formats });

  return (
    <div>
      <div
        ref={quillRef}
        className="min-h-96 border-2 bg-white dark:bg-black"
      />
    </div>
  );
}
