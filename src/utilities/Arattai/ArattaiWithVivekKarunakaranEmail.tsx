import React from 'react'

interface Props {
  title?: string
  speakerName?: string
  eventDate?: string
  venue?: string
  values?: Record<string, any>
  thankYouMessage?: string
}

const ArattaiWithVivekKarunakaranEmail: React.FC<Props> = ({
  title,
  speakerName,
  eventDate,
  venue,
  values,
  thankYouMessage,
}) => {
  return (
    <div
      style={{
        background: '#f4f4f4',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg,#ec4899,#7c3aed)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: '#fff',
              margin: 0,
              fontSize: '32px',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              color: '#fdf2f8',
              marginTop: '10px',
            }}
          >
            New Registration Received
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '40px' }}>
          <h2
            style={{
              marginTop: 0,
              color: '#111827',
            }}
          >
            Event Details
          </h2>

          <table
            width="100%"
            cellPadding="12"
            style={{
              borderCollapse: 'collapse',
              marginBottom: '30px',
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: 'bold',
                    borderBottom: '1px solid #eee',
                    width: '180px',
                  }}
                >
                  Speaker
                </td>

                <td style={{ borderBottom: '1px solid #eee' }}>{speakerName}</td>
              </tr>

              <tr>
                <td
                  style={{
                    fontWeight: 'bold',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  Date
                </td>

                <td style={{ borderBottom: '1px solid #eee' }}>{eventDate}</td>
              </tr>

              <tr>
                <td
                  style={{
                    fontWeight: 'bold',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  Venue
                </td>

                <td style={{ borderBottom: '1px solid #eee' }}>{venue}</td>
              </tr>
            </tbody>
          </table>

          <h2
            style={{
              color: '#111827',
            }}
          >
            Registration Details
          </h2>

          <table
            width="100%"
            cellPadding="12"
            style={{
              borderCollapse: 'collapse',
            }}
          >
            <tbody>
              {Object.entries(values || {}).map(([key, value], index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontWeight: 'bold',
                      borderBottom: '1px solid #eee',
                      width: '200px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {key}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* THANK YOU MESSAGE */}

          {thankYouMessage && (
            <div
              style={{
                marginTop: '35px',
                padding: '20px',
                background: '#fdf2f8',
                borderRadius: '14px',
                border: '1px solid #fbcfe8',
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: '10px',
                  color: '#be185d',
                }}
              >
                Thank You Message
              </h3>

              <div
                style={{
                  color: '#374151',
                  lineHeight: '1.8',
                  fontSize: '15px',
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
            background: '#111827',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#d1d5db',
              margin: 0,
              fontSize: '13px',
            }}
          >
            © Super Chennai • Arattai Registration
          </p>
        </div>
      </div>
    </div>
  )
}

export default ArattaiWithVivekKarunakaranEmail