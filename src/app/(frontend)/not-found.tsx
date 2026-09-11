'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Gamepad2, ArrowLeft, Compass, Flame } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-800 flex flex-col justify-between items-center px-4 sm:px-6 py-10">
      {/* BACKGROUND GLOWS (LIGHT MODE) */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-200/50 blur-[120px] pointer-events-none" />

      {/* TOP BADGE */}
      <div className="relative z-10 text-center max-w-xl mx-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest shadow-sm backdrop-blur-md mb-4"
        >
          <Compass className="h-4 w-4 animate-spin-slow text-indigo-500" />
          404 Page Not Found
        </motion.div>
      </div>

      {/* GAMING ANIMATION CONTAINER */}
      <div className="relative z-10 w-full max-w-lg my-auto flex flex-col items-center text-center">
        {/* ANIMATED GAME CONSOLE & 404 GRAPHIC */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Floating Game Icons */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -left-8 p-3 rounded-2xl bg-white shadow-lg border border-slate-100 text-amber-500"
          >
            <Flame className="w-6 h-6" />
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8], rotate: [5, -5, 5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-4 -right-6 p-3 rounded-2xl bg-white shadow-lg border border-slate-100 text-indigo-500"
          >
            <Gamepad2 className="w-6 h-6" />
          </motion.div>

          {/* MAIN 404 DISPLAY */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-xl flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500">
                404
              </h1>
            </motion.div>

            {/* Pixelated / Game Over Style Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-black uppercase tracking-wider">
              <span>Game Over</span>
            </div>
          </motion.div>
        </div>

        {/* TEXT CONTENT */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-slate-800"
        >
          Lost in Chennai?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm sm:text-base text-slate-500 max-w-md"
        >
          Looks like this level doesn’t exist or has been moved. Let’s get you back to the main game!
        </motion.p>

        {/* NAVIGATION ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-200"
          >
            <Home className="w-4 h-4" /> Back To Home
          </Link>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 text-xs text-slate-400 text-center">
        Need help? Check your URL or return home.
      </div>
    </section>
  )
}