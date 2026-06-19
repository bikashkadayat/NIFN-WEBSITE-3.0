'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CodeBlock } from './CodeBlock'

interface MdxRendererProps {
  content: string
}

function addHeadingIds(html: string): string {
  return html.replace(/<h([23])\b([^>]*)>(.*?)<\/h([23])>/gi, (match, level, attrs, text, endLevel) => {
    const id = text
      .replace(/<[^>]*>/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return `<h${level}${attrs} id="${id}">${text}</h${endLevel}>`
  })
}

export function MdxRenderer({ content }: MdxRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const htmlWithIds = addHeadingIds(content)
    containerRef.current.innerHTML = htmlWithIds

    containerRef.current.querySelectorAll('pre > code').forEach((codeEl) => {
      const pre = codeEl.parentElement!
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'
      const placeholder = document.createElement('div')
      placeholder.className = 'code-block-placeholder'
      wrapper.appendChild(placeholder)
      pre.parentNode?.replaceChild(wrapper, pre)
    })
  }, [content, mounted])

  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:scroll-mt-20
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-20
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
        prose-li:mb-2 prose-li:text-gray-700
        prose-a:text-cyan-600 prose-a:underline hover:prose-a:text-cyan-800
        prose-strong:font-bold prose-strong:text-gray-900
        prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-50/30 prose-blockquote:py-2 prose-blockquote:px-4
        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
        prose-table:border-collapse prose-th:bg-gray-50 prose-th:border prose-th:p-3
        prose-td:border prose-td:p-3
        prose-pre:bg-[#0F172A] prose-pre:rounded-xl prose-pre:p-0 prose-pre:overflow-x-auto
        prose-code:bg-gray-100 prose-code:text-cyan-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
        prose-code:before:content-none prose-code:after:content-none
        prose-hr:border-gray-200 prose-hr:my-12"
    >
      <div ref={containerRef} />
      {mounted && containerRef.current && (
        <CodeBlockPortal container={containerRef.current} />
      )}
    </div>
  )
}

function CodeBlockPortal({ container }: { container: HTMLDivElement }) {
  const items = useCodeBlockDefs(container)

  return (
    <>
      {items.map((item, i) => {
        const placeholder = container.querySelector(
          `.code-block-wrapper:nth-child(${i + 1}) .code-block-placeholder`
        )
        if (!placeholder) return null
        return createPortal(
          <CodeBlock key={i} code={item.code} language={item.language} />,
          placeholder
        )
      })}
    </>
  )
}

function useCodeBlockDefs(container: HTMLDivElement) {
  const [defs, setDefs] = useState<{ code: string; language?: string }[]>([])

  useEffect(() => {
    const wrappers = container.querySelectorAll('.code-block-wrapper')
    const items: { code: string; language?: string }[] = []

    wrappers.forEach((wrapper) => {
      const codeEl = wrapper.querySelector('code')
      if (!codeEl) return
      const code = codeEl.textContent || ''
      const classList = Array.from(codeEl.classList)
      const langClass = classList.find((c) => c.startsWith('language-'))
      const language = langClass ? langClass.replace('language-', '') : undefined
      items.push({ code, language })
    })

    setDefs(items)
  }, [container])

  return defs
}
