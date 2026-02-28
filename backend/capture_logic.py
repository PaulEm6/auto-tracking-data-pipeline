
from dataclasses import dataclass
from logging import config
from pathlib import Path
import cv2


def configure_capture(cap: cv2.VideoCapture) -> cv2.VideoCapture:
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    return cap

def capture_loop(cap: cv2.VideoCapture):

    cascade_path = Path(cv2.__file__).parent.absolute() / "data/haarcascade_frontalface_default.xml"  
    print(f'Using cascade file: {cascade_path}')
    clf = cv2.CascadeClassifier(str(cascade_path))

    while True:

        _, frame = cap.read()

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = clf.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        cv2.imshow('Camera', frame)
        
        if cv2.waitKey(1) == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

    if __name__ == "__main__":
        print("Running capture loop...")