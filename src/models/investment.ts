export type InvestmentImage = {
  url: string
  alt?: string
}

export type InvestmentItem = {
  link: string
  id: string
  title: string
  description?: string
  image?: InvestmentImage
}

export type Investment = {
  sectionTitle?: string
  sectionDescription?: string
  sectionImage?: {
    url?: string
    alt?: string
  }
  investmentItems?: InvestmentItem[]
}

export type InvestmentAPIItem = {
  slug: any
  sectionImage: any
  sectionDescription: any
  sectionTitle: any
  id: string
  title: string
  investments?: Investment[]
    investmentItems?: InvestmentItem[]

}

export type InvestmentAPIResponse = {
  docs: InvestmentAPIItem[]
}

export type ExtractedCategory = {
  id: string
  title: string
  sectionTitle: string
  sectionDescription: string
  sectionImage: string
  investmentItems: InvestmentItem[]
}

export type ChennaiInvestmentsProps = {
  heading: string
  subheading?: string
}
export type ChennaiInvestmentsState = {
  extracted: ExtractedCategory[]
  selectedCategory: string
  loading: boolean
  error?: string
}

export type SectionInvestment = {
  id: string
  title: string
  sectionTitle?: string
  sectionDescription?: string
  sectionImage?: string
  investmentItems: InvestmentItem[]
}
export type InvestDetailsProps = {
  data: {
    id: string 
    title: string
    investments: InvestmentAPIItem[]
  }
}

