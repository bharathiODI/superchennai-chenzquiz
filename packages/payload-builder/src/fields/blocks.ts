import type { Block, Field } from 'payload'
import type { ElementDefinition } from '../types'
import {
  columnGeneralFields,
  elementGeneralFields,
  nodeTabs,
  rowGeneralFields,
  sectionGeneralFields,
} from './common'

/**
 * Generates the Section → Row → Column → Element block schema from the
 * element registry. Data stays ordinary Payload blocks, so localization,
 * versions, drafts, access control and migrations all behave natively.
 *
 * Every node gets the same tabbed option set (General / Design /
 * Background / Extras); elements get their own fields as a Content tab
 * in front of those.
 */

export const buildElementBlock = (el: ElementDefinition): Block => ({
  slug: el.slug,
  interfaceName: `PB${el.slug.charAt(0).toUpperCase()}${el.slug.slice(1)}Block`,
  labels: { plural: el.label, singular: el.label },
  ...el.blockOverrides,
  fields: [
    nodeTabs({
      contentFields: el.fields,
      generalFields: [...elementGeneralFields, ...(el.generalFields ?? [])],
    }),
  ],
})

export const buildRowBlock = (elements: ElementDefinition[]): Block => {
  const elementBlocks = elements.map(buildElementBlock)

  const columnsField: Field = {
    name: 'columns',
    admin: { initCollapsed: false },
    fields: [
      {
        name: 'elements',
        blocks: elementBlocks,
        type: 'blocks',
      },
      nodeTabs({ generalFields: columnGeneralFields }),
    ],
    labels: { plural: 'Columns', singular: 'Column' },
    type: 'array',
  }

  return {
    slug: 'builderRow',
    interfaceName: 'PBRowBlock',
    labels: { plural: 'Rows', singular: 'Row' },
    fields: [columnsField, nodeTabs({ generalFields: rowGeneralFields })],
  }
}

export const buildSectionBlock = (elements: ElementDefinition[]): Block => ({
  slug: 'builderSection',
  interfaceName: 'PBSectionBlock',
  labels: { plural: 'Sections', singular: 'Section' },
  fields: [
    {
      name: 'rows',
      blocks: [buildRowBlock(elements)],
      type: 'blocks',
    },
    nodeTabs({ generalFields: sectionGeneralFields }),
  ],
})

export const buildLayoutField = (
  elements: ElementDefinition[],
  fieldName = 'layout',
  enableCanvas = true,
): Field => ({
  name: fieldName,
  admin: enableCanvas
    ? { components: { Field: '@opendesigns/payload-builder/client#BuilderField' } }
    : {},
  blocks: [buildSectionBlock(elements)],
  type: 'blocks',
})
