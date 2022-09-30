/* This example requires Tailwind CSS v2.0+ */

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export interface StanzaWrapperProps {
  name: string;
}

export default function StanzaWrapper({ name }: StanzaWrapperProps) {
  return (
    <NodeViewWrapper>
      <div className="">
        <div
          contentEditable={false}
          data-drag-handle
          className="block text-sm font-medium text-gray-700 select-none"
        >
          {name}
        </div>
        {/* Be sure to use this with a layout container that is full-width on mobile */}
        <div className="overflow-hidden bg-white shadow border sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 prose">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
