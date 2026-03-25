import { useEffect, useRef, useState } from "react";

/* Custom hook for managing a WebSocket connection to a face stream */
export function useFaceStreamSocket(url) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [metadata, setMetadata] = useState({ faces: [] });

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        setMetadata(JSON.parse(event.data));
      } catch {
        // ignore invalid payload
      }
    };

    return () => ws.close();
  }, [url]);

  return { wsRef, connected, metadata };
}