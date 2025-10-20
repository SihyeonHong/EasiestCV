import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import * as React from "react";

export const HorizontalRuleNode: React.FC<ReactNodeViewProps> = ({
  selected,
}) => {
  return (
    <NodeViewWrapper
      as="div"
      data-type="horizontalRule"
      className={selected ? "ProseMirror-selectednode" : ""}
    >
      <hr />
    </NodeViewWrapper>
  );
};
