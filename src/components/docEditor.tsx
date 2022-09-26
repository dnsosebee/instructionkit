import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Doc, DocUpdate } from "../doc";

export const PREVENT_TIPTAP_DEFAULT = true;
export const ALLOW_TIPTAP_DEFAULT = false;

export interface DocEditorProps {
  doc: Doc;
  handleUpdateDoc: (update: DocUpdate) => void;
}

export const DocEditor = ({ doc, handleUpdateDoc }: DocEditorProps) => {
  const docRef = useRef(doc);
  // keep ref up to date with new props
  useEffect(() => {
    docRef.current = doc;
  }, [doc]);

  // Title stuff
  const CustomDocument = Document.extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          return PREVENT_TIPTAP_DEFAULT;
        },
      };
    },
  });

  const titleEditor = useEditor({
    extensions: [CustomDocument, Paragraph, Text],
    content: `${docRef.current.title}`,
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML()); // <p>Hello World! 🌎</p>
      handleUpdateDoc({ ...docRef.current, title: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (
      titleEditor &&
      doc.title !== titleEditor.getHTML() &&
      !titleEditor.isFocused
    ) {
      titleEditor.commands.setContent(`${doc.title}`);
    }
  }, [doc.title]);

  // Content stuff
  const contentEditor = useEditor({
    extensions: [StarterKit],
    content: `${docRef.current.text}`,
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML()); // <p>Hello World! 🌎</p>
      handleUpdateDoc({ ...docRef.current, text: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (
      contentEditor &&
      doc.text !== contentEditor.getHTML() &&
      !contentEditor.isFocused
    ) {
      contentEditor.commands.setContent(`${doc.text}`);
    }
  }, [doc.text]);

  return (
    <div className="border list-disc flex-grow m-4">
      <EditorContent editor={titleEditor} key={`TE/${doc.id}`} />
      <div className="h-0 border"></div>
      <EditorContent editor={contentEditor} key={`CE/${doc.id}`} />
    </div>
  );
};
