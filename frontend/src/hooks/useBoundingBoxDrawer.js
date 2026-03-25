import { useEffect } from "react";

/**
 * Draws face bounding boxes onto a canvas overlay whenever metadata changes.
 *
 * @param {object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - overlay canvas
 * @param {React.RefObject<HTMLVideoElement>} params.videoRef  - source video (used for native resolution)
 * @param {{ faces: Array<{ x: number, y: number, w: number, h: number }> }} params.metadata
 */
export function useBoundingBoxDrawer({ canvasRef, videoRef, metadata }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    // Resize canvas to match the element's display dimensions
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const faces = metadata?.faces ?? [];
    if (!faces.length || !video.videoWidth) return;

    // Scale bounding-box coords from native video space to displayed canvas space
    const scaleX = canvas.width / video.videoWidth;
    const scaleY = canvas.height / video.videoHeight;

    ctx.strokeStyle = "#22ee74";
    ctx.lineWidth = 2;
    ctx.font = "11px monospace";
    ctx.fillStyle = "#22d3ee";

    for (const { x, y, w, h } of faces) {
      const dx = x * scaleX;
      const dy = y * scaleY;
      const dw = w * scaleX;
      const dh = h * scaleY;

      ctx.strokeRect(dx, dy, dw, dh);
      ctx.fillText("face", dx + 4, dy + 14);
    }
  }, [metadata, canvasRef, videoRef]);
}
