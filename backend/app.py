import cv2
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from cv2 import VideoCapture

from capture_logic import configure_capture, capture_loop

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

@app.get("/health")
async def root():
    return {"message": "Hello World"}

@app.post("/start_capture")
async def start_capture():
    cap = configure_capture(cv2.VideoCapture(0, cv2.CAP_DSHOW))
    capture_loop(cap)
    return {"message": "Capture ended"}

if __name__ == "__main__":
    
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000
    )
