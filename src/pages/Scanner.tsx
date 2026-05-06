import React, { useEffect, useRef, useState } from 'react'

type ScanStatus = 'idle' | 'scanning' | 'success' | 'duplicate' | 'error'

interface AttendeeResult {
  name: string
  category: string
  checkedInAt?: string
}

export default function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<ScanStatus>('idle')
  const [checkedInCount] = useState(1243)
  const [totalCount] = useState(4000)
  const [attendee, setAttendee] = useState<AttendeeResult | null>(null)
  const [manualId, setManualId] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [torchOn, setTorchOn] = useState(false)

  // Start camera
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setStatus('scanning')
        scanLoop()
      }
    } catch {
      setCameraError(true)
      setStatus('idle')
    }
  }

  const stopCamera = () => {
    cancelAnimationFrame(animFrameRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  // QR scan loop using BarcodeDetector if available
  const scanLoop = () => {
    if (!('BarcodeDetector' in window)) return

    // @ts-ignore
    const detector = new BarcodeDetector({ formats: ['qr_code'] })

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          // @ts-ignore
          const codes = await detector.detect(videoRef.current)
          if (codes.length > 0) {
            handleScan(codes[0].rawValue)
            return
          }
        } catch {}
      }
      animFrameRef.current = requestAnimationFrame(detect)
    }
    animFrameRef.current = requestAnimationFrame(detect)
  }

  const handleScan = (raw: string) => {
    cancelAnimationFrame(animFrameRef.current)

    // Simulate lookup — replace with real API call
    const mock: Record<string, { result: ScanStatus; attendee: AttendeeResult }> = {
      'KTBC-001': { result: 'success', attendee: { name: 'Dare Adeyemi', category: 'Delegate' } },
      'KTBC-002': { result: 'duplicate', attendee: { name: 'Amaka Obi', category: 'Volunteer', checkedInAt: '09:14 AM' } },
    }

    const found = mock[raw]
    if (found) {
      setStatus(found.result)
      setAttendee(found.attendee)
    } else {
      setStatus('error')
      setAttendee(null)
    }

    // Auto reset after 4s
    setTimeout(() => {
      setStatus('scanning')
      setAttendee(null)
      scanLoop()
    }, 4000)
  }

  const handleManualSubmit = () => {
    if (manualId.trim()) {
      handleScan(manualId.trim().toUpperCase())
      setManualId('')
      setShowManual(false)
    }
  }

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] })
      setTorchOn(t => !t)
    } catch {}
  }

  const statusConfig = {
    idle:      { border: 'border-white/20',    corner: '#ffffff40', label: '' },
    scanning:  { border: 'border-accent/60',   corner: '#00C9B1',   label: '' },
    success:   { border: 'border-green-500',   corner: '#10B981',   label: '' },
    duplicate: { border: 'border-amber-500',   corner: '#F5A623',   label: '' },
    error:     { border: 'border-red-500',     corner: '#EF4444',   label: '' },
  }

  const cfg = statusConfig[status]

  return (
    <div className="min-h-screen bg-darkbg flex flex-col items-center justify-start pt-8 px-4 text-white">

      {/* Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold">QR Check-In</h1>
          <p className="text-xs text-muted mt-0.5">KTBC 2026 · Scanner</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-primary">
            {checkedInCount.toLocaleString()}
          </div>
          <div className="text-xs text-muted">of {totalCount.toLocaleString()} checked in</div>
          {/* Progress bar */}
          <div className="mt-1 w-28 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${(checkedInCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scanner viewport */}
      <div className="w-full max-w-md relative">
        <div className={`relative rounded-2xl overflow-hidden border-2 ${cfg.border} transition-all duration-300`}
          style={{ aspectRatio: '1 / 1' }}>

          {/* Video feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera error fallback */}
          {cameraError && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
              <svg className="w-12 h-12 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <p className="text-sm text-muted text-center px-6">Camera access denied.<br/>Use manual entry below.</p>
            </div>
          )}

          {/* Corner brackets */}
          {(['tl','tr','bl','br'] as const).map(pos => (
            <div key={pos} className={`absolute w-8 h-8 pointer-events-none transition-colors duration-300
              ${pos === 'tl' ? 'top-4 left-4 border-t-2 border-l-2' : ''}
              ${pos === 'tr' ? 'top-4 right-4 border-t-2 border-r-2' : ''}
              ${pos === 'bl' ? 'bottom-4 left-4 border-b-2 border-l-2' : ''}
              ${pos === 'br' ? 'bottom-4 right-4 border-b-2 border-r-2' : ''}
              rounded-sm`}
              style={{ borderColor: cfg.corner }}
            />
          ))}

          {/* Scanning sweep line */}
          {status === 'scanning' && (
            <div className="absolute left-4 right-4 h-px bg-accent/70 shadow-[0_0_8px_2px_rgba(0,201,177,0.4)]"
              style={{ animation: 'sweep 2s ease-in-out infinite', top: '50%' }}
            />
          )}

          {/* Status flash overlay */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-green-500/10 flex flex-col items-center justify-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-green-400 text-lg">{attendee?.name}</p>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{attendee?.category}</span>
                <p className="text-xs text-muted mt-1">✓ Checked in successfully</p>
              </div>
            </div>
          )}

          {status === 'duplicate' && (
            <div className="absolute inset-0 bg-amber-500/10 flex flex-col items-center justify-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-amber-400 text-lg">{attendee?.name}</p>
                <p className="text-xs text-amber-400/70 mt-1">Already checked in at {attendee?.checkedInAt}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center gap-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-sm text-red-400 text-center">Invalid or unregistered QR code</p>
            </div>
          )}

          {/* Scanning label */}
          {status === 'scanning' && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent">Align QR code in frame</span>
              </div>
            </div>
          )}
        </div>

        {/* Torch + Manual entry buttons */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTorch}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all duration-200
              ${torchOn ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-muted hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6l-2 4h-4l-2 4h4l-2 6 8-10h-4l2-4z"/>
            </svg>
            {torchOn ? 'Torch On' : 'Torch'}
          </button>

          <button
            type="button"
            onClick={() => setShowManual(v => !v)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-muted hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Enter ID Manually
          </button>
        </div>

        {/* Manual entry input */}
        {showManual && (
          <div className="mt-3 flex gap-2">
            <input
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
              placeholder="e.g. KTBC-001"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted"
            />
            <button
              type="button"
              onClick={handleManualSubmit}
              className="ktbc-btn-primary px-4 py-2.5 rounded-lg text-sm"
            >
              Check In
            </button>
          </div>
        )}
      </div>

      {/* Sweep animation */}
      <style>{`
        @keyframes sweep {
          0%   { top: 15%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 85%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
      `}</style>
    </div>
  )
}