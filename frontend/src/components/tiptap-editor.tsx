'use client'

import { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none',
      },
    },
  })

  if (!editor) return null

  const ToolBtn = ({ onClick, isActive, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={editor.isActive(isActive) ? 'is-active' : ''}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="tiptap-toolbar">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive='bold' title="Bold">
          <Bold className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive='italic' title="Italic">
          <Italic className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive='strike' title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={{ heading: { level: 1 } }} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={{ heading: { level: 2 } }} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive='bulletList' title="Bullet List">
          <List className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive='orderedList' title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive='blockquote' title="Blockquote">
          <Quote className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive='codeBlock' title="Code Block">
          <Code className="w-4 h-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive='' title="Horizontal Rule">
          <Minus className="w-4 h-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} isActive='' title="Undo">
          <Undo className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} isActive='' title="Redo">
          <Redo className="w-4 h-4" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}