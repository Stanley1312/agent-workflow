"""
Stream route: serves MJPEG streams for cameras via Flask blueprint.
"""
from flask import Blueprint, Response, current_app
import time

stream_bp = Blueprint("stream", __name__)

BOUNDARY = "frame"


@stream_bp.route("/stream/<int:camera_id>")
def stream(camera_id):
    """
    Serve an MJPEG stream for the given camera.
    Returns multipart/x-mixed-replace with JPEG frames.
    """

    app = current_app._get_current_object()

    def generate():
        while True:
            frame = app.stream_manager.get_frame(camera_id)
            if frame:
                chunk = (
                    b"--" + BOUNDARY.encode() + b"\r\n"
                    b"Content-Type: image/jpeg\r\n"
                    b"Content-Length: " + str(len(frame)).encode() + b"\r\n"
                    b"\r\n"
                    + frame
                    + b"\r\n"
                )
                yield chunk
            time.sleep(0.033)

    return Response(
        generate(),
        mimetype=f"multipart/x-mixed-replace; boundary={BOUNDARY}",
        status=200,
    )
