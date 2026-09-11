import { Media } from 'src/payload-types'

export type featureSectionSplitLayoutType = {
  imgSec: {
    image: Media
    sectionTitle: string
    sectionDesc?: string
    tenantInfoSections: {
      points: {
        imgs: Media
        title: string
        para: string
        link?: string
      }[]
    }[]
  }[]
}
