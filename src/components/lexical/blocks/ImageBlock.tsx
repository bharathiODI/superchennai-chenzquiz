import Image from 'next/image'

export default function ImageBlock({ node }: any) {
  const image = node.value

  if (!image?.url) return null

  return (
    <div className="my-10 rounded-3xl overflow-hidden">
      <Image
        src={image.url}
        alt={image.alt || ''}
        width={1200}
        height={700}
        className="w-full object-cover"
      />

      {image.caption && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {image.caption}
        </p>
      )}
    </div>
  )
}