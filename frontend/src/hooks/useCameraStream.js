import { useEffect, useRef, useState } from 'react'

export function useCameraStream() {
  const streamRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    let isMounted = true

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = mediaStream
        setStream(mediaStream)

        if (!isMounted) {
          return
        }

        setIsCameraReady(true)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setCameraError(error instanceof Error ? error.message : 'Unable to open camera')
      }
    }

    startCamera()

    return () => {
      isMounted = false
      setIsCameraReady(false)

      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  return {
    stream,
    isCameraReady,
    cameraError,
  }
}
