
'use client'

import React, { useRef, useState } from 'react'
import './style.css'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { HiForward } from 'react-icons/hi2'

export const Preloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  return (
    <>
      {loading ? (
        <div className=" container-fluid super-preloader bg-with-image">
          <video
            ref={videoRef}
            className="preloader-video"
            src="/videos/super-chennai.mp4"
            autoPlay
            muted={muted}
            playsInline
            onEnded={() => setLoading(false)}
          />

          {/* Mute Button */}
          <button className="mute-button" onClick={toggleMute}>
            {muted ? <HiVolumeOff size={24} /> : <HiVolumeUp size={24} />}
          </button>

          {/* Skip Button */}
          <button className="skip-button" onClick={() => setLoading(false)}>
            <HiForward size={20} style={{ marginRight: '6px' }} />
            Skip
          </button>
        </div>
      ) : (
        children
      )}
    </>
  )
}
