'use client'

import React, { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

import './styles.scss'

/* ======================================================
   HELPERS
====================================================== */

// Transform 'your_name__' or 'email_address' to 'Your Name'
const formatHeader = (key: string) => {
  return key
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// Convert relative URLs (/media/file.jpg) to full absolute URLs
const getFullMediaUrl = (fileUrl?: string) => {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  return `${baseUrl.replace(/\/$/, '')}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}

export default function Dashboard() {
  const [selectedWeek, setSelectedWeek] = useState('ALL')
  const [selectedEvent, setSelectedEvent] = useState('ALL')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  /* ======================================================
     FETCH DATA
  ====================================================== */

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/summer-dashboard')
      const json = await res.json()
      setData(Array.isArray(json?.docs) ? json.docs : [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  /* ======================================================
     GROUP BY WEEK
  ====================================================== */

  const groupedWeeks = useMemo(() => {
    return data.reduce((acc: Record<string, any[]>, item: any) => {
      const weekTitle = item?.week?.title || item?.contestWeek?.title || 'General'

      if (!acc[weekTitle]) {
        acc[weekTitle] = []
      }

      acc[weekTitle].push(item)
      return acc
    }, {})
  }, [data])

  /* ======================================================
     GROUP EVENTS INSIDE SELECTED WEEK OR ALL
  ====================================================== */

  const groupedEvents = useMemo(() => {
    const targetData = selectedWeek === 'ALL' ? data : groupedWeeks[selectedWeek] || []

    return targetData.reduce((acc: Record<string, any[]>, item: any) => {
      const title =
        item?.summer?.eventFields?.title ||
        item?.summer?.title ||
        item?.contest?.eventFields?.title ||
        item?.contest?.title ||
        item?.eventTitle ||
        'Untitled Event'

      if (!acc[title]) {
        acc[title] = []
      }

      acc[title].push(item)
      return acc
    }, {})
  }, [data, groupedWeeks, selectedWeek])

  /* ======================================================
     FILTER CURRENT ITEMS BASED ON SELECTIONS
  ====================================================== */

  const currentItems = useMemo(() => {
    if (selectedWeek === 'ALL' && selectedEvent === 'ALL') {
      return data
    }

    if (selectedEvent === 'ALL') {
      return groupedWeeks[selectedWeek] || []
    }

    return groupedEvents[selectedEvent] || []
  }, [data, groupedWeeks, groupedEvents, selectedWeek, selectedEvent])

  /* ======================================================
     DYNAMIC COLUMNS EXTRACTOR
  ====================================================== */

  const dynamicKeys = useMemo(() => {
    const keysSet = new Set<string>()

    currentItems.forEach((item: any) => {
      if (item?.values && typeof item.values === 'object') {
        Object.keys(item.values).forEach((k) => keysSet.add(k))
      }
    })

    return Array.from(keysSet)
  }, [currentItems])

  /* ======================================================
     EXCEL DOWNLOAD FUNCTION
  ====================================================== */

  const downloadExcel = () => {
    if (currentItems.length === 0) {
      alert('No data available to export!')
      return
    }

    const excelRows = currentItems.map((item: any) => {
      const rowData: Record<string, any> = {
        'Registration ID': item.id || '-',
        Status: item.status || 'pending',
      }

      if (item.name) rowData['Name'] = item.name
      if (item.email) rowData['Email'] = item.email
      if (item.phone) rowData['Phone'] = item.phone

      dynamicKeys.forEach((key) => {
        const headerLabel = formatHeader(key)
        const val = item.values?.[key]
        rowData[headerLabel] = val !== undefined && val !== null ? String(val) : '-'
      })

      // FORMAT FULL ABSOLUTE MEDIA URLS
      const files = Array.isArray(item.attachments)
        ? item.attachments
            .map((f: any) => {
              const fileObjUrl = typeof f?.file === 'object' ? f?.file?.url : f?.file
              return getFullMediaUrl(fileObjUrl)
            })
            .filter(Boolean)
            .join(' | ')
        : ''

      rowData['Uploaded Files'] = files || '-'
      rowData['Submitted Date'] = item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'

      return rowData
    })

    const worksheet = XLSX.utils.json_to_sheet(excelRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')

    const filePrefix =
      selectedEvent === 'ALL'
        ? 'all_registrations'
        : selectedEvent.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    XLSX.writeFile(workbook, `${filePrefix}_export.xlsx`)
  }

  return (
    <div className="eventDashboard">
      {/* HERO SECTION */}
      <div className="eventDashboard__hero">
        <div>
          <p className="eventDashboard__eyebrow">EVENT MANAGEMENT</p>
          <h1 className="eventDashboard__title">Registrations Dashboard</h1>
          <p className="eventDashboard__subtitle">Manage and export all event submissions</p>
        </div>

        <div className="eventDashboard__stats">
          <div className="statCard">
            <h3>{data.length}</h3>
            <p>Total Submissions</p>
          </div>

          <div className="statCard">
            <h3>{currentItems.length}</h3>
            <p>Filtered Registrations</p>
          </div>

          <button
            className="downloadExcelBtn"
            onClick={downloadExcel}
            disabled={currentItems.length === 0}
          >
            📊 Export to Excel
          </button>
        </div>
      </div>

      {/* WEEK / CATEGORY SUBTABS WITH 'ALL' OPTION */}
      <div className="subTabs">
        <button
          onClick={() => {
            setSelectedWeek('ALL')
            setSelectedEvent('ALL')
          }}
          className={`subTabButton ${selectedWeek === 'ALL' ? 'active' : ''}`}
        >
          All Registrations <span>({data.length})</span>
        </button>

        {Object.keys(groupedWeeks).map((week, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedWeek(week)
              setSelectedEvent('ALL')
            }}
            className={`subTabButton ${selectedWeek === week ? 'active' : ''}`}
          >
            {week} <span>({groupedWeeks[week]?.length ?? 0})</span>
          </button>
        ))}
      </div>

      {/* EVENT TITLE SUBTABS */}
      {Object.keys(groupedEvents).length > 0 && (
        <div className="subTabs">
          <button
            onClick={() => setSelectedEvent('ALL')}
            className={`subTabButton ${selectedEvent === 'ALL' ? 'active' : ''}`}
          >
            All Events{' '}
            <span>
              ({(selectedWeek === 'ALL' ? data : groupedWeeks[selectedWeek] || []).length})
            </span>
          </button>

          {Object.keys(groupedEvents).map((title, index) => (
            <button
              key={index}
              onClick={() => setSelectedEvent(title)}
              className={`subTabButton ${selectedEvent === title ? 'active' : ''}`}
            >
              {title} <span>({groupedEvents[title]?.length || 0})</span>
            </button>
          ))}
        </div>
      )}

      {/* REGISTRATION DATA TABLE */}
      {loading ? (
        <div className="loadingState">Loading registrations...</div>
      ) : (
        <div className="registrationTableWrapper">
          {currentItems.length > 0 ? (
            <table className="registrationTable">
              <thead>
                <tr>
                  <th className="id-col">ID</th>

                  {/* DYNAMIC FORM FIELDS COLUMNS */}
                  {dynamicKeys.length > 0 ? (
                    dynamicKeys.map((key) => {
                      const label = formatHeader(key)
                      return (
                        <th key={key} title={label} className="dynamic-col">
                          {label}
                        </th>
                      )
                    })
                  ) : (
                    <>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </>
                  )}

                  <th className="attachment-col">Attachments</th>
                  <th className="date-col">Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: any, idx: number) => (
                  <tr key={item.id || idx}>
                    <td className="id-col">#{item.id}</td>

                    {/* DYNAMIC FIELD VALUES */}
                    {dynamicKeys.length > 0 ? (
                      dynamicKeys.map((key) => {
                        const val = item.values?.[key]
                        return (
                          <td key={key} className="dynamic-col">
                            {val !== undefined && val !== null && val !== '' ? (
                              typeof val === 'boolean' ? (
                                val ? (
                                  'Yes'
                                ) : (
                                  'No'
                                )
                              ) : (
                                String(val)
                              )
                            ) : (
                              <span className="emptyValue">-</span>
                            )}
                          </td>
                        )
                      })
                    ) : (
                      <>
                        <td>{item.name || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.phone || '-'}</td>
                      </>
                    )}

                    {/* ATTACHMENTS WITH FULL URL */}
                    <td className="attachment-col">
                      {Array.isArray(item.attachments) && item.attachments.length > 0 ? (
                        <div className="attachmentList">
                          {item.attachments.map((fileItem: any, i: number) => {
                            const rawUrl =
                              typeof fileItem?.file === 'object'
                                ? fileItem?.file?.url
                                : fileItem?.file
                            const fileUrl = getFullMediaUrl(rawUrl)

                            return fileUrl ? (
                              <a
                                key={i}
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="fileLink"
                              >
                                File {i + 1}
                              </a>
                            ) : null
                          })}
                        </div>
                      ) : (
                        <span className="emptyValue">No files</span>
                      )}
                    </td>

                    <td className="date-col">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="emptyState">No registrations found for this selection.</div>
          )}
        </div>
      )}
    </div>
  )
}
