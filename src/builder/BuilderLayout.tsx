import React from 'react'
import { BuilderAnimations, BuilderRenderer } from '@opendesigns/payload-builder/rsc'
import '@opendesigns/payload-builder/rsc/builder.css'
import './builder-overrides.css'

import { builderRegistry } from './registry'

/**
 * Renders a page's optional "Page Builder" sections. Pages without any
 * sections render nothing here, so existing pages are untouched.
 */
export default function BuilderLayout({ layout }: { layout: unknown }) {
  if (!Array.isArray(layout) || layout.length === 0) return null

  return (
    <div className="chenz-builder">
      <BuilderRenderer layout={layout} registry={builderRegistry} locale="en" />
      <BuilderAnimations />
    </div>
  )
}
