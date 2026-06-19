"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  children?: ReactNode
}

function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  const activeChild = Array.isArray(children)
    ? children.find((child: any) => child.props?.id === activeTab)
    : children

  return (
    <div>
      <div className="flex border-b border-zinc-200 dark:border-zinc-700" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        {activeChild}
      </div>
    </div>
  )
}

export { Tabs, type TabsProps, type Tab }
