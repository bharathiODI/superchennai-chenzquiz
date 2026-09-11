

import React, { Fragment } from 'react'
import type { Page } from 'src/payload-types'

// Blocks
import { FormBlock } from 'src/blocks/Form/Component'
import { MediaBlock } from 'src/blocks/MediaBlock/Component'
import EventRegistrationBlockComponent from './EventRegistrationForm/coponents'
import FeaturedEventBlockComponent from './EventsDetails/Component'
import { MediaCarouselBlock } from './MediaCarousel/Component'
import HeroSliderBlock from './PageBanners/Home/Component'
import { CTABlockComponent } from './cta/Component'
import { GalleryBlockComponent } from './gallery/Component'
import { StatsBlockComponent } from './stats/Component'
import { VideoGalleryBlockComponent } from './videoGallery/Component'
import { WeekTimelineComponent } from './weekTimeline/Component'

/**
 * Map Payload blockType → React Component
 */
const blockComponents: Record<string, React.FC<any>> = {
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  weekTimeline: WeekTimelineComponent,

  statsBlock: StatsBlockComponent,
  galleryBlock: GalleryBlockComponent,
  ctaBlock: CTABlockComponent,
  heroSliderBlock: HeroSliderBlock,
  eventRegistrationFormBlock: EventRegistrationBlockComponent,
  mediaCarousel: MediaCarouselBlock,
  eventDetailsBlock: FeaturedEventBlockComponent,
  videoGalleryBlock: VideoGalleryBlockComponent,
}

/**
 * Lexical RichText Block Renderer (Payload v3)
 */
export const RenderBlocks: React.FC<{
  blocks?: Page['content']
}> = ({ blocks }) => {
  if (!blocks) return null

  const children = (blocks as any)?.root?.children

  if (!Array.isArray(children)) return null

  return (
    <Fragment>
      {children.map((node: any, index: number) => {
        // Only block nodes
        if (node?.type !== 'block') return null

        const blockType = node?.fields?.blockType
        if (!blockType) return null

        const Block = blockComponents[blockType]
        if (!Block) return null

        return (
          <div key={index}>
            <Block {...node.fields} disableInnerContainer={true} />
          </div>
        )
      })}
    </Fragment>
  )
}
