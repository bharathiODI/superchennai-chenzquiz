import React from 'react'
import type { ElementRegistry } from '../registry'
import type { SectionData } from '../types'
import { columnSpanStyle, compileStyle, layoutClasses } from '../style/engine'

/**
 * Frontend renderer — server components walking the Section → Row →
 * Column → Element tree.
 *
 *   import '@opendesigns/payload-builder/rsc/builder.css'
 *   <BuilderRenderer layout={page.layout} registry={registry} locale={locale} />
 *
 * For scroll-triggered animations, also mount <BuilderAnimations /> once.
 */

type Node = Record<string, unknown>

const asArray = (v: unknown): Node[] => (Array.isArray(v) ? (v as Node[]) : [])

const mediaUrl = (value: unknown): string | undefined => {
  if (value && typeof value === 'object' && 'url' in value) {
    const u = (value as { url?: unknown }).url
    if (typeof u === 'string' && u) return u
  }
  return undefined
}

const hasOverlay = (node: Node): boolean => {
  const bg = node.bg as Node | undefined
  if (!bg) return false
  return (bg.type === 'image' || bg.type === 'video') && (!!bg.overlay || bg.overlayOpacity != null)
}

const BackgroundVideo: React.FC<{ node: Node }> = ({ node }) => {
  const bg = node.bg as Node | undefined
  if (bg?.type !== 'video') return null
  const src = mediaUrl(bg.video)
  if (!src) return null
  return (
    <video
      className="pb-bg-video-el"
      poster={mediaUrl(bg.poster)}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    />
  )
}

interface RenderCtx {
  registry: ElementRegistry
  locale: string
}

const ElementNode: React.FC<{ element: Node } & RenderCtx> = ({ element, locale, registry }) => {
  const slug = typeof element.blockType === 'string' ? element.blockType : ''
  const def = registry.get(slug)
  if (!def) {
    if (process.env.NODE_ENV !== 'production') {
      return <div className="pb-missing">Unknown element: {slug || '(none)'}</div>
    }
    return null
  }
  const s = compileStyle(element as never, 'pb-element')
  const { Component } = def
  return (
    <div className={s.className} id={s.id} style={s.style} {...s.attrs}>
      {hasOverlay(element) ? <div className="pb-overlay" aria-hidden="true" /> : null}
      <BackgroundVideo node={element} />
      <Component data={element as never} locale={locale} />
    </div>
  )
}

const ColumnNode: React.FC<{ column: Node } & RenderCtx> = ({ column, locale, registry }) => {
  const s = compileStyle(column as never, 'pb-column')
  const link = typeof column.linkUrl === 'string' && column.linkUrl ? column.linkUrl : undefined
  const valign =
    typeof column.valign === 'string' && column.valign !== 'inherit'
      ? { alignSelf: column.valign as React.CSSProperties['alignSelf'] }
      : {}

  const inner = (
    <>
      {hasOverlay(column) ? <div className="pb-overlay" aria-hidden="true" /> : null}
      <BackgroundVideo node={column} />
      {asArray(column.elements).map((el, i) => (
        <ElementNode
          key={(el.id as string) ?? i}
          element={el}
          locale={locale}
          registry={registry}
        />
      ))}
    </>
  )

  const props = {
    className: `${s.className}${link ? ' pb-column--link' : ''}`,
    id: s.id,
    style: { ...s.style, ...columnSpanStyle(column.width), ...valign },
    ...s.attrs,
  }

  return link ? <a {...props} href={link}>{inner}</a> : <div {...props}>{inner}</div>
}

const RowNode: React.FC<{ row: Node } & RenderCtx> = ({ locale, registry, row }) => {
  const s = compileStyle(row as never, 'pb-row')
  return (
    <div
      className={`${s.className} ${layoutClasses(row)}`}
      id={s.id}
      style={s.style}
      {...s.attrs}
    >
      {asArray(row.columns).map((col, i) => (
        <ColumnNode key={(col.id as string) ?? i} column={col} locale={locale} registry={registry} />
      ))}
    </div>
  )
}

export const BuilderSection: React.FC<{ section: Node; index?: number } & RenderCtx> = ({
  index,
  locale,
  registry,
  section,
}) => {
  const s = compileStyle(section as never, 'pb-section')
  const width = section.widthMode === 'full' ? 'pb-w-full' : 'pb-w-contained'
  const Tag = (typeof section.tag === 'string' ? section.tag : 'section') as 'section'
  const style = { ...s.style }
  if (typeof section.minHeight === 'string' && section.minHeight) {
    ;(style as Record<string, string>)['--pb-minh'] = section.minHeight
  }

  return (
    <Tag
      className={`${s.className} ${width} ${layoutClasses(section)}`}
      data-pb-section={index}
      id={s.id}
      style={style}
      {...s.attrs}
    >
      {hasOverlay(section) ? <div className="pb-overlay" aria-hidden="true" /> : null}
      <BackgroundVideo node={section} />
      <div className="pb-section-inner">
        {asArray(section.rows).map((row, i) => (
          <RowNode key={(row.id as string) ?? i} locale={locale} registry={registry} row={row} />
        ))}
      </div>
    </Tag>
  )
}

export const BuilderRenderer: React.FC<{
  /** Accepts anything array-shaped — page layouts and resolved layout slots. */
  layout: SectionData[] | Node[] | unknown[] | null | undefined
  registry: ElementRegistry
  locale?: string
}> = ({ layout, locale = 'en', registry }) => {
  const sections = asArray(layout)
  if (!sections.length) return null
  return (
    <>
      {sections.map((section, i) => (
        <BuilderSection
          key={(section.id as string) ?? i}
          index={i}
          locale={locale}
          registry={registry}
          section={section}
        />
      ))}
    </>
  )
}

/**
 * Mount once per page to enable scroll-triggered animations.
 * Inlined as a module script so it needs no client component boundary and
 * no hydration; it no-ops when the browser prefers reduced motion.
 */
export const BuilderAnimations: React.FC = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (e.isIntersecting) { e.target.classList.add('pb-in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
function scan(){ document.querySelectorAll('.pb-anim-scroll:not(.pb-in)').forEach(function(n){ io.observe(n); }); }
if (document.readyState !== 'loading') scan(); else document.addEventListener('DOMContentLoaded', scan);
})();`,
    }}
  />
)

export { MarkedText } from './MarkedText'
export { ThemeInitScript } from './ThemeInitScript'
export { standardElements } from '../elements/index'
