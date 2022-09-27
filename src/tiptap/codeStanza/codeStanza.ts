// This is a tiptap block that can be dragged around the page.

import CodeBlock from "@tiptap/extension-code-block";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import FlowCodeView from "./codeStanzaView";

export interface CodeStanzaOptions {
  HTMLAttributes: Record<string, any>;
}

export const CodeStanza = CodeBlock.extend<CodeStanzaOptions>({
  name: "codeStanza",

  group: "flow",

  draggable: true,

  parseHTML() {
    return [{ tag: "code-stanza" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "code-stanza",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FlowCodeView);
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Backspace: () => {
  //       const { empty, $anchor } = this.editor.state.selection;
  //       const isAtStart = $anchor.pos === 1;

  //       if (!empty || $anchor.parent.type.name !== this.name) {
  //         return false;
  //       }

  //       if (isAtStart || !$anchor.parent.textContent.length) {
  //         return this.editor.commands.clearNodes();
  //       }

  //       return false;
  //     },
  //   };
  // },
});
