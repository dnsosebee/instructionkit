// This is a tiptap block that can be dragged around the page.

import CodeBlock from "@tiptap/extension-code-block";

export interface PageStanzaOptions {
  HTMLAttributes: Record<string, any>;
}

export const PageStanza = CodeBlock.extend<PageStanzaOptions>({
  name: "pageStanza",

  // addOptions() {
  //   return {
  //     HTMLAttributes: {},
  //   };
  // },

  group: "flow",

  // draggable: true,

  // content: "block+",

  // parseHTML() {
  //   return [{ tag: "flow-page" }];
  // },

  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     "flow-page",
  //     mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
  //       "data-type": "draggable-item",
  //     }),
  //     0,
  //   ];
  // },

  // addNodeView() {
  //   return ReactNodeViewRenderer(FlowPageView);
  // },
});
