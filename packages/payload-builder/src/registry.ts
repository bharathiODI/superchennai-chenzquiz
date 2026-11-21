import type { ElementDefinition, ElementMeta } from './types'

/**
 * The element registry. Created once per Payload config by `builderPlugin`,
 * and also importable on the frontend to map blockType → Component.
 *
 * Frontend usage:
 *   const registry = createElementRegistry(elements)
 *   <BuilderRenderer layout={page.layout} registry={registry} locale={locale} />
 */
export class ElementRegistry {
  private byArg = new Map<string, ElementDefinition>()

  constructor(elements: ElementDefinition[]) {
    for (const el of elements) this.register(el)
  }

  register(el: ElementDefinition): void {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(el.slug)) {
      throw new Error(
        `[payload-builder] element slug "${el.slug}" must be camelCase alphanumeric`,
      )
    }
    if (this.byArg.has(el.slug)) {
      throw new Error(`[payload-builder] duplicate element slug "${el.slug}"`)
    }
    if (el.slug === 'builderSection' || el.slug === 'builderRow') {
      throw new Error(`[payload-builder] "${el.slug}" is reserved`)
    }
    this.byArg.set(el.slug, el)
  }

  get(slug: string): ElementDefinition | undefined {
    return this.byArg.get(slug)
  }

  all(): ElementDefinition[] {
    return [...this.byArg.values()]
  }

  /** Serializable metadata for the admin canvas (no components/functions). */
  meta(): ElementMeta[] {
    return this.all().map(({ slug, label, icon, category }) => ({
      slug,
      label,
      icon,
      category: category ?? 'basic',
    }))
  }
}

export const createElementRegistry = (elements: ElementDefinition[]): ElementRegistry =>
  new ElementRegistry(elements)
