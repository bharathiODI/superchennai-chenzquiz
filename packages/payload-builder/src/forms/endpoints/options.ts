import type { Endpoint, PayloadRequest } from 'payload'

import type { FormFieldSpec } from '../types'

/**
 * GET /api/forms/options?formId=…&field=… — options for a select/radio
 * field whose `optionsSource` is a collection. Serves only `{ label,
 * value }` pairs, cached for 60s: the underlying collection is never
 * exposed to the public API.
 */

export interface OptionsEndpointOptions {
  formsSlug?: string
}

const cache = new Map<string, { at: number; options: { label: string; value: string }[] }>()
const TTL = 60_000

export const buildOptionsEndpoint = ({ formsSlug = 'forms' }: OptionsEndpointOptions = {}): Endpoint => ({
  handler: async (req: PayloadRequest) => {
    const search = new URL(req.url ?? '', 'http://internal').searchParams
    const formId = search.get('formId')
    const fieldName = search.get('field')
    if (!formId || !fieldName) {
      return Response.json({ message: 'formId and field are required.', ok: false }, { status: 400 })
    }

    const key = `${formId}:${fieldName}`
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < TTL) return Response.json({ ok: true, options: hit.options })

    const form = (await req.payload
      .findByID({ id: formId as never, collection: formsSlug as never, overrideAccess: true })
      .catch(() => null)) as { fields?: FormFieldSpec[] | null } | null
    const field = form?.fields?.find(
      (f) => f.name === fieldName && f.optionsSource === 'collection' && f.optionsCollection,
    )
    if (!field?.optionsCollection) {
      return Response.json({ message: 'No such dynamic field.', ok: false }, { status: 404 })
    }

    const labelField = field.optionsLabelField || 'title'
    const sort =
      field.optionsSort === 'newest'
        ? '-createdAt'
        : field.optionsSort === 'oldest'
          ? 'createdAt'
          : field.optionsSort === 'name'
            ? labelField
            : undefined

    const result = await req.payload.find({
      collection: field.optionsCollection as never,
      depth: 0,
      limit: 200,
      ...(sort ? { sort } : {}),
    })

    const options = result.docs
      .map((doc) => {
        const d = doc as Record<string, unknown>
        const label = String(d[labelField] ?? d.title ?? d.name ?? d.id)
        return { label, value: label }
      })
      .filter((o) => o.label)

    cache.set(key, { at: Date.now(), options })
    if (cache.size > 500) cache.clear()
    return Response.json({ ok: true, options })
  },
  method: 'get',
  path: '/form-options', // outside the forms collection's REST prefix
})
