import React from 'react'
import './style.css'

type NoDataProps = {
  message: string
  className?: string
}

const NoData: React.FC<NoDataProps> = ({ message, className = '' }) => {
  return (
    <div className={`no-data-wrapper ${className}`}>
      <div className="no-data-box">
        <h3 className="no-data-title">{message}</h3>
        <p className="no-data-description">Try again later or check back soon.</p>
      </div>
    </div>
  )
}

export default NoData
