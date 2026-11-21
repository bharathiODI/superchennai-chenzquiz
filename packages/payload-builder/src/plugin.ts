// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'
import { createElementRegistry } from './registry'
import { buildLayoutField } from './fields/blocks'
import { buildLayoutsCollection, buildSectionsCollection } from './layouts/collections'
import {
  buildMediaCollection,
  buildPagesCollection,
  buildPostsCollection,
  buildTaxonomyCollection,
} from './collections/content'
import { buildMenusGlobal } from './globals/menus'
import { buildSiteSettingsGlobal } from './globals/siteSettings'
import { buildUiStringsGlobal } from './globals/uiStrings'
import { buildUsersCollection, isAdmin } from './access/roles'
import { setLocalizationEnabled } from './i18n/localized'
import type { BuilderCollectionTarget, BuilderPluginOptions } from './types'

/**
 * builderPlugin — the whole starter kit in one call.
 *
 * Minimal (add the builder to an existing project):
 *
 *   builderPlugin({ collections: ['pages'], elements: standardElements })
 *
 * Full boilerplate (a new project):
 *
 *   builderPlugin({
 *     elements: standardElements,
 *     scaffold: true,          // pages, posts, categories, tags, media, users
 *     layouts: true,           // global layout + conditional overrides
 *     settings: true,          // site settings, SEO, UI strings, menus
 *     i18n: { locales: ['en', 'ar'], defaultLocale: 'en', rtl: ['ar'] },
 *   })
 *
 * Everything is opt-in, so adopting one piece never forces the rest.
 */
export const builderPlugin = (options: BuilderPluginOptions): Plugin => {
  const {
    enableCanvas = true,
    enabled = true,
    i18n,
    layouts = false,
    scaffold = false,
    settings = false,
  } = options

  // Must run before any field factory, since `L()` reads this.
  const localized = Boolean(i18n && i18n.locales && i18n.locales.length > 1)
  setLocalizationEnabled(localized)

  const registry = createElementRegistry(options.elements)

  const targets: Required<BuilderCollectionTarget>[] = (options.collections ?? []).map((c) =>
    typeof c === 'string'
      ? { slug: c, fieldName: 'layout', localized: true }
      : { slug: c.slug, fieldName: c.fieldName ?? 'layout', localized: c.localized ?? true },
  )

  const scaffoldOpts = typeof scaffold === 'object' ? scaffold : {}
  const settingsOpts = typeof settings === 'object' ? settings : {}
  const mediaSlug = scaffoldOpts.mediaSlug ?? 'media'
  const usersSlug = scaffoldOpts.usersSlug ?? 'users'
  const pagesSlug = scaffoldOpts.pagesSlug ?? 'pages'

  return (incomingConfig: Config): Config => {
    if (!enabled) return incomingConfig

    let collections: CollectionConfig[] = [...(incomingConfig.collections ?? [])]
    const globals: GlobalConfig[] = [...(incomingConfig.globals ?? [])]

    /* ---------- scaffold: the standard content model ---------- */

    if (scaffold) {
      const existing = new Set(collections.map((c) => c.slug))
      const add = (c: CollectionConfig): void => {
        if (!existing.has(c.slug)) collections.push(c)
      }

      add(buildUsersCollection({ locales: i18n?.locales, slug: usersSlug }))
      add(buildMediaCollection({ slug: mediaSlug, staticDir: scaffoldOpts.mediaDir }))
      add(
        buildPagesCollection({
          elements: registry.all(),
          enableCanvas,
          mediaSlug,
          slug: pagesSlug,
          usersSlug,
        }),
      )

      if (scaffoldOpts.blog !== false) {
        add(
          buildTaxonomyCollection({
            labelPlural: 'Categories',
            labelSingular: 'Category',
            mediaSlug,
            slug: 'categories',
          }),
        )
        add(
          buildTaxonomyCollection({
            hierarchical: false,
            labelPlural: 'Tags',
            labelSingular: 'Tag',
            mediaSlug,
            slug: 'tags',
          }),
        )
        add(
          buildPostsCollection({
            elements: registry.all(),
            enableCanvas,
            mediaSlug,
            slug: 'posts',
            usersSlug,
          }),
        )
      }
    }

    /* ---------- inject the layout field into named collections ---------- */

    collections = collections.map((collection) => {
      const target = targets.find((t) => t.slug === collection.slug)
      if (!target) return collection

      const alreadyHasField = collection.fields.some(
        (f) => 'name' in f && f.name === target.fieldName,
      )
      // Scaffolded collections already carry it — silently skip rather than throw.
      if (alreadyHasField) return collection

      return {
        ...collection,
        fields: [
          ...collection.fields,
          buildLayoutField(registry.all(), target.fieldName, enableCanvas),
        ],
      }
    })

    /* ---------- layouts ---------- */

    if (layouts) {
      const layoutOptions = {
        elements: registry.all(),
        enableCanvas,
        layoutsSlug: typeof layouts === 'object' ? layouts.layoutsSlug : undefined,
        sectionsSlug: typeof layouts === 'object' ? layouts.sectionsSlug : undefined,
        targetCollections: targets.length ? targets.map((t) => t.slug) : [pagesSlug],
      }
      collections.push(buildSectionsCollection(layoutOptions))
      collections.push(buildLayoutsCollection(layoutOptions))
    }

    /* ---------- settings globals ---------- */

    if (settings) {
      const existingGlobals = new Set(globals.map((g) => g.slug))
      const addGlobal = (g: GlobalConfig): void => {
        if (!existingGlobals.has(g.slug)) globals.push(g)
      }

      addGlobal(buildSiteSettingsGlobal({ canUpdate: isAdmin, mediaSlug }))
      if (settingsOpts.uiStrings !== false) {
        addGlobal(
          buildUiStringsGlobal({
            canUpdate: isAdmin as never,
            extraGroups: settingsOpts.extraStringGroups,
          }),
        )
      }
      if (settingsOpts.menus !== false) {
        addGlobal(
          buildMenusGlobal({
            canUpdate: isAdmin,
            linkableCollections: settingsOpts.linkableCollections ?? [
              pagesSlug,
              ...(scaffold && scaffoldOpts.blog !== false ? ['posts'] : []),
            ],
          }),
        )
      }
    }

    /* ---------- localization ---------- */

    const localization =
      localized && i18n
        ? {
            defaultLocale: i18n.defaultLocale ?? i18n.locales[0],
            fallback: i18n.fallback ?? true,
            locales: i18n.locales.map((code) => ({
              code,
              label: i18n.labels?.[code] ?? code,
              rtl: i18n.rtl?.includes(code) ?? false,
            })),
          }
        : incomingConfig.localization

    /* ---------- admin ---------- */

    const admin = {
      ...incomingConfig.admin,
      custom: {
        ...incomingConfig.admin?.custom,
        payloadBuilder: {
          collections: targets,
          elements: registry.meta(),
          localized,
        },
      },
    }

    return { ...incomingConfig, admin, collections, globals, localization }
  }
}
