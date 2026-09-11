'use client'

import React from 'react'

export const FlyingBirds = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {/* Bird 1 */}
      <div className="bird-container bird-container--one">
        <div className="bird bird--one" />
      </div>

      {/* Bird 2 */}
      <div className="bird-container bird-container--two">
        <div className="bird bird--two" />
      </div>

      {/* Bird 3 */}
      <div className="bird-container bird-container--three">
        <div className="bird bird--three" />
      </div>

      {/* Bird 4 */}
      <div className="bird-container bird-container--four">
        <div className="bird bird--four" />
      </div>

      {/* CSS Styles for Flying Birds */}
      <style jsx>{`
        .bird {
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg');
          background-repeat: no-repeat;
          background-size: auto 100%;
          width: 88px;
          height: 125px;
          will-change: background-position, filter;
          animation-name: fly-cycle;
          animation-timing-function: steps(10);
          animation-iteration-count: infinite;

          /* 🌟 Birds-ஐ Soft Gray Shade-க்கு மாற்றுவதற்கான Filter */
          filter: brightness(2.5) contrast(0.6) opacity(0.65);
        }

        .bird--one {
          animation-duration: 1s;
          animation-delay: -0.5s;
        }

        .bird--two {
          animation-duration: 0.9s;
          animation-delay: -0.75s;
        }

        .bird--three {
          animation-duration: 1.25s;
          animation-delay: -0.25s;
        }

        .bird--four {
          animation-duration: 1.1s;
          animation-delay: -0.1s;
        }

        .bird-container {
          position: absolute;
          top: 20%;
          left: -10%;
          will-change: transform;
          animation-name: fly-across;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .bird-container--one {
          top: 15%;
          animation-duration: 15s;
          animation-delay: 0s;
          transform: scale(0.62);
        }

        .bird-container--two {
          top: 28%;
          animation-duration: 18s;
          animation-delay: 2s;
          transform: scale(0.45);
        }

        .bird-container--three {
          top: 10%;
          animation-duration: 22s;
          animation-delay: 5s;
          transform: scale(0.35);
        }

        .bird-container--four {
          top: 35%;
          animation-duration: 16s;
          animation-delay: 7s;
          transform: scale(0.5);
        }

        @keyframes fly-cycle {
          100% {
            background-position: -900px 0;
          }
        }

        @keyframes fly-across {
          0% {
            transform: translateY(2vh) translateX(-10vw) scale(0.5);
          }
          50% {
            transform: translateY(0vh) translateX(55vw) scale(0.55);
          }
          100% {
            transform: translateY(3vh) translateX(110vw) scale(0.5);
          }
        }
      `}</style>
    </div>
  )
}