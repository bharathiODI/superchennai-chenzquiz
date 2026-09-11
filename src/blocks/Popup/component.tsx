'use client'

import React, { useEffect, useState } from 'react'
// import './style.css'

type Props = {
  enablePopup?: boolean

  popupImage?: {
    url?: string
    alt?: string
  }

  redirectLink?: string
  openInNewTab?: boolean
}

const PopupBanner = ({
  enablePopup,
  popupImage,
  redirectLink,
  openInNewTab,
}: Props) => {
  const [showPopup, setShowPopup] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (enablePopup) {
      setShowPopup(true)

      setTimeout(() => {
        setAnimateIn(true)
      }, 10)
    }
  }, [enablePopup])

  const handleClose = () => {
    setAnimateIn(false)

    setTimeout(() => {
      setShowPopup(false)
    }, 300)
  }

  if (!showPopup || !popupImage?.url) {
    return null
  }

  return (
    <div
      className="fixed popupImageBackground inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999] transition-opacity duration-300 ease-in-out hotshots-popup menifeto-popup"
      id="menifesto-popup"
    >
      <div
        className={`popupStyleMainContainer bg-white p-4 rounded shadow-lg relative max-w-[90%] max-h-[90%] transform transition-all duration-500 ease-in-out ${
          animateIn
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90'
        }`}
      >
        {/* CLOSE BUTTON ######################### */}
        <button
          className="absolute top-2 right-2 text-black text-[40px] cursor-pointer"
          onClick={handleClose}
        >
          &times;
        </button>

        {/* IMAGE ################################ */}
        <div className="flex ImagePopupFlex">
          <a
            href={redirectLink || '#'}
            target={
              openInNewTab ? '_blank' : '_self'
            }
            rel="noopener noreferrer"
          >
            <img
              src={popupImage.url}
              alt={popupImage.alt || 'Popup'}
              className="LeftSideImagePopup max-w-full max-h-[80vh]"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default PopupBanner