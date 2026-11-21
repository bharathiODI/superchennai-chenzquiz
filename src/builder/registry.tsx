import React from 'react'
import { createElementRegistry, type ElementDefinition } from '@opendesigns/payload-builder'

import AboutTriviaComponent from '@/collections/Games/Blocks/AboutTriviaPage/component'
import { CreativeHeroBlock } from '@/collections/Games/Blocks/CreativeHero/Component'
import HowItWorksComponent from '@/collections/Games/Blocks/HowItWorksSection/component'
import InstaReelsSliderComponent from '@/collections/Games/Blocks/InstaReelsSlider/Component'
import LetsTalkChennaiFAQBlockComponent from '@/collections/Games/Blocks/LetsTalkChennaiFAQ/LetsTalkChennaiFAQBlockComponent'
import QuizRewardsComponent from '@/collections/Games/Blocks/QuizRewards/Component'
import TriviaAuthComponent from '@/collections/Games/Blocks/ReadytoPlay/component'

import { chenzElements, renamedFields, sectionFieldNames } from './chenzElements'
import { standardSubset } from './elements'

/* eslint-disable @typescript-eslint/no-explicit-any */

// The same components the Content tab renders, keyed by builder element slug.
const components: Record<string, React.ComponentType<any>> = {
  chenzAboutTrivia: AboutTriviaComponent,
  chenzHowItWorks: HowItWorksComponent,
  chenzReadyToPlay: TriviaAuthComponent,
  chenzQuizRewards: QuizRewardsComponent,
  chenzFaq: LetsTalkChennaiFAQBlockComponent,
  chenzInstaReels: InstaReelsSliderComponent,
  chenzCreativeHero: CreativeHeroBlock,
}

// Gives a section exactly the props the Content tab gives it: its own fields under their
// original names, without the builder's style options (those style the wrapper instead).
const sectionProps = (slug: string, data: Record<string, unknown>) => {
  const back = renamedFields[slug] ?? {}
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) props[back[key] ?? key] = value
  const own = new Set(sectionFieldNames[slug] ?? [])
  return Object.fromEntries(Object.entries(props).filter(([key]) => own.has(key)))
}

const withComponent = (el: ElementDefinition): ElementDefinition => {
  const Section = components[el.slug]
  if (!Section) return el
  // `display: contents` keeps the wrapper out of the layout; it only marks the element as a
  // full quiz section so the column spacing below skips it (see builder-overrides.css).
  const Render: ElementDefinition['Component'] = ({ data }) => (
    <div className="chenz-section">
      <Section {...sectionProps(el.slug, data as Record<string, unknown>)} />
    </div>
  )
  return { ...el, Component: Render }
}

/** Frontend registry: block type -> component, used by <BuilderLayout />. */
export const builderRegistry = createElementRegistry([
  ...standardSubset,
  ...chenzElements.map(withComponent),
])
