import { useState } from 'react'
import './App.css'

function OriginalStream() {
  return (
      <section className="flex flex-col rounded-2xl border border-blue-500/40 bg-slate-950/40 p-4 shadow-lg backdrop-blur">
        <h2 className="mb-3 text-lg font-medium text-blue-200">Original Stream</h2>
        <div className="relative flex-1 overflow-hidden rounded-xl border border-blue-500/30 bg-blue-950">
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-300/80">
            {isCapturing ? 'Streaming original feed…' : 'Waiting for capture to start'}
          </div>
        </div>
      </section>
  )
}

function CroppedStream() {
  return (
      <section className="flex flex-col rounded-2xl border border-blue-500/40 bg-slate-950/40 p-4 shadow-lg backdrop-blur">
        <h2 className="mb-3 text-lg font-medium text-blue-200">Cropped / Tracked Stream</h2>
        <div className="relative flex-1 overflow-hidden rounded-xl border border-blue-500/30 bg-blue-950">
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-300/80">
            {isCapturing ? 'Streaming cropped output…' : 'Waiting for capture to start'}
          </div>
        </div>
      </section>
  )
}

function App() {
  const [isCapturing, setIsCapturing] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-sky-900 text-slate-100">
      {/* Code for header section with title and description */}
      <header className="flex flex-col gap-3 px-6 py-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Auto Tracking Demo</h1>
        <p className="text-slate-200/80">Two concurrent streams (original + cropped) with a single start control.</p>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-6 pb-10">
        <div className="flex-1 grid gap-6 lg:grid-cols-2">  
          {/* Code for original stream section with conditional text based on capture state */}
          <OriginalStream />
          {/* Code for cropped/tracked stream section with conditional text based on capture state */}
          <CroppedStream />
        </div>

        {/* Code for the start/stop capture button with dynamic text and styling */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsCapturing(prev => !prev)}
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isCapturing ? 'Stop capture' : 'Start capture'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
