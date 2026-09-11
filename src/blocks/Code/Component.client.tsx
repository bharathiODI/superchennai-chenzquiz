// 'use client'
// import { Highlight, themes } from 'prism-react-renderer'
// import React from 'react'
// import { CopyButton } from './CopyButton'

// type Props = {
//   code: string
//   language?: string
// }

// export const Code: React.FC<Props> = ({ code, language = '' }) => {
//   if (!code) return null

//   return (
//     <Highlight code={code} language={language} theme={themes.vsDark}>
//       {({ getLineProps, getTokenProps, tokens }) => (
//         <pre className="bg-black p-4 border text-xs border-border rounded overflow-x-auto">
//           {tokens.map((line, i) => (
//             <div key={i} {...getLineProps({ className: 'table-row', line })}>
//               <span className="table-cell select-none text-right text-white/25">{i + 1}</span>
//               <span className="table-cell pl-4">
//                 {line.map((token, key) => (
//                   <span key={key} {...getTokenProps({ token })} />
//                 ))}
//               </span>
//             </div>
//           ))}
//           <CopyButton code={code} />
//         </pre>
//       )}
//     </Highlight>
//   )
// }

'use client'

import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({
  code,
  language = '',
}) => {
  if (!code) return null

  /* ---------------------------------------
     LIVE HTML/CSS PREVIEW
  --------------------------------------- */

  const shouldRenderPreview =
    language === 'html' ||
    language === 'css'

  const previewDocument =
    language === 'html'
      ? code
      : `
        <html>
          <style>
            ${code}
          </style>

          <body>
            <div class="preview-box">
              <h1>Hello Bharathi 🚀</h1>
              <p>Live CSS Preview</p>
              <button>Button</button>
            </div>
          </body>
        </html>
      `

  return (
    <div className="space-y-6">
      {/* ---------------- CODE BLOCK ---------------- */}

      <Highlight
        code={code}
        language={language}
        theme={themes.vsDark}
      >
        {({
          getLineProps,
          getTokenProps,
          tokens,
        }) => (
          <pre className="relative overflow-x-auto rounded-2xl border border-white/10 bg-black p-5 text-sm">
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({
                  className: 'table-row',
                  line,
                })}
              >
                <span className="table-cell select-none pr-6 text-right text-white/30">
                  {i + 1}
                </span>

                <span className="table-cell">
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({
                        token,
                      })}
                    />
                  ))}
                </span>
              </div>
            ))}

            <CopyButton code={code} />
          </pre>
        )}
      </Highlight>

      {/* ---------------- LIVE PREVIEW ---------------- */}

      {shouldRenderPreview && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
            Live Preview
          </div>

          <iframe
            srcDoc={previewDocument}
            title="Code Preview"
            className="h-[500px] w-full bg-white"
            sandbox="allow-scripts"
          />
        </div>
      )}
    </div>
  )
}