// import React, { Fragment } from 'react'

// import type { Props } from './types'

// import { ImageMedia } from './ImageMedia'
// import { VideoMedia } from './VideoMedia'

// export const Media: React.FC<Props> = (props) => {
//   const { className, htmlElement = 'div', resource } = props

//   const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
//   const Tag = htmlElement || Fragment

//   return (
//     <Tag
//       {...(htmlElement !== null
//         ? {
//             className,
//           }
//         : {})}
//     >
//       {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
//     </Tag>
//   )
// }
import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  // 🛠️ FIXED: JSX tag syntax-ku pathila React.createElement use panrom
  return React.createElement(
    Tag,
    htmlElement !== null ? { className } : undefined,
    isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />
  )
}
