'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'

/**
 * AJAX-style filters for the Quiz Dashboard: links, chips, pager and the filter form update the
 * page in place (no full reload) and keep the URL, so a filtered view can still be bookmarked.
 * Selects, dates and tick boxes apply at once; the search box waits until typing stops.
 */
export function SoftNav({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const go = (url: string) => start(() => router.push(url, { scroll: false }))
    const submit = (form: HTMLFormElement) => {
      const params = new URLSearchParams()
      new FormData(form).forEach((v, k) => {
        // defaults ("any", "all") stay out of the address
        if (typeof v === 'string' && v.trim() !== '' && v !== 'any' && v !== 'all') params.set(k, v.trim())
      })
      const action = form.getAttribute('action') || window.location.pathname
      const q = params.toString()
      go(q ? `${action}?${q}` : action)
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const href = a.getAttribute('href') || ''
      if (!href.startsWith('/admin/quiz-dashboard') || a.target || a.hasAttribute('download')) return
      e.preventDefault()
      go(href)
    }
    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement
      if (!form.matches('form[data-soft]')) return
      e.preventDefault()
      submit(form)
    }
    const onChange = (e: Event) => {
      const el = e.target as HTMLInputElement
      const form = el.closest('form[data-soft]') as HTMLFormElement | null
      if (!form || el.type === 'search' || el.type === 'text' || el.type === 'number') return
      submit(form)
    }
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement
      const form = el.closest('form[data-soft]') as HTMLFormElement | null
      if (!form || !(el.type === 'search' || el.type === 'number')) return
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => submit(form), el.type === 'search' ? 450 : 700)
    }
    root.addEventListener('click', onClick)
    root.addEventListener('submit', onSubmit)
    root.addEventListener('change', onChange)
    root.addEventListener('input', onInput)
    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('submit', onSubmit)
      root.removeEventListener('change', onChange)
      root.removeEventListener('input', onInput)
    }
  }, [router])

  return (
    <div ref={ref} className={`qd-soft${pending ? ' is-pending' : ''}`} aria-busy={pending}>
      {children}
    </div>
  )
}
