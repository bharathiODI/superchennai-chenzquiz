import React from 'react'
import type { ElementComponentProps, ElementDefinition } from '../types'

interface MediaDoc {
  url?: string
  alt?: string
  width?: number
  height?: number
}

const asMedia = (value: unknown): MediaDoc | null =>
  value && typeof value === 'object' && 'url' in value ? (value as MediaDoc) : null

/* ---------------- Image ---------------- */

const ImageEl: React.FC<
  ElementComponentProps<{ image?: unknown; caption?: string; ratio?: string; url?: string; rounded?: boolean }>
> = ({ data }) => {
  const media = asMedia(data.image)
  if (!media?.url) return null
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={media.alt ?? ''}
      height={media.height}
      loading="lazy"
      src={media.url}
      width={media.width}
    />
  )
  return (
    <figure
      className={`pb-image${data.rounded ? ' pb-image--rounded' : ''}`}
      style={data.ratio && data.ratio !== 'auto' ? { aspectRatio: data.ratio } : undefined}
    >
      {data.url ? <a href={data.url}>{img}</a> : img}
      {data.caption ? <figcaption>{data.caption}</figcaption> : null}
    </figure>
  )
}

export const imageElement: ElementDefinition = {
  slug: 'image',
  Component: ImageEl,
  category: 'media',
  excerpt: (d) => asMedia(d.image)?.alt ?? '',
  fields: [
    { name: 'image', relationTo: 'media', required: true, type: 'upload' },
    { name: 'caption', localized: true, type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'ratio',
          defaultValue: 'auto',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '16:9', value: '16/9' },
            { label: '4:3', value: '4/3' },
            { label: '3:2', value: '3/2' },
            { label: 'Square', value: '1/1' },
          ],
          type: 'select',
        },
        { name: 'rounded', defaultValue: false, label: 'Rounded corners', type: 'checkbox' },
        { name: 'url', label: 'Link', type: 'text' },
      ],
    },
  ],
  icon: 'image',
  label: 'Image',
}

/* ---------------- Gallery ---------------- */

const Gallery: React.FC<
  ElementComponentProps<{ images?: { id?: string; image?: unknown }[]; columns?: string; gap?: string }>
> = ({ data }) => {
  if (!data.images?.length) return null
  return (
    <div
      className="pb-gallery"
      style={
        {
          '--pb-gallery-cols': data.columns ?? '3',
          '--pb-gallery-gap': data.gap ?? '12px',
        } as React.CSSProperties
      }
    >
      {data.images.map((entry, i) => {
        const media = asMedia(entry.image)
        if (!media?.url) return null
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={media.alt ?? ''}
            key={entry.id ?? i}
            loading="lazy"
            src={media.url}
          />
        )
      })}
    </div>
  )
}

export const galleryElement: ElementDefinition = {
  slug: 'gallery',
  Component: Gallery,
  category: 'media',
  excerpt: (d) => `${(d.images as unknown[] | undefined)?.length ?? 0} images`,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          defaultValue: '3',
          options: ['2', '3', '4', '5'].map((v) => ({ label: `${v} columns`, value: v })),
          type: 'select',
        },
        { name: 'gap', admin: { placeholder: '12px' }, type: 'text' },
      ],
    },
    {
      name: 'images',
      fields: [{ name: 'image', relationTo: 'media', required: true, type: 'upload' }],
      labels: { plural: 'Images', singular: 'Image' },
      type: 'array',
    },
  ],
  icon: 'gallery',
  label: 'Gallery',
}

/* ---------------- Video ---------------- */

const VideoEl: React.FC<
  ElementComponentProps<{
    source?: string
    file?: unknown
    embedUrl?: string
    poster?: unknown
    ratio?: string
    controls?: boolean
  }>
