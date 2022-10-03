import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Mutate } from "../app";
import { Flow } from "../flow";
import { CodeStanza } from "../tiptap/codeStanza/codeStanza";
import flowExtension from "../tiptap/flowExtension";
import { PageStanza } from "../tiptap/pageStanza/pageStanza";

export const PREVENT_TIPTAP_DEFAULT = true;
export const ALLOW_TIPTAP_DEFAULT = false;

export interface FlowEditorProps {
  flow: Flow;
  mutate: Mutate;
}

export const FlowEditor = ({ flow, mutate }: FlowEditorProps) => {
  const flowRef = useRef(flow);
  // keep ref up to date with new props
  useEffect(() => {
    flowRef.current = flow;
  }, [flow]);

  // Content stuff
  const contentEditor = useEditor({
    extensions: [StarterKit, flowExtension, PageStanza, CodeStanza],
    content: `${flowRef.current.flowtext}`,
    onUpdate: ({ editor }) => {
      mutate.updateFlow({ ...flowRef.current, flowtext: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "p-5",
      },
    },
  });

  useEffect(() => {
    if (
      contentEditor &&
      flow.flowtext !== contentEditor.getHTML() &&
      !contentEditor.isFocused
    ) {
      contentEditor.commands.setContent(`${flow.flowtext}`);
    }
  }, [flow.flowtext]);

  return (
    <div className="border list-disc flex-grow m-4">
      <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
    </div>
  );
};
