/* This example requires Tailwind CSS v2.0+ */

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export interface StanzaWrapperProps {
  name: string;
}

export default function StanzaWrapper({ name }: StanzaWrapperProps) {
  return (
    <NodeViewWrapper>
      <div className="flex flex-col mb-2">
        <div
          contentEditable={false}
          data-drag-handle // necessary for drag and drop
          draggable={true} // necessary for drag and drop
          className=" text-sm text-blue-300 select-none cursor-move text-center w-full bg-blue-200 border rounded-lg"
        >
          {name}
        </div>
        {/* Be sure to use this with a layout container that is full-width on mobile */}
        <div className="overflow-hidden bg-white shadow border sm:rounded-lg cursor-text">
          <div className="px-4 py-5 sm:p-6 prose">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
