import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Code2, Clock } from "lucide-react"

function Countdown(){
  const eventDate = new Date('2026-08-01T09:00:00')
  const [now, setNow] = React.useState(Date.now())
  React.useEffect(()=>{
    const t = setInterval(()=> setNow(Date.now()), 1000)
    return ()=> clearInterval(t)
  },[])
  const diff = Math.max(0, eventDate.getTime() - now)
  const days = Math.floor(diff / (1000*60*60*24))
  const hours = Math.floor((diff / (1000*60*60)) % 24)
  const minutes = Math.floor((diff / (1000*60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return (
    <div className="flex gap-3 items-center">
      {[days,hours,minutes,seconds].map((v,i)=> (
        <div key={i} className="bg-primary text-secondary px-3 py-2 rounded-md font-mono text-lg shadow-md border border-white/10">{String(v).padStart(2,'0')}</div>
      ))}
    </div>
  )
}

export default function Landing(){
  const nav = useNavigate()
  return (
    <div className="hero-diagonal min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-white md:pl-8">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl leading-tight text-white"
            style={{ textShadow: "0 2px 12px rgba(13,15,43,0.5)" }}
          >
            KTBC 2026
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-xs font-semibold tracking-widest uppercase text-white/60"
            style={{ textShadow: "0 1px 6px rgba(13,15,43,0.4)" }}
          >
            Digital Registration & Check-In System
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-base  text-white/90 leading-relaxed"
            style={{ textShadow: "0 1px 8px rgba(13,15,43,0.6)" }}
          >
            A transformative gathering for young leaders across Africa, join us
            for culture, innovation and impact.
          </motion.p>
          <div className="mt-6">
            <Countdown />
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => nav("/register")}
              className="ktbc-btn-primary px-6 py-3 rounded-lg shadow-lg"
            >
              Register Now
            </button>
            <button
              onClick={() => nav("/scanner")}
              className="ktbc-btn-secondary px-6 py-3 rounded-lg"
            >
              Check-In
            </button>
          </div>
        </div>
        <div className="bg-bg/20 glass-card rounded-xl p-6 shadow-xl border border-white/10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Project Overview
              </h3>
              <p className="text-xs text-muted">
                A concise summary of the KTBC 2026 registration & check-in
                platform
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mb-4" />

          {/* List */}
          <ul className="space-y-3">
            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Scalable registration
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Designed to register and manage 4,000+ attendees
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Code2 className="w-3.5 h-3.5 text-teal-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Parental consent enforcement
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Conditional consent flow and OTP verification
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Fast QR check-in
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Camera-based scanning with duplicate/flag handling and offline
                  queueing
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
