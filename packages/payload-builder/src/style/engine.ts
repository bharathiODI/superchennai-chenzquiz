import type { CSSProperties } from 'react'
import type { ColumnWidth, StyleControls } from '../types'
import { sanitizeAttrs, sanitizeCssClass, sanitizeCssId, sanitizeCssValue } from './attrs'

/**
 * Style engine — compiles node options into { className, style, attrs }.
 * Server-safe (no DOM). Values become CSS variables so builder.css stays
 * static and CSP-friendly; behaviour switches become classes.
 */

export const COLUMN_FRACTIONS: Record<Exclude<ColumnWidth, 'auto'>, number> = {
  '1/1': 12,
  '1/2': 6,
  '1/3': 4,
  '2/3': 8,
  '1/4': 3,
  '3/4': 9,
  '1/5': 2.4,
  '2/5': 4.8,
  '3/5': 7.2,
  '4/5': 9.6,
  '1/6': 2,
  '5/6': 10,
}

export interface CompiledStyle {
  className: string
  style: CSSProperties
  attrs: Record<string, string>
  id?: string
}

type Vars = Record<string, string>

const put = (vars: Vars, name: string, value: unknown): void => {
  if (value == null || value === '') return
  const safe = sanitizeCssValue(String(value))
  if (safe !== undefined) vars[name] = safe
}

/** Spacing box → CSS vars, with a suffix per breakpoint tier. */
const spacing = (vars: Vars, box: unknown, suffix = ''): void => {
  if (!box || typeof box !== 'object') return
  const b = box as Record<string, unknown>
  put(vars, `--pb-pt${suffix}`, b.pt)
  put(vars, `--pb-pr${suffix}`, b.pr)
  put(vars, `--pb-pb${suffix}`, b.pb)
  put(vars, `--pb-pl${suffix}`, b.pl)
  put(vars, `--pb-mt${suffix}`, b.mt)
  put(vars, `--pb-mb${suffix}`, b.mb)
}

const mediaUrl = (value: unknown): string | undefined => {
  if (value && typeof value === 'object' && 'url' in value) {
    const u = (value as { url?: unknown }).url
    if (typeof u === 'string' && u) return u
  }
  return undefined
}

const POSITIONS: Record<string, string> = {
  'left-top': 'left top',
  'left-center': 'left center',
  'left-bottom': 'left bottom',
  'center-top': 'center top',
  'center-center': 'center center',
  'center-bottom': 'center bottom',
  'right-top': 'right top',
  'right-center': 'right center',
  'right-bottom': 'right bottom',
}

