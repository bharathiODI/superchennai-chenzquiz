export { builderPlugin } from './plugin'
export { createElementRegistry, ElementRegistry } from './registry'

/* Fields */
export { buildLayoutField, buildSectionBlock, buildRowBlock, buildElementBlock } from './fields/blocks'
export {
  backgroundFields,
  columnGeneralFields,
  designFields,
  elementGeneralFields,
  extrasFields,
  nodeTabs,
  rowGeneralFields,
  sectionGeneralFields,
  styleTab,
  WIDTH_OPTIONS,
} from './fields/common'

/* Style engine */
export { compileStyle, columnSpanStyle, layoutClasses, COLUMN_FRACTIONS } from './style/engine'
export { sanitizeAttrs, sanitizeCssClass, sanitizeCssId, sanitizeCssValue } from './style/attrs'

/* Layouts */
export {
  buildLayoutsCollection,
  buildSectionsCollection,
  SECTION_SLOTS,
  type SectionSlot,
} from './layouts/collections'
export {
  resolveBuilderLayout,
  scoreLayout,
  sectionLayout,
  type ResolvedLayout,
  type ResolveArgs,
} from './layouts/resolve'

/* Collections */
export {
  buildMediaCollection,
  buildPagesCollection,
  buildPostsCollection,
  buildTaxonomyCollection,
  type ContentCollectionOptions,
  type TaxonomyOptions,
} from './collections/content'

/* Globals */
export { buildSiteSettingsGlobal, seoFields, type SiteSettingsOptions } from './globals/siteSettings'
export {
  buildUiStringsGlobal,
  defaultStringGroups,
  t,
  type UiStrings,
  type UiStringsOptions,
} from './globals/uiStrings'
export { buildMenusGlobal, menuHref, type MenuItem, type MenusOptions } from './globals/menus'

/* Access control */
export {
  buildUsersCollection,
  canCreate,
  canDeleteContent,
  canPublish,
  canUpdateContent,
  createdByField,
  getRoles,
  hasRole,
  isAdmin,
  isEditor,
  isLoggedIn,
  isSelfOrSuperAdmin,
  isSuperAdmin,
  ROLE_LABELS,
  ROLES,
  type Role,
  type UsersCollectionOptions,
} from './access/roles'

/* i18n */
export { isLocalizationEnabled, L, LAll, setLocalizationEnabled } from './i18n/localized'

/* Email — Microsoft Graph, no SMTP */
export { graphEmailAdapter, type GraphEmailAdapterArgs } from './email/graphAdapter'

/* Forms — CMS-driven form system (CF7-style builder + submit pipeline) */
export * from './forms'

/* Deploy — startup migrations behind a Postgres advisory lock */
export { runStartupMigrations, type StartupMigrationsArgs } from './deploy/startupMigrations'

/* Content sync — static export ⇄ CMS */
export { htmlToLexical, isStaticRichText } from './sync/htmlToLexical'
export {
  importContent,
  type ImportContentOptions,
  type ImportReport,
} from './sync/importContent'
export { reindexCollections, type ReindexFailure, type ReindexResult } from './sync/reindex'

/* API-route key gate */
export { isRequestAuthorized } from './utils/apiKey'

/* Seed helpers — Lexical builders + locale merge */
export { mergeLocaleStrings, rt, rtHeadingList } from './seed/lexical'

export type * from './types'
