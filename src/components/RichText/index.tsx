import { BannerBlock } from '@/blocks/Banner/Component'
import EventListingComponent from '@/blocks/eventListing/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from 'src/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  MediaBlock as MediaBlockProps,
} from 'src/payload-types'
import { cn } from 'src/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps | VisitBannerProps>
export type VisitBannerProps = {
  title: string
  bannerImage?: {
    url?: string
  }
}

export type VisitCategoryProps = {
  heading?: string
  description?: string
  categories?: Array<{
    label: string
    link: string
    image?: {
      url?: string
    }
  }>
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters = ({ pageData }: { pageData?: any }): JSXConvertersFunction<NodeTypes> => {
  return ({ defaultConverters }) => {
    return {
      ...defaultConverters,
      ...LinkJSXConverter({ internalDocToHref }),
      blocks: {
        //###################### THIS IS POST RELATED BLOG #####################
        banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
        mediaBlock: ({ node }) => (
          <MediaBlock
            className="col-start-1 col-span-3"
            imgClassName="m-0"
            captionClassName="mx-auto max-w-[48rem]"
            enableGutter={false}
            disableInnerContainer={true}
            {...node.fields}
            link={{
              url: node.fields.link?.url ?? undefined,
              newTab: node.fields.link?.newTab ?? undefined,
            }}
            thumbnail={node.fields.thumbnail ?? undefined}
          />
        ),

        //################# THIS IS POST RELATED BLOG #####

        code: ({ node }) => <CodeBlock className="" {...node.fields} />,
        EventListing: ({ node }: { node: SerializedBlockNode<any> }) => (
          <EventListingComponent {...node.fields} />
        ),

   
        
      },
    }
  }
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  pageData?: any
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { pageData, className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <ConvertRichText
      converters={jsxConverters({ pageData })}
      className={cn(
        {
          container: enableGutter,
          '': !enableGutter,
          '': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
