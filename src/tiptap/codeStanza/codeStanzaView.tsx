import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper>
      <span
        className="text-lg select-none"
        data-drag-handle
        contentEditable={false}
      >
        === Code ===
      </span>

      <NodeViewContent className="bg-yellow-400" />
    </NodeViewWrapper>
  );
};
