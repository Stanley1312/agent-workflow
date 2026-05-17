"""
Generate a "Camera offline" JPEG placeholder frame at import time.
"""
import cv2
import numpy as np

# Generate the placeholder frame once at import time
_img = np.zeros((480, 640, 3), dtype=np.uint8)
_font = cv2.FONT_HERSHEY_SIMPLEX
_text = "Camera Offline"
_font_scale = 2
_thickness = 3
_color = (255, 255, 255)  # white text

# Get text size to center it
_text_size = cv2.getTextSize(_text, _font, _font_scale, _thickness)[0]
_x = (640 - _text_size[0]) // 2
_y = (480 + _text_size[1]) // 2

cv2.putText(_img, _text, (_x, _y), _font, _font_scale, _color, _thickness)

# Encode to JPEG bytes
_success, _buffer = cv2.imencode(".jpg", _img)
assert _success, "Failed to encode placeholder frame"

PLACEHOLDER_FRAME: bytes = bytes(_buffer)
