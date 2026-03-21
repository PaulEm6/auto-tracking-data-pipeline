export default function CaptureControls({ isCapturing, onToggle }) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {isCapturing ? 'Stop capture' : 'Start capture'}
      </button>
    </div>
  )
}
