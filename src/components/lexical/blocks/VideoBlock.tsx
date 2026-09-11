export default function VideoBlock({ node }: any) {
  const { source, url } = node.fields || {}

  if (!url) return null

  if (source === 'youtube') {
    const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()

    return (
      <div className="my-10">
        <iframe
          className="w-full aspect-video rounded-3xl"
          src={`https://www.youtube.com/embed/${id}`}
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <video className="w-full rounded-3xl my-10" controls src={url} />
  )
}