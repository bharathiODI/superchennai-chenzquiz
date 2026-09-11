// import React from 'react'

// interface Props {
//   title?: string
//   eventName?: string
//   eventDate?: string
//   venue?: string
//   values?: Record<string, any>
//   thankYouMessage?: string
// }

// const SummerFestRegistrationEmail: React.FC<Props> = ({
//   title,
//   eventName,
//   eventDate,
//   venue,
//   values,
//   thankYouMessage,
// }) => {
//   const displayEventTitle = title || eventName || 'Super Chennai Summer Fest 2026'

//   return (
//     <div
//       style={{
//         background: '#f4f4f4',
//         padding: '40px 20px',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <div
//         style={{
//           maxWidth: '700px',
//           margin: '0 auto',
//           background: '#ffffff',
//           borderRadius: '20px',
//           overflow: 'hidden',
//           boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
//             padding: '45px 40px',
//             textAlign: 'center',
//           }}
//         >
//           <h1
//             style={{
//               color: '#fff',
//               margin: 0,
//               fontSize: '32px',
//               fontWeight: 'bold',
//             }}
//           >
//             {displayEventTitle}
//           </h1>

//           <p
//             style={{
//               color: '#fdf2f8',
//               marginTop: '12px',
//               fontSize: '16px',
//             }}
//           >
//             Event Registration Confirmation
//           </p>
//         </div>

//         {/* CONTENT */}
//         <div style={{ padding: '40px' }}>
//           {/* EVENT INFO (Rendered conditionally if details exist) */}
//           {(eventDate || venue) && (
//             <div
//               style={{
//                 marginBottom: '30px',
//                 padding: '20px',
//                 background: '#f9fafb',
//                 borderRadius: '12px',
//                 border: '1px solid #f3f4f6',
//               }}
//             >
//               <h2
//                 style={{
//                   marginTop: 0,
//                   color: '#111827',
//                   marginBottom: '12px',
//                   fontSize: '18px',
//                 }}
//               >
//                 Event Info
//               </h2>
//               {eventDate && (
//                 <p style={{ margin: '4px 0', color: '#374151', fontSize: '14px' }}>
//                   <strong>Date:</strong> {eventDate}
//                 </p>
//               )}
//               {venue && (
//                 <p style={{ margin: '4px 0', color: '#374151', fontSize: '14px' }}>
//                   <strong>Venue:</strong> {venue}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* REGISTRATION DETAILS TABLE */}
//           <h2
//             style={{
//               color: '#111827',
//               marginBottom: '20px',
//               fontSize: '20px',
//             }}
//           >
//             Registration Details
//           </h2>

//           <table
//             width="100%"
//             cellPadding="12"
//             style={{
//               borderCollapse: 'collapse',
//             }}
//           >
//             <tbody>
//               {Object.entries(values || {}).map(([key, value], index) => (
//                 <tr key={index}>
//                   <td
//                     style={{
//                       fontWeight: 'bold',
//                       borderBottom: '1px solid #eee',
//                       width: '220px',
//                       textTransform: 'capitalize',
//                       color: '#374151',
//                     }}
//                   >
//                     {key.replace(/([A-Z])/g, ' $1')}
//                   </td>

//                   <td
//                     style={{
//                       borderBottom: '1px solid #eee',
//                       color: '#111827',
//                     }}
//                   >
//                     {String(value || '')}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* THANK YOU SECTION */}
//           {thankYouMessage && (
//             <div
//               style={{
//                 marginTop: '35px',
//                 padding: '24px',
//                 background: '#fdf2f8',
//                 borderRadius: '16px',
//                 border: '1px solid #fbcfe8',
//               }}
//             >
//               <h3
//                 style={{
//                   marginTop: 0,
//                   marginBottom: '12px',
//                   color: '#be185d',
//                 }}
//               >
//                 Thank You
//               </h3>

//               <div
//                 style={{
//                   color: '#374151',
//                   lineHeight: '1.8',
//                   fontSize: '15px',
//                 }}
//                 dangerouslySetInnerHTML={{
//                   __html: thankYouMessage,
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}
//         <div
//           style={{
//             background: '#111827',
//             padding: '24px',
//             textAlign: 'center',
//           }}
//         >
//           <p
//             style={{
//               color: '#d1d5db',
//               margin: 0,
//               fontSize: '13px',
//               letterSpacing: '0.5px',
//             }}
//           >
//             © 2026 Super Chennai Summer Fest • Chennai’s Biggest Summer Celebration
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SummerFestRegistrationEmail
import React from 'react'

