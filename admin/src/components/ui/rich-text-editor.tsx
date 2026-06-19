'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code2, Image as ImageIcon,
  Link as LinkIcon, Table as TableIcon, Minus,
  Undo2, Redo2, ChevronDown, Type,
} from 'lucide-react'
import client from '@/lib/api'

export interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
        active
          ? 'bg-cyan-100 text-cyan-800'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-zinc-200" />
}

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 0 },
  { label: 'Heading 1', value: 1 },
  { label: 'Heading 2', value: 2 },
  { label: 'Heading 3', value: 3 },
  { label: 'Heading 4', value: 4 },
]

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '300px',
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  const skipNextRef = useRef(false)

  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showHtml, setShowHtml] = useState(false)
  const [htmlValue, setHtmlValue] = useState(content)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
        ImageExtension.configure({ inline: false }),
        LinkExtension.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline,
        Superscript,
        Subscript,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TextStyle,
        Color,
        Placeholder.configure({ placeholder }),
      ],
      content: content || '',
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        setHtmlValue(html)
        if (!skipNextRef.current) {
          onChangeRef.current(html)
        }
      },
      editorProps: {
        attributes: {
          class: 'focus:outline-none',
          style: `min-height: ${minHeight}`,
        },
      },
    },
    [],
  )

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      skipNextRef.current = true
      editor.commands.setContent(content)
      skipNextRef.current = false
    }
  }, [content, editor])

  const addLink = () => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', prev || 'https://')
    if (url === null) return
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = async () => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await client.post<{ data: { url: string } }>('/admin/media', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const url = res.data.data?.url
        if (url) editor.chain().focus().setImage({ src: url }).run()
      } catch {
        const url = window.prompt('Image URL (upload failed)')
        if (url) editor.chain().focus().setImage({ src: url }).run()
      }
    }
    input.click()
  }

  const insertTable = () => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const toggleHtml = () => {
    if (!editor) return
    if (!showHtml) {
      setHtmlValue(editor.getHTML())
      setShowHtml(true)
    } else {
      editor.commands.setContent(htmlValue)
      onChangeRef.current(htmlValue)
      setShowHtml(false)
    }
  }

  const currentHeading = () => {
    if (!editor) return 'Paragraph'
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive('heading', { level: i })) return `Heading ${i}`
    }
    return 'Paragraph'
  }

  const setHeading = (level: number) => {
    if (!editor) return
    setShowHeadingMenu(false)
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 bg-zinc-50 p-1.5">
        {/* Heading selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHeadingMenu((v) => !v)}
            className="flex h-7 items-center gap-1 rounded px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <Type size={13} />
            <span className="min-w-[70px]">{currentHeading()}</span>
            <ChevronDown size={12} />
          </button>
          {showHeadingMenu && (
            <div className="absolute left-0 top-8 z-50 w-36 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              {HEADING_OPTIONS.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => setHeading(h.value)}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-50"
                >
                  {h.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        <ToolbarBtn active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('superscript')} onClick={() => editor?.chain().focus().toggleSuperscript().run()} title="Superscript">
          <SuperscriptIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('subscript')} onClick={() => editor?.chain().focus().toggleSubscript().run()} title="Subscript">
          <SubscriptIcon size={14} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()} title="Align left">
          <AlignLeft size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()} title="Align center">
          <AlignCenter size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()} title="Align right">
          <AlignRight size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive({ textAlign: 'justify' })} onClick={() => editor?.chain().focus().setTextAlign('justify').run()} title="Justify">
          <AlignJustify size={14} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Ordered list">
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()} title="Code">
          <Code2 size={14} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={addLink} active={editor?.isActive('link')} title="Link">
          <LinkIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={addImage} title="Image">
          <ImageIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertTable} title="Table">
          <TableIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={14} />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo" disabled={!editor?.can().undo()}>
          <Undo2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo" disabled={!editor?.can().redo()}>
          <Redo2 size={14} />
        </ToolbarBtn>

        <Divider />

        <button
          type="button"
          onClick={toggleHtml}
          className={cn(
            'rounded px-2 py-1 text-xs font-mono font-medium transition-colors',
            showHtml ? 'bg-cyan-100 text-cyan-800' : 'text-zinc-600 hover:bg-zinc-100',
          )}
        >
          HTML
        </button>
      </div>

      {/* Editor area */}
      {showHtml ? (
        <textarea
          value={htmlValue}
          onChange={(e) => {
            setHtmlValue(e.target.value)
            onChangeRef.current(e.target.value)
          }}
          className="w-full border-none p-4 font-mono text-sm text-zinc-800 outline-none"
          style={{ minHeight }}
        />
      ) : (
        <EditorContent editor={editor} className="p-1" />
      )}
    </div>
  )
}