> = ({ data }) => {
  const ratio = data.ratio ?? '16/9'

  if (data.source === 'embed') {
    const url = typeof data.embedUrl === 'string' ? data.embedUrl : ''
    // Only well-known embed hosts, and only over https.
    const ok = /^https:\/\/(www\.)?(youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(url)
    if (!ok) return null
    return (
      <div className="pb-video" style={{ aspectRatio: ratio }}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          src={url}
          title="Video"
        />
      </div>
    )
  }

  const file = asMedia(data.file)
  if (!file?.url) return null
  return (
    <div className="pb-video" style={{ aspectRatio: ratio }}>
      <video controls={data.controls !== false} poster={asMedia(data.poster)?.url} preload="metadata">
        <source src={file.url} />
      </video>
    </div>
  )
}

export const videoElement: ElementDefinition = {
  slug: 'video',
  Component: VideoEl,
  category: 'media',
  excerpt: (d) => (d.source === 'embed' ? String(d.embedUrl ?? '') : asMedia(d.file)?.url ?? ''),
  fields: [
    {
      name: 'source',
      defaultValue: 'embed',
      options: [
        { label: 'YouTube / Vimeo embed', value: 'embed' },
        { label: 'Uploaded file', value: 'file' },
      ],
      type: 'select',
    },
    {
      name: 'embedUrl',
      admin: {
        condition: (_d, s) => s?.source === 'embed',
        description: 'Use the embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID',
      },
      label: 'Embed URL',
      type: 'text',
    },
    {
      name: 'file',
      admin: { condition: (_d, s) => s?.source === 'file' },
      relationTo: 'media',
      type: 'upload',
    },
    {
      name: 'poster',
      admin: { condition: (_d, s) => s?.source === 'file' },
      relationTo: 'media',
      type: 'upload',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ratio',
          defaultValue: '16/9',
          options: [
            { label: '16:9', value: '16/9' },
            { label: '4:3', value: '4/3' },
            { label: 'Square', value: '1/1' },
          ],
          type: 'select',
        },
        {
          name: 'controls',
          admin: { condition: (_d, s) => s?.source === 'file' },
          defaultValue: true,
          label: 'Show controls',
          type: 'checkbox',
        },
      ],
    },
  ],
  icon: 'video',
  label: 'Video',
}

/* ---------------- Map ---------------- */

const MapEl: React.FC<ElementComponentProps<{ embedUrl?: string; height?: number }>> = ({ data }) => {
  const url = typeof data.embedUrl === 'string' ? data.embedUrl : ''
  if (!/^https:\/\/(www\.)?google\.com\/maps\/embed/.test(url)) return null
  return (
    <div className="pb-map" style={{ height: `${data.height ?? 400}px` }}>
      <iframe
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={url}
        title="Map"
      />
    </div>
  )
}

export const mapElement: ElementDefinition = {
  slug: 'map',
  Component: MapEl,
  category: 'interactive',
  excerpt: () => 'Google Map',
  fields: [
    {
      name: 'embedUrl',
      admin: { description: 'Google Maps → Share → Embed a map → copy the src URL.' },
      label: 'Embed URL',
      type: 'text',
    },
    { name: 'height', defaultValue: 400, max: 1200, min: 120, type: 'number' },
  ],
  icon: 'map',
  label: 'Map',
}

/* ---------------- Social links ---------------- */

const Social: React.FC<
  ElementComponentProps<{ links?: { id?: string; network?: string; url?: string }[]; size?: number }>
> = ({ data }) => {
  if (!data.links?.length) return null
  return (
    <ul className="pb-social" style={{ '--pb-social-size': `${data.size ?? 20}px` } as React.CSSProperties}>
      {data.links.map((link, i) => {
        if (!link.url || !/^https?:\/\//i.test(link.url)) return null
        return (
          <li key={link.id ?? i}>
            <a href={link.url} rel="noopener noreferrer" target="_blank">
              {link.network}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export const socialElement: ElementDefinition = {
  slug: 'social',
  Component: Social,
  category: 'interactive',
  excerpt: (d) =>
    (Array.isArray(d.links) ? (d.links as { network?: string }[]) : [])
      .map((l) => l.network)
      .filter(Boolean)
      .join(' · '),
  fields: [
    { name: 'size', defaultValue: 20, max: 64, min: 12, type: 'number' },
    {
      name: 'links',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'network',
              options: ['LinkedIn', 'X', 'Facebook', 'Instagram', 'YouTube', 'WhatsApp', 'Email'].map(
                (v) => ({ label: v, value: v }),
              ),
              type: 'select',
            },
            { name: 'url', required: true, type: 'text' },
          ],
        },
      ],
      labels: { plural: 'Links', singular: 'Link' },
      type: 'array',
    },
  ],
  icon: 'social',
  label: 'Social Links',
}
