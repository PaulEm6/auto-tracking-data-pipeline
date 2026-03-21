import { useEffect, useRef } from "react";

{/* Hook to send video frames over a WebSocket connection */}
export function useFrameSender({ videoRef, wsRef, enabled, quality = 0.7 }) {
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");

    {/* Function to capture video frames and send them as JPEG blobs over WebSocket */}
    const tick = () => {
      const video = videoRef.current;
      const ws = wsRef.current;
      const canvas = canvasRef.current;

    {/* Check if video and WebSocket are ready, and if video has valid dimensions */}
      if (!video || !ws || ws.readyState !== WebSocket.OPEN || !video.videoWidth) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      {/* Convert the canvas content to a JPEG blob and send it over WebSocket as a binary byte*/}
      canvas.toBlob((blob) => {
        if (!blob || ws.readyState !== WebSocket.OPEN) return;
        blob.arrayBuffer().then((buffer) => {
          if (ws.readyState === WebSocket.OPEN) ws.send(buffer);
        });
      }, "image/jpeg", quality);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [enabled, quality, videoRef, wsRef]);
}