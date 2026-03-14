import asyncio
import base64

import cv2
import uvicorn
from pathlib import Path
from fastapi import FastAPI, WebSocket
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from cv2 import VideoCapture

from capture_logic import configure_capture, capture_detect_and_encode

import logging

logger = logging.getLogger("uvicorn.error") 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code here
    logger.info("[AUTO-TRACKING-WEBAPP]: Starting up...")
    yield
    # Shutdown code here
    logger.info("[AUTO-TRACKING-WEBAPP]: Shutting down...")

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
    return {"message": "Hello World"}


#Use webocket to stream video frames and metadata to the frontend
@app.websocket("/stream")
async def stream_video(websocket: WebSocket):

    await websocket.accept()

    cap = configure_capture(cv2.VideoCapture(0, cv2.CAP_DSHOW))

    cascade_path = Path(cv2.__file__).parent.absolute() / "data/haarcascade_frontalface_default.xml"  
    logger.info(f'Using cascade file: {cascade_path}')
    clf = cv2.CascadeClassifier(str(cascade_path))

    while True:

        await asyncio.sleep(0.03)  # Limit to ~30 FPS

        # Logic for capturing frames, detecting faces, and sending encoded data to the frontend
        bounding_box_metadata, frame_b64 = capture_detect_and_encode(cap, clf)
        
        payload = {
            "frame": frame_b64,
            "metadata": bounding_box_metadata
        }

        await websocket.send_json(payload)     

if __name__ == "__main__":
    
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000
    )
