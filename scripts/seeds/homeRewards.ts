import type { Field, Payload } from 'payload'
import { QuizRewardsBlock } from '../../src/collections/Games/Blocks/QuizRewards/config'

/** The block's default values, read from its config (groups nested, rows/collapsibles flattened). */
const defaultsOf = (fields: Field[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const f of fields as (Field & { name?: string; fields?: Field[]; defaultValue?: unknown })[]) {
    if (f.type === 'group' && f.name && f.fields) out[f.name] = defaultsOf(f.fields)
    else if (!f.name && f.fields) Object.assign(out, defaultsOf(f.fields))
    else if (f.name && f.defaultValue !== undefined && typeof f.defaultValue !== 'function') out[f.name] = f.defaultValue
  }
  return out
}

type LexicalNode = { type?: string; fields?: { blockType?: string } & Record<string, unknown> }

/**
 * Adds the "Ready to Play Chenz Quiz?" section (Quiz Rewards block: daily challenge + voucher card)
 * to the home page, right after the "How it works" block. Does nothing if the home page already has
 * one. Text, the voucher image and the card colours are then edited in the CMS on the home page.
 */
export async function seedHomeRewards(payload: Payload): Promise<void> {
  console.log('\nHome page rewards section')
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const home = docs[0] as
    | { id: number | string; _status?: string; content?: { root?: { children?: LexicalNode[] } } }
    | undefined
  const children = home?.content?.root?.children
  if (!home || !Array.isArray(children)) {
    console.log('  no home page with block content found - add the "Quiz Rewards" block in the CMS')
    return
  }
  if (children.some((n) => n.type === 'block' && n.fields?.blockType === 'QuizRewardsBlock')) {
    console.log('  already on the home page')
    return
  }

  // A save builds on the page's latest version. If an editor left unpublished changes, saving here
  // would publish their draft too, so leave the page alone until it is published or reverted.
  const latest = await payload.findVersions({
    collection: 'pages',
    where: { parent: { equals: home.id } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const newest = latest.docs[0] as { version?: { _status?: string } } | undefined
  if (newest?.version?._status === 'draft') {
    console.log(
      '  skipped: the home page has unpublished changes ("Changed" in the CMS). Publish them or use\n' +
        '  "Revert to published", then run the seed again - or add the "Quiz Rewards" block by hand.',
    )
    return
  }

  const block = {
    type: 'block',
    version: 2,
    format: '',
    fields: {
      id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockName: '',
      blockType: 'QuizRewardsBlock',
      ...defaultsOf(QuizRewardsBlock.fields),
    },
  }
  const after = children.findIndex((n) => n.type === 'block' && n.fields?.blockType === 'HowItWorksBlock')
  const next = [...children]
  next.splice(after >= 0 ? after + 1 : next.length, 0, block)

  await payload.update({
    collection: 'pages',
    id: home.id,
    // Pages keep drafts: without _status the save would turn the live home page into a draft
    data: {
      _status: home._status ?? 'published',
      content: { ...home.content, root: { ...home.content!.root, children: next } },
    } as never,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log('  added after "How it works" - edit its text, voucher image and colours in the CMS')
}