interface Props {
  title?: string
  eventName?: string
  eventDate?: string
  venue?: string
  values?: Record<string, any>
  thankYouMessage?: string
}

const LetsTalkRegistrationEmail: React.FC<Props> = ({
  title,
  eventName,
  eventDate,
  venue,
  values,
  thankYouMessage,
}) => {
  const displayEventTitle = title || eventName || "Let's Talk Chennai 2026"

  // Helper to format dynamic key labels cleanly
  const formatKeyLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
  }

  return (
    <div
      style={{
        background: '#f8fafc',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(109, 67, 153, 0.12)',
          border: '1px solid #f1f5f9',
        }}
      >
        {/* PREMIUM HEADER WITH CUSTOM GRADIENT */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ec265b 0%, #6d4399 100%)',
            padding: '50px 40px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              padding: '6px 16px',
              borderRadius: '50px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            LET&apos;S TALK CHENNAI
          </span>

          <h1
            style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: '1.25',
            }}
          >
            {displayEventTitle}
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '12px',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Registration Confirmation
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '40px' }}>
          {/* EVENT INFO (CONDITIONAL) */}
          {(eventDate || venue) && (
            <div
              style={{
                marginBottom: '32px',
                padding: '24px',
                background: 'linear-gradient(180deg, #faf5ff 0%, #fff 100%)',
                borderRadius: '16px',
                border: '1px solid #f3e8ff',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: '#6d4399',
                  marginBottom: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Event Info
              </h2>
              {eventDate && (
                <p style={{ margin: '6px 0', color: '#334155', fontSize: '14px' }}>
                  <strong style={{ color: '#1e293b' }}>Date:</strong> {eventDate}
                </p>
              )}
              {venue && (
                <p style={{ margin: '6px 0', color: '#334155', fontSize: '14px' }}>
                  <strong style={{ color: '#1e293b' }}>Venue:</strong> {venue}
                </p>
              )}
            </div>
          )}

          {/* REGISTRATION DETAILS TABLE */}
          <h2
            style={{
              color: '#1e293b',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.3px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Registration Details
          </h2>

          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #f1f5f9',
            }}
          >
            <table
              width="100%"
              cellPadding="14"
              style={{
                borderCollapse: 'collapse',
                background: '#ffffff',
              }}
            >
              <tbody>
                {Object.entries(values || {}).map(([key, value], index) => {
                  if (typeof value === 'object' && value !== null) return null

                  return (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                    >
                      <td
                        style={{
                          fontWeight: '600',
                          borderBottom: '1px solid #f1f5f9',
                          width: '40%',
                          textTransform: 'capitalize',
                          color: '#6d4399',
                          fontSize: '13px',
                        }}
                      >
                        {formatKeyLabel(key)}
                      </td>

                      <td
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          color: '#0f172a',
                          fontSize: '14px',
                          fontWeight: '500',
                          wordBreak: 'break-word',
                        }}
                      >
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || '-')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* THANK YOU SECTION */}
          {thankYouMessage && (
            <div
              style={{
                marginTop: '36px',
                padding: '24px',
                background: '#fff5f7',
                borderRadius: '18px',
                border: '1px solid #fce7f3',
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: '10px',
                  color: '#ec265b',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                Thank You!
              </h3>

              <div
                style={{
                  color: '#334155',
                  lineHeight: '1.7',
                  fontSize: '14px',
                }}
                dangerouslySetInnerHTML={{
                  __html: thankYouMessage,
                }}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            background: '#0f172a',
            padding: '28px',
            textAlign: 'center',
            borderTop: '3px solid #ec265b',
          }}
        >
          <p
            style={{
              color: '#94a3b8',
              margin: 0,
              fontSize: '12px',
              letterSpacing: '0.5px',
              fontWeight: '500',
            }}
          >
            © 2026 Super Chennai • Let&apos;s Talk Chennai Edition
          </p>
        </div>
      </div>
    </div>
  )
}

export default LetsTalkRegistrationEmail
