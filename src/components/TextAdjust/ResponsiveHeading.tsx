import { JSX } from "react"

type ResponsiveHeadingProps = {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export const ResponsiveHeading: React.FC<ResponsiveHeadingProps> = ({
  text,
  as: Tag = 'h3',
  className = '',
}) => {
  const getHeadingSize = (text: string) => {
    if (text.length < 30) return 'text-4xl'
    if (text.length < 60) return 'text-3xl'
    return 'text-2xl'
  }

  return <Tag className={`${getHeadingSize(text)} ${className}`}>{text}</Tag>
}
