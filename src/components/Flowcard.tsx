import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { Floem } from "../floem";

export const Flowcard = ({
  floem,
  onSelect,
  onDelete,
  selected,
  handleUpdateTitle,
}: {
  floem: Floem;
  onSelect: () => void;
  onDelete: () => void;
  selected: boolean;
  handleUpdateTitle: (id: string, title: string) => void;
}) => {
  const titleText = useEditor({
    extensions: [Document, Paragraph, Text],
    content: `${floem.title}`,
    editable: selected,
    onUpdate: ({ editor }) => {
      handleUpdateTitle(floem.id, editor.getText());
    },
    editorProps: {
      attributes: {
        class: "prose",
      },
    },
  });

  useEffect(() => {
    if (titleText) {
      titleText.setOptions({ editable: selected });
    }
  }, [selected]);

  useEffect(() => {
    if (titleText && floem.title !== titleText.getText()) {
      titleText.commands.setContent(`${floem.title}`);
    }
  }, [floem.title]);

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  const cardClasses = `flex ${
    selected ? "bg-gray-200" : "bg-white"
  } rounded shadow-lg text-gray-800 m-2`;

  return (
    <>
      {selected ? (
        <div className={cardClasses}>
          <EditorContent
            editor={titleText}
            key={`FC/${floem.id}`}
            className="grow"
          />
          <button
            onClick={handleDelete}
            className="ml-auto hover:bg-red-300 self-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button onClick={onSelect} className={cardClasses}>
          <EditorContent editor={titleText} key={`FC/${floem.id}`} />
        </button>
      )}
    </>
  );
};
