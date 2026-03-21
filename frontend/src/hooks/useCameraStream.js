import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const streamRef = useRef(null);
  const captureVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!isMounted) return;

        streamRef.current = mediaStream;
        setStream(mediaStream);

        // Attach stream to real hidden video element ref
        if (captureVideoRef.current) {
          captureVideoRef.current.srcObject = mediaStream;
          await captureVideoRef.current.play();
        }

        setIsCameraReady(true);
      } catch (error) {
        if (!isMounted) return;
        setCameraError(error instanceof Error ? error.message : "Unable to open camera");
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      setIsCameraReady(false);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);

      if (captureVideoRef.current) {
        captureVideoRef.current.srcObject = null;
      }
    };
  }, []);

  return {
    stream,
    captureVideoRef, // return this
    isCameraReady,
    cameraError,
  };
}