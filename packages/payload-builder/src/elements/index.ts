import type { ElementDefinition } from '../types'
import {
  buttonElement,
  dividerElement,
  headingElement,
  iconElement,
  spacerElement,
} from './basic'
import {
  accordionElement,
  alertElement,
  cardRowElement,
  checklistElement,
  counterElement,
  iconBoxElement,
  progressElement,
  richTextElement,
  tableElement,
  testimonialElement,
} from './content'
import {
  galleryElement,
  imageElement,
  mapElement,
  socialElement,
  videoElement,
} from './media'

/**
 * The standard element pack. Projects can use it wholesale, subset it, or
 * mix in their own definitions:
 *
 *   elements: [...standardElements, myCustomElement]
 *
 * See ELEMENTS.md for the authoring contract.
 */
export const standardElements: ElementDefinition[] = [
  // Basic
  headingElement,
  richTextElement,
  buttonElement,
  iconElement,
  dividerElement,
  spacerElement,
  // Content
  cardRowElement,
  iconBoxElement,
  accordionElement,
  checklistElement,
  testimonialElement,
  counterElement,
  progressElement,
  alertElement,
  tableElement,
  // Media
  imageElement,
  galleryElement,
  videoElement,
  // Interactive
  mapElement,
  socialElement,
]

export {
  accordionElement,
  alertElement,
  buttonElement,
  cardRowElement,
  checklistElement,
  counterElement,
  dividerElement,
  galleryElement,
  headingElement,
  iconBoxElement,
  iconElement,
  imageElement,
  mapElement,
  progressElement,
  richTextElement,
  socialElement,
  spacerElement,
  tableElement,
  testimonialElement,
  videoElement,
}
