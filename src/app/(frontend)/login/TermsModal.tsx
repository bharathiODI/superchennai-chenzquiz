'use client'
import { X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* eslint-disable @typescript-eslint/no-explicit-any */

// Minimal rich-text renderer for the Terms & Conditions text edited in the CMS
// (paragraphs, headings, lists, links, bold/italic/underline, line breaks).
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 8

function renderChildren(nodes: any[] | undefined): React.ReactNode {
  return (nodes ?? []).map((node, i) => renderNode(node, i))
}

function renderNode(node: any, key: number): React.ReactNode {
  switch (node?.type) {
    case 'text': {
      let el: React.ReactNode = node.text
      const f = Number(node.format) || 0
      if (f & FORMAT_BOLD) el = <strong>{el}</strong>
      if (f & FORMAT_ITALIC) el = <em>{el}</em>
      if (f & FORMAT_UNDERLINE) el = <u>{el}</u>
      return <React.Fragment key={key}>{el}</React.Fragment>
    }
    case 'linebreak':
      return <br key={key} />
    case 'link':
    case 'autolink': {
      const href = node.fields?.url || node.url || '#'
      const newTab = node.fields?.newTab
      return (
        <a
          key={key}
          href={href}
          className="font-semibold text-[#4B20D8] underline underline-offset-2"
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {renderChildren(node.children)}
        </a>
      )
    }
    case 'heading':
      return (
        <h3 key={key} className="mt-6 mb-2 text-base font-extrabold text-[#1A1446] first:mt-0">
          {renderChildren(node.children)}
        </h3>
      )
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag
          key={key}
          className={`space-y-1.5 pl-5 ${Tag === 'ol' ? 'list-decimal' : 'list-disc'} marker:text-[#4B20D8]`}
        >
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>
    case 'quote':
      return (
        <blockquote key={key} className="border-l-4 border-[#4B20D8]/40 pl-4 italic">
          {renderChildren(node.children)}
        </blockquote>
      )
    case 'paragraph':
    default:
      return node?.children?.length ? (
        <p key={key} className="mb-3">
          {renderChildren(node.children)}
        </p>
      ) : null
  }
}

type Props = {
  open: boolean
  title: string
  agreeLabel: string
  content: any
  onClose: () => void
  onAgree: () => void
}

export default function TermsModal({ open, title, agreeLabel, content, onClose, onAgree }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  // Rendered into <body> so no transformed or z-indexed parent can clip it or sit above it.
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0F0A2E]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#ECEEF6] px-6 py-4">
          <h2 id="terms-title" className="text-xl font-black text-[#1A1446]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#74799A] transition hover:bg-[#F3F1FF] hover:text-[#4B20D8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 text-sm leading-relaxed text-[#4A4F6A]">
          {renderChildren(content?.root?.children)}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#ECEEF6] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 cursor-pointer rounded-xl border border-[#DFE2EF] px-6 text-sm font-bold text-[#4A4F6A] transition hover:border-[#4B20D8] hover:text-[#4B20D8]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] px-8 text-sm font-extrabold text-white shadow-lg shadow-[#4B20D8]/20 transition hover:from-[#3215A8] hover:to-[#4B20D8]"
          >
            {agreeLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
