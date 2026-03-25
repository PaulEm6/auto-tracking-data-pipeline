
import base64
import logging
from dataclasses import dataclass
from logging import config
from pathlib import Path
import asyncio
import cv2
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def configure_capture(cap: cv2.VideoCapture) -> cv2.VideoCapture:
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    return cap

def classify_frame(
    frame: np.ndarray | None,
    clf: cv2.CascadeClassifier,
    *,
    scale_factor: float = 1.1,
    min_neighbors: int = 5,
    min_size: tuple[int, int] = (30, 30),
) -> dict[str, list[dict[str, int]]]:
    """
    Detect faces in a BGR image and return JSON-serializable metadata.
    Returns {"faces": []} if frame is missing or invalid.
    """

    if frame is None:
        logger.info("Empty frame received, returning empty detections")
        return {"faces": []}

    logger.info(f"Frame received, frame shape: {frame.shape}, dtype: {frame.dtype}") # DEBUGGING PURPOSES

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    detections = clf.detectMultiScale(
        gray,
        scaleFactor=scale_factor,
        minNeighbors=min_neighbors,
        minSize=min_size,
        flags=cv2.CASCADE_SCALE_IMAGE,
    )

    return {
        "faces": [
            {"x": int(x), "y": int(y), "w": int(w), "h": int(h)}
            for (x, y, w, h) in detections
        ]
    }

if __name__ == "__main__":
    print("Running capture loop...")