export const compileStyle = (
  controls: StyleControls | null | undefined,
  base: string,
): CompiledStyle => {
  const classes: string[] = [base]
  const vars: Vars = {}

  if (controls) {
    const c = controls as unknown as Record<string, unknown>

    /* -------- spacing (desktop + responsive overrides) -------- */
    spacing(vars, c.space)
    spacing(vars, c.spaceMd, '-md')
    spacing(vars, c.spaceSm, '-sm')

    /* -------- typography -------- */
    put(vars, '--pb-color', c.color)
    put(vars, '--pb-fs', c.fontSize)
    put(vars, '--pb-lh', c.lineHeight)
    put(vars, '--pb-fw', c.fontWeight)
    put(vars, '--pb-ls', c.letterSpacing)
    if (typeof c.transform === 'string' && c.transform !== 'none') {
      put(vars, '--pb-tt', c.transform)
      classes.push('pb-has-tt')
    }
    if (c.color) classes.push('pb-has-color')

    /* -------- border & shadow -------- */
    if (c.bw) {
      put(vars, '--pb-bw', c.bw)
      put(vars, '--pb-bc', c.bc ?? 'currentColor')
      classes.push('pb-has-border')
    }
    put(vars, '--pb-br', c.br)
    if (c.bs) {
      put(vars, '--pb-bs', c.bs)
      classes.push('pb-has-shadow')
    }

    /* -------- alignment / sizing -------- */
    if (typeof c.align === 'string' && c.align !== 'inherit') {
      classes.push(`pb-align-${c.align}`)
    }
    put(vars, '--pb-maxw', c.maxWidth)
    if (c.maxWidth) classes.push('pb-has-maxw')

    /* -------- background -------- */
    const bg = c.bg as Record<string, unknown> | undefined
    const bgType = typeof bg?.type === 'string' ? bg.type : 'none'

    if (bgType === 'color') {
      put(vars, '--pb-bg', bg?.color)
      classes.push('pb-bg-color')
    }

    if (bgType === 'gradient') {
      const from = sanitizeCssValue(String(bg?.gFrom ?? '')) ?? 'transparent'
      const to = sanitizeCssValue(String(bg?.gTo ?? '')) ?? 'transparent'
      const angle = Number(bg?.gAngle ?? 135)
      vars['--pb-gradient'] = `linear-gradient(${Number.isFinite(angle) ? angle : 135}deg, ${from}, ${to})`
      classes.push('pb-bg-gradient')
    }

    if (bgType === 'image') {
      const url = mediaUrl(bg?.image)
      if (url) {
        vars['--pb-bg-image'] = `url("${encodeURI(url)}")`
        classes.push('pb-bg-image')
        put(vars, '--pb-bg-pos', POSITIONS[String(bg?.pos ?? 'center-center')] ?? 'center center')
        put(vars, '--pb-bg-size', bg?.fit ?? 'cover')
        put(vars, '--pb-bg-repeat', bg?.repeat ?? 'no-repeat')
        const attach = String(bg?.attach ?? 'scroll')
        if (attach === 'parallax') classes.push('pb-bg-parallax')
        else put(vars, '--pb-bg-attach', attach)
      }
    }

    if (bgType === 'video') classes.push('pb-bg-video')

    if (typeof bg?.blend === 'string' && bg.blend !== 'normal') {
      put(vars, '--pb-blend', bg.blend)
      classes.push('pb-has-blend')
    }

    if ((bgType === 'image' || bgType === 'video') && (bg?.overlay || bg?.overlayOpacity != null)) {
      put(vars, '--pb-overlay', bg?.overlay ?? 'rgba(0,0,0,.4)')
      if (bg?.overlayOpacity != null) put(vars, '--pb-overlay-op', String(bg.overlayOpacity))
      classes.push('pb-has-overlay')
    }

    /* -------- visibility -------- */
    const hide = c.hide as Record<string, unknown> | undefined
    if (hide?.desktop) classes.push('pb-hide-desktop')
    if (hide?.tablet) classes.push('pb-hide-tablet')
    if (hide?.mobile) classes.push('pb-hide-mobile')

    /* -------- animation -------- */
    const anim = c.anim as Record<string, unknown> | undefined
    if (typeof anim?.preset === 'string' && anim.preset !== 'none') {
      classes.push('pb-anim', `pb-anim-${anim.preset}`)
      if (anim.onScroll !== false) classes.push('pb-anim-scroll')
      if (anim.duration) vars['--pb-anim-dur'] = `${Number(anim.duration)}ms`
      if (anim.delay) vars['--pb-anim-delay'] = `${Number(anim.delay)}ms`
    }

    const userClass = sanitizeCssClass(controls.cssClass)
    if (userClass) classes.push(userClass)
  }

  return {
    attrs: sanitizeAttrs(controls?.attrs),
    className: classes.join(' '),
    id: sanitizeCssId(controls?.cssId),
    style: vars as CSSProperties,
  }
}

/** Column width → grid span on a 60-column grid (fifths divide evenly). */
export const columnSpanStyle = (width: unknown): CSSProperties => {
  if (typeof width === 'number' && width > 0 && width <= 1) {
    return { ['--pb-span' as string]: String(Math.round(width * 60)) }
  }
  if (typeof width !== 'string' || width === 'auto') return {}
  const span = COLUMN_FRACTIONS[width as Exclude<ColumnWidth, 'auto'>]
  if (span == null) return {}
  return { ['--pb-span' as string]: String(Math.round(span * 5)) }
}

/** Section/row layout classes that aren't per-node style vars. */
export const layoutClasses = (node: Record<string, unknown> | null | undefined): string => {
  if (!node) return ''
  const out: string[] = []
  if (typeof node.gap === 'string') out.push(`pb-gap-${node.gap}`)
  if (typeof node.valign === 'string' && node.valign !== 'inherit') out.push(`pb-va-${node.valign}`)
  if (typeof node.justify === 'string') out.push(`pb-jc-${node.justify}`)
  if (node.wrap === false) out.push('pb-nowrap')
  if (typeof node.height === 'string' && node.height !== 'auto') out.push(`pb-h-${node.height}`)
  return out.join(' ')
}
