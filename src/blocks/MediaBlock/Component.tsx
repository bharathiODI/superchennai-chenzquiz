import type { StaticImageData } from 'next/image'
import React from 'react'

import { cn } from 'src/utilities/ui'
import RichText from 'src/components/RichText'

import type { MediaBlock as MediaBlockProps } from 'src/payload-types'
import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  thumbnail?: any
  link?: {
    url?: string
    newTab?: boolean
  }
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    thumbnail,
    link,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  // 👉 Thumbnail fallback logic
  const imageResource = thumbnail || media

  const imageElement = (imageResource || staticImage) && (
    <Media
      imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
      resource={imageResource}
      src={staticImage}
    />
  )

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {/* 👉 LINK WRAP */}
      {link?.url ? (
        <a
          href={link.url}
          target={link.newTab ? '_blank' : '_self'}
          rel={link.newTab ? 'noopener noreferrer' : undefined}
          className="inline-block"
        >
          {imageElement}
        </a>
      ) : (
        imageElement
      )}

      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}

// import type { StaticImageData } from 'next/image'

// import { cn } from 'src/utilities/ui'
// import React from 'react'
// import RichText from 'src/components/RichText'

// import type { MediaBlock as MediaBlockProps } from 'src/payload-types'

// import { Media } from '../../components/Media'

// type Props = MediaBlockProps & {
//   breakout?: boolean
//   captionClassName?: string
//   className?: string
//   enableGutter?: boolean
//   imgClassName?: string
//   staticImage?: StaticImageData
//   disableInnerContainer?: boolean
// }

// export const MediaBlock: React.FC<Props> = (props) => {
//   const {
//     captionClassName,
//     className,
//     enableGutter = true,
//     imgClassName,
//     media,
//     staticImage,
//     disableInnerContainer,
//   } = props

//   let caption
//   if (media && typeof media === 'object') caption = media.caption

//   return (
//     <div
//       className={cn(
//         '',
//         {
//           container: enableGutter,
//         },
//         className,
//       )}
//     >
//       {(media || staticImage) && (
//         <Media
//           imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
//           resource={media}
//           src={staticImage}
//         />
//       )}
//       {caption && (
//         <div
//           className={cn(
//             'mt-6',
//             {
//               container: !disableInnerContainer,
//             },
//             captionClassName,
//           )}
//         >
//           <RichText data={caption} enableGutter={false} />
//         </div>
//       )}
//     </div>
//   )
// }
