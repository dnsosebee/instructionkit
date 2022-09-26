import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { Doc } from "../doc";

export const DocSelector = ({
  doc,
  onSelect,
  onDelete,
  selected,
}: {
  doc: Doc;
  onSelect: () => void;
  onDelete: () => void;
  selected: boolean;
}) => {
  const titleText = useEditor({
    extensions: [Document, Paragraph, Text],
    content: `${doc.title}`,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (titleText && doc.title !== titleText.getHTML()) {
      titleText.commands.setContent(`${doc.title}`);
    }
  }, [doc.title]);

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <button
      onClick={onSelect}
      className={`flex ${
        selected ? "bg-gray-200" : "bg-white"
      } rounded shadow-lg text-gray-800 m-2`}
    >
      <EditorContent editor={titleText} key={`DSE/${doc.id}`} />
      {selected && (
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
      )}
    </button>
  );
};
