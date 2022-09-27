import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper>
      <span className="text-lg select-none" contentEditable={false}>
        Person
      </span>

      <NodeViewContent className="bg-yellow-400" />
    </NodeViewWrapper>
  );
};
