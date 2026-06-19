'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Copy } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'

const LANG_MAP: Record<string, string> = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  json: 'json',
  php: 'php',
  python: 'python',
  py: 'python',
  go: 'go',
  golang: 'go',
}

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)
  const lang = language ? (LANG_MAP[language.toLowerCase()] || language) : ''

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, lang])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-xl overflow-hidden my-6">
      <div className="flex items-center justify-between bg-[#1e293b] px-4 py-2 border-b border-white/10">
        {lang ? (
          <span className="text-xs font-medium text-gray-300 uppercase">{lang}</span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <pre className="!m-0 !rounded-t-none !bg-[#0f172a] overflow-x-auto text-gray-200">
        <code ref={codeRef} className={lang ? `language-${lang}` : ''}>
          {code}
        </code>
      </pre>
    </div>
  )
}
