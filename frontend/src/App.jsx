import { useState } from 'react'
import './App.css'

import CameraPreview from './components/CameraPreview'
import CaptureControls from './components/CaptureControls'
import StreamStatus from './components/StreamStatus'

import { useCameraStream } from './hooks/useCameraStream'
import { useFaceStreamSocket } from './hooks/useFaceStreamSocket'
import { useFrameSender } from './hooks/useFrameSender'

function App() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)

  const { stream, captureVideoRef, isCameraReady, cameraError } = useCameraStream()
  const { wsRef, connected , metadata } = useFaceStreamSocket('ws://localhost:8000/stream')
  
  useFrameSender({
    videoRef: captureVideoRef,
    wsRef,
    enabled: isCapturing,
    quality: 0.7,
  });
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-sky-900 text-slate-100">
      <video ref={captureVideoRef} autoPlay playsInline muted className="hidden" />

      <header className="flex flex-col gap-3 px-6 py-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Auto Tracking Demo</h1>
        <p className="text-slate-200/80">Local camera preview with side-by-side outputs and simple capture controls.</p>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <CameraPreview
            title="Live Camera (Raw)"
            stream={stream}
            isCapturing={isCapturing}
            isProcessed={false}
            metadata={metadata}
          />
          
          <CameraPreview
            title="Live Camera (Duplicate View)"
            stream={stream}
            isCapturing={isCapturing}
            isProcessed={true}
            metadata={metadata}
          />
        </div>

        <StreamStatus isCameraReady={isCameraReady} cameraError={cameraError} />

        <CaptureControls isCapturing={isCapturing} onToggle={() => setIsCapturing((prev) => !prev)} />
      </main>
    </div>
  )
}

export default App
