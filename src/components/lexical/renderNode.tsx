import { renderText } from './renderText'

import EventRegistrationBlockComponent from '@/blocks/EventRegistrationForm/coponents'
import FeaturedEventBlockComponent from '@/blocks/EventsDetails/Component'
import { MediaCarouselBlock } from '@/blocks/MediaCarousel/Component'
import { VideoGalleryBlockComponent } from '@/blocks/videoGallery/Component'
import CodeBlock from './blocks/CodeBlock'
import ImageBlock from './blocks/ImageBlock'
import MediaBlock from './blocks/MediaBlock'
import VideoBlock from './blocks/VideoBlock'
import TriviaAuthComponent from '@/collections/Games/Blocks/ReadytoPlay/component'
import AboutTriviaComponent from '@/collections/Games/Blocks/AboutTriviaPage/component'
import HowItWorksComponent from '@/collections/Games/Blocks/HowItWorksSection/component'
import React from 'react'
import LetsTalkChennaiFAQBlockComponent from '@/collections/Games/Blocks/LetsTalkChennaiFAQ/LetsTalkChennaiFAQBlockComponent'
// import LetsTalkChennaiFAQBlockComponent from '@/collections/Games/Blocks/FAQ/FAQBlockComponent'

export function renderNode(node: any, idx: number, eventData?: any): React.ReactNode {
  /* ------------------------------------------------
     DEBUG LOGS
  ------------------------------------------------ */
  console.log('LEXICAL NODE =>', node)

  switch (node.type) {
    /* ------------------------------------------------
     PARAGRAPH
    ------------------------------------------------ */
    case 'paragraph':
      return (
        <p key={idx} className="mb-0 text-lg leading-8 text-gray-700 paragaphhlexical">
          {renderText(node.children)}
        </p>
      )

    // /* ------------------------------------------------
    //  HEADING
    // ------------------------------------------------ */
    // case 'heading': {
    //   const Tag = (node.tag || 'h2') as React.ElementType

    //   return (
    //     <Tag
    //       key={idx}
    //       className={`paragaphhlexical text-center blog-${node.tag || 'h2'} text-[#005b70] text-3xl font-bold tracking-wide mt-0 mb-0`}
    //     >
    //       {renderText(node.children)}
    //     </Tag>
    //   )
    // }

    /* ------------------------------------------------
     HEADING
    ------------------------------------------------ */
    case 'heading': {
      const tag = node.tag || 'h2'

      return React.createElement(
        tag,
        {
          key: idx,
          className: `paragaphhlexical text-center blog-${tag} text-[#005b70] text-3xl font-bold tracking-wide mt-0 mb-0`,
        },
        renderText(node.children),
      )
    }

    /* ------------------------------------------------
     LIST
    ------------------------------------------------ */
    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'

      return (
        <ListTag
          key={idx}
          className={`pl-6 mb-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}
        >
          {node.children?.map((child: any, i: number) => (
            <li key={i}>{renderText(child.children)}</li>
          ))}
        </ListTag>
      )
    }

    /* ------------------------------------------------
     IMAGE / UPLOAD
    ------------------------------------------------ */
    case 'upload':
      return <ImageBlock key={idx} node={node} />

    /* ------------------------------------------------
     BLOCKS
    ------------------------------------------------ */
    case 'block': {
      const blockType = node.fields?.blockType || node.fields?.blockName || node.blockType

      console.log('DETECTED BLOCK TYPE =>', blockType)
      console.log('BLOCK NODE FIELDS =>', node.fields)

      /* ---------------- CODE BLOCK ---------------- */
      if (blockType === 'code' || blockType === 'codeBlock') {
        return <CodeBlock key={idx} node={node} />
      }

      /* ---------------- VIDEO BLOCK ---------------- */
      if (blockType === 'video' || blockType === 'videoBlock') {
        return <VideoBlock key={idx} node={node} />
      }

      /* ---------------- MEDIA BLOCK ---------------- */
      if (blockType === 'media' || blockType === 'mediaBlock') {
        return <MediaBlock key={idx} node={node} />
      }

      /* =========================================================
         EVENT REGISTRATION BLOCK (Multiple Name Fallbacks)
      ========================================================= */
      if (
        blockType === 'eventRegistrationFormBlock' ||
        blockType === 'eventRegistrationBlock' ||
        blockType === 'eventRegistrationForm'
      ) {
        console.log('RENDERING EventRegistrationBlockComponent WITH:', {
          fields: node.fields,
          eventData,
        })

        return (
          <EventRegistrationBlockComponent key={idx} block={node.fields} eventData={eventData} />
        )
      }

      if (blockType === 'mediaCarousel') {
        return <MediaCarouselBlock key={idx} {...node.fields} />
      }

      if (blockType === 'eventDetailsBlock') {
        return <FeaturedEventBlockComponent key={idx} {...node.fields} />
      }

      if (blockType === 'videoGalleryBlock') {
        return <VideoGalleryBlockComponent key={idx} {...node.fields} />
      }

      if (blockType === 'TriviaAuthBlock') {
        return <TriviaAuthComponent key={idx} {...node.fields} />
      }

      if (blockType === 'AboutTriviaBlock') {
        return <AboutTriviaComponent key={idx} {...node.fields} />
      }

      if (blockType === 'HowItWorksBlock') {
        return <HowItWorksComponent key={idx} {...node.fields} />
      }

      if (blockType === 'letsTalkChennaiFaq') {
        return <LetsTalkChennaiFAQBlockComponent key={idx} {...node.fields} />
      }


      console.warn('UNHANDLED BLOCK TYPE =>', blockType)
      return null
    }

    /* ------------------------------------------------
     DEFAULT
    ------------------------------------------------ */
    default:
      return null
  }
}
