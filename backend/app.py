import asyncio
import base64
import numpy as np
import cv2
import uvicorn
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from cv2 import VideoCapture

from capture_logic import configure_capture, classify_frame

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code here
    logger.debug("[AUTO-TRACKING-WEBAPP]: Starting up...")
    yield
    # Shutdown code here
    logger.debug("[AUTO-TRACKING-WEBAPP]: Shutting down...")

app = FastAPI(lifespan=lifespan)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic health check endpoint
@app.get("/health")
async def root():
    logger.debug("Health check endpoint called")
    return {"message": "Hello World"}


#Use webocket to stream video frames and metadata to the frontend
@app.websocket("/stream")
async def stream_video(websocket: WebSocket):

    await websocket.accept()
    cascade_path = Path(cv2.__file__).parent.absolute() / "data/haarcascade_frontalface_default.xml"  
    logger.debug(f'Using cascade file: {cascade_path}')
    clf = cv2.CascadeClassifier(str(cascade_path))

    while True:

        try:
            data = await websocket.receive_bytes()
        except WebSocketDisconnect as exc:
            logger.info("WebSocket disconnected during receive (code=%s)", exc.code)
            break

        if not data:
            logger.info("No data received, closing WebSocket")
            break

        #Convert bytes to np array to image
        img_array = np.frombuffer(data, dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        prediction_metadata = classify_frame(frame, clf)

        try:
            await websocket.send_json(prediction_metadata)
        except WebSocketDisconnect as exc:
            logger.info("WebSocket disconnected during send (code=%s)", exc.code)
            break
        except RuntimeError as exc:
            # Starlette raises RuntimeError if send is attempted after close.
            logger.info("WebSocket already closed before send: %s", exc)
            break

    logger.info("WebSocket stream handler exited cleanly")


if __name__ == "__main__":
    
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000,
        log_level="info",
        reload=False
    )
