import type { Block, Field } from 'payload'
import {
  backgroundFields,
  designFields,
  elementGeneralFields,
  extrasFields,
  type ElementDefinition,
} from '@opendesigns/payload-builder'

import { AboutTriviaBlock } from '@/collections/Games/Blocks/AboutTriviaPage/config'
import { CreativeHeroBlock } from '@/collections/Games/Blocks/CreativeHero/config'
import { HowItWorksBlock } from '@/collections/Games/Blocks/HowItWorksSection/config'
import { InstaReelsBlock } from '@/collections/Games/Blocks/InstaReelsSlider/config'
import { LetsTalkChennaiFAQBlock } from '@/collections/Games/Blocks/LetsTalkChennaiFAQ/config'
import { QuizRewardsBlock } from '@/collections/Games/Blocks/QuizRewards/config'
import { TriviaAuthBlock } from '@/collections/Games/Blocks/ReadytoPlay/config'

/**
 * The quiz site's own sections, offered as page-builder elements.
 *
 * Each one reuses the fields of the block editors already know from the Content tab.
 * This file is the schema side only: payload.config and `payload run` scripts load it, so it
 * must not import React components or CSS. The frontend pairs these slugs with the real
 * components in ./registry.tsx.
 */

/* ---------- database column clash check ----------
   Every builder element also carries the kit's style options (spacing, background, ...), stored
   as columns on the same table. A section field that maps to the same column name (FAQ's
   `bgImage` and the kit's `bg.image` are both `bg_image_id`) breaks saving, so such fields are
   renamed for the builder and mapped back before rendering. */

const snake = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

const columns = (fields: Field[], prefix = ''): string[] =>
  fields.flatMap((f): string[] => {
    const named = 'name' in f && f.name ? f.name : null
    if (f.type === 'array' || f.type === 'blocks' || f.type === 'join' || f.type === 'ui') return []
    if (f.type === 'group')
      return columns(f.fields, named ? `${prefix}${snake(named)}_` : prefix)
    if (f.type === 'row' || f.type === 'collapsible') return columns(f.fields, prefix)
    if (f.type === 'tabs')
      return f.tabs.flatMap((t) =>
        columns(t.fields, 'name' in t && t.name ? `${prefix}${snake(t.name)}_` : prefix),
      )
    if (!named) return []
    const hasMany = 'hasMany' in f && f.hasMany
    if ((f.type === 'upload' || f.type === 'relationship') && !hasMany) return [`${prefix}${snake(named)}_id`]
    return [`${prefix}${snake(named)}`]
  })

const kitColumns = new Set(
  columns([...elementGeneralFields, ...designFields, ...backgroundFields, ...extrasFields]),
)

/** Builder-only field names, keyed by element slug: { builderName: originalName }. */
export const renamedFields: Record<string, Record<string, string>> = {}

/** The original top-level field names of each section, keyed by element slug. */
export const sectionFieldNames: Record<string, string[]> = {}

const topLevelNames = (fields: Field[]): string[] =>
  fields.flatMap((f): string[] => {
    if ('name' in f && f.name) return [f.name]
    if (f.type === 'row' || f.type === 'collapsible') return topLevelNames(f.fields)
    if (f.type === 'tabs') return f.tabs.flatMap((t) => ('name' in t && t.name ? [t.name] : topLevelNames(t.fields)))
    return []
  })

const schemaOnly: ElementDefinition['Component'] = () => null

const fromBlock = (
  slug: string,
  label: string,
  block: Block,
  icon: string,
  rename: Record<string, string> = {},
): ElementDefinition => {
  const fields = block.fields.map((f) =>
    'name' in f && f.name && rename[f.name] ? ({ ...f, name: rename[f.name] } as Field) : f,
  )
  const clash = columns(fields).filter((c) => kitColumns.has(c))
  if (clash.length) {
    throw new Error(
      `[builder] "${label}" has fields that clash with the builder's style columns (${clash.join(', ')}). Rename them in src/builder/chenzElements.ts.`,
    )
  }
  renamedFields[slug] = Object.fromEntries(Object.entries(rename).map(([from, to]) => [to, from]))
  sectionFieldNames[slug] = topLevelNames(block.fields)

  return {
    slug,
    label,
    icon,
    category: 'Chennai Quiz',
    fields,
    Component: schemaOnly,
    excerpt: (data) => {
      const title = data.mainTitle ?? data.heading ?? data.title ?? data.mainHeading
      return typeof title === 'string' ? title : ''
    },
  }
}

export const chenzElements: ElementDefinition[] = [
  fromBlock('chenzAboutTrivia', 'About Trivia', AboutTriviaBlock, 'info'),
  fromBlock('chenzHowItWorks', 'How It Works', HowItWorksBlock, 'list-ordered'),
  fromBlock('chenzReadyToPlay', 'Ready to Play', TriviaAuthBlock, 'log-in'),
  fromBlock('chenzQuizRewards', 'Quiz Rewards', QuizRewardsBlock, 'gift'),
  fromBlock('chenzFaq', 'FAQ', LetsTalkChennaiFAQBlock, 'help-circle', { bgImage: 'sectionBgImage' }),
  fromBlock('chenzInstaReels', 'Instagram Reels', InstaReelsBlock, 'instagram'),
  fromBlock('chenzCreativeHero', 'Creative Hero', CreativeHeroBlock, 'sparkles'),
]
