
import base64
from dataclasses import dataclass
from logging import config
from pathlib import Path
import asyncio
import cv2


def configure_capture(cap: cv2.VideoCapture) -> cv2.VideoCapture:
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    return cap

def capture_detect_and_encode(cap: cv2.VideoCapture, clf: cv2.CascadeClassifier):

    _, frame = cap.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = clf.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    bounding_box_metadata = {
        "faces": [
            {"x": int(x), "y": int(y), "w": int(w), "h": int(h)}
            for (x, y, w, h) in faces
        ]
    }

    _, buffer = cv2.imencode(".jpg", frame)

    frame_b64 = base64.b64encode(buffer).decode("utf-8")

    return bounding_box_metadata, frame_b64

if __name__ == "__main__":
    print("Running capture loop...")