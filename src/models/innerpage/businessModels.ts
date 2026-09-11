import { Media } from 'src/payload-types'

export type FeaturePoint = {
  title: string
  desc?: string
  imgs?: Media | string
  para: {
    point: string
  }[]
}

export type FeatureTenantInfoSection = {
  title: string
  points: FeaturePoint[]
}

export type FeatureSection = {
  sectionTitle: string
  sectionDesc?: string
  image?: Media | string
  tenantInfoSections: FeatureTenantInfoSection[]
}

export type FeatureSectionsProps = {
  sections: FeatureSection[]
}
