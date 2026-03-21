export default function StreamStatus({ isCameraReady, cameraError }) {
  const cameraLabel = isCameraReady ? 'Ready' : 'Waiting'

  return (
    <section className="rounded-2xl border border-blue-500/40 bg-slate-950/40 p-4 text-sm text-slate-200 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <p>Camera: <span className="font-semibold text-blue-200">{cameraLabel}</span></p>
      </div>

      {cameraError && <p className="mt-2 text-red-300">Camera error: {cameraError}</p>}
    </section>
  )
}
