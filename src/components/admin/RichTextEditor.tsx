"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("bold")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("italic")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("strike")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Strike
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("heading", { level: 1 })
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("heading", { level: 2 })
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("heading", { level: 3 })
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        H3
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("bulletList")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("orderedList")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Numbered List
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("blockquote")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Quote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("codeBlock")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Code
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={setLink}
        className={`px-2 py-1 rounded text-sm font-medium ${
          editor.isActive("link")
            ? "bg-rose-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Link
      </button>
      <button
        type="button"
        onClick={addImage}
        className="px-2 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100"
      >
        Image
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="px-2 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="px-2 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className="bg-white"
      />
    </div>
  );
}
