// This is a tiptap block that can be dragged around the page.

import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import FlowPageView from "./flowPageView";

export interface FlowPageOptions {
  HTMLAttributes: Record<string, any>;
}

export const FlowPage = Node.create<FlowPageOptions>({
  name: "flowPage",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "flow",

  draggable: true,

  content: "block+",

  parseHTML() {
    return [{ tag: "flow-page" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "flow-page",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "draggable-item",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlowPageView);
  },
});
