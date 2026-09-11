'use client'

import React from 'react'
import Image from 'next/image'

interface MediaBlockProps {
  node: any
}

const MediaBlock: React.FC<MediaBlockProps> = ({ node }) => {
  const media = node?.fields?.media
  const link = node?.fields?.link
  const thumbnail = node?.fields?.thumbnail

  if (!media?.url) return null

  const MediaImage = (
    <Image
      src={media.url}
      alt={media.alt || 'Media'}
      width={1200}
      height={700}
      className="w-full h-full object-cover rounded-3xl"
    />
  )

  return (
    <figure className="my-12 relative">
      <div className="relative overflow-hidden rounded-3xl shadow-xl">

        {/* LINK WRAP */}
        {link?.url ? (
          <a
            href={link.url}
            target={link.newTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            {MediaImage}
          </a>
        ) : (
          MediaImage
        )}

        {/* THUMBNAIL OVERLAY */}
        {thumbnail?.url && (
          <div className="absolute inset-0 flex items-center justify-center">
            {link?.url ? (
              <a
                href={link.url}
                target={link.newTab ? '_blank' : '_self'}
                rel="noopener noreferrer"
              >
                <Image
                  src={thumbnail.url}
                  alt="thumbnail"
                  width={90}
                  height={90}
                  className="rounded-full border-4 border-white shadow-2xl object-cover"
                />
              </a>
            ) : (
              <Image
                src={thumbnail.url}
                alt="thumbnail"
                width={90}
                height={90}
                className="rounded-full border-4 border-white shadow-2xl object-cover"
              />
            )}
          </div>
        )}
      </div>

      {/* CAPTION */}
      {media.caption && (
        <figcaption className="mt-4 text-center text-sm italic text-gray-500">
          {media.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default MediaBlock