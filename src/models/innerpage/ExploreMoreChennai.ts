export type Slide = {
  title?: string
  link?: string
  image?: {
    url?: string
    alt?: string
  }
}

export type ExploreMoreProps = {
  heading: string
  description?: string
  data?: {
    title?: string
    description?: string
    slides?: Slide[]
    image?: {
      url?: string
      alt?: string
    }
  }
}
