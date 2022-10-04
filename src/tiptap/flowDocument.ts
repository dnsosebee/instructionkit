import Document from "@tiptap/extension-document";
import { Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CodeStanza } from "./codeStanza";
import { PageStanza } from "./pageStanza";

export default Extension.create({
  name: "flow",

  addExtensions() {
    return [
      Document.extend({
        content: "stanza+",
      }),
      StarterKit.configure({ document: false, dropcursor: false }),
      PageStanza,
      CodeStanza,
    ];
  },
});
