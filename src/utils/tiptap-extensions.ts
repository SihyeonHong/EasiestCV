import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Image } from "@tiptap/extension-image";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { Selection } from "@tiptap/extensions";

/**
 * Tiptap 에디터에서 사용할 모든 extensions 설정
 */
export const getTiptapExtensions = () => [
  // 필수 기본 확장
  Document,
  Text,
  Paragraph,
  HardBreak,
  // History (undo/redo)
  History,
  // UI 관련
  Dropcursor,
  Gapcursor,
  // Marks
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Heading,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Blockquote,
  BulletList,
  OrderedList,
  ListItem,
  CodeBlock,
  HorizontalRule,
  Link.configure({
    openOnClick: false, // 에디터에서는 링크 클릭해도 안 열림
    enableClickSelection: true, // 링크를 클릭해도 텍스트 선택 가능. 기본값은 false로 클릭 시 선택이 막힘.
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image,
  Typography,
  Superscript,
  Subscript,
  Selection,
];
