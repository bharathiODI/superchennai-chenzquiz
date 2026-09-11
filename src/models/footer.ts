export type LinkItem = {
  label: string
  link: string
}

export type TopSectionLink = {
  category: string
  links: LinkItem[]
}

export type SocialLink = {
  platform: string
  link: string
  icon?: {
    url?: string
  }
}

export type FooterSections = {
  topSectionLinks?: TopSectionLink[]
  socialLinks?: SocialLink[]
  mainFooterLogo?: {
    url?: string
    alt?: string
  }
  designByLogo?: {
    url?: string
    alt?: string
  }
  partnersLogo?: {
    url?: string
    alt?: string
  }
}
