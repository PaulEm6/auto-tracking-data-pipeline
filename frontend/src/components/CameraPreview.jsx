import { useEffect, useRef } from 'react'

export default function CameraPreview({ title, stream, isCapturing }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.srcObject = stream ?? null

    if (stream) {
      video.play().catch(() => {})
    }
  }, [stream])

  return (
    <section className="flex flex-col rounded-2xl border border-blue-500/40 bg-slate-950/40 p-4 shadow-lg backdrop-blur">
      <h2 className="mb-3 text-lg font-medium text-blue-200">{title}</h2>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-blue-500/30 bg-blue-950">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

        {!isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-300/80">
            Capture paused
          </div>
        )}
      </div>
    </section>
  )
}
