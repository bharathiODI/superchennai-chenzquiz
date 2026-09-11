type Props = {
  source: 'youtube' | 'instagram' | 'mp4'
  url: string
  autoplay?: boolean
}

export const VideoBlockComponent: React.FC<Props> = ({ source, url, autoplay }) => {
  if (source === 'youtube') {
    const videoId = url.split('v=')[1]?.split('&')[0]

    return (
      <iframe
        className="w-full aspect-video rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    )
  }

  if (source === 'instagram') {
    return (
      <iframe
        src={`${url}embed`}
        className="w-full aspect-video rounded-xl"
        allowTransparency
        allowFullScreen
      />
    )
  }

  // MP4
  return (
    <video
      src={url}
      controls
      autoPlay={autoplay}
      className="w-full rounded-xl"
    />
  )
}
