import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { Flow } from "../../model/core/flow";
import flowDocument from "../../tiptap/flowDocument";
import { Mutate } from "../app";

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
    extensions: [flowDocument],
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
    <div className="border rounded-2xl list-disc flex-grow cursor-default nodrag w-96 bg-white">
      <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
    </div>
  );
};
