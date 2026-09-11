// import RichText from 'src/components/RichText'
// import React from 'react'

// import { Width } from '../Width'
// import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// export const Message: React.FC<{ message: SerializedEditorState }> = ({ message }) => {
//   return (
//     <Width className="my-12" width="100">
//       {message && <RichText data={message} />}
//     </Width>
//   )
// }
import React from 'react'
import RichText from 'src/components/RichText'
import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'


export const Message: React.FC<{ message: DefaultTypedEditorState | null }> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message} />}
    </Width>
  )
}
