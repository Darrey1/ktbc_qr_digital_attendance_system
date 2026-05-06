import React from 'react'

export default function Scanner(){
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-darkbg text-white">
      <div className="w-full max-w-3xl p-6">
        <div className="bg-black/60 rounded-lg p-6">
          <div className="h-[420px] bg-gradient-to-b from-black/40 to-black/20 rounded-lg border-2 border-accent/40 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted">Camera viewport placeholder — QR scanner would be here.</div>
            <div className="absolute top-4 right-4 bg-black/40 px-3 py-1 rounded">Checked In: <strong>1,243</strong> / 4,000</div>
          </div>
        </div>
      </div>
    </div>
  )
}
