"""
Status route: GET /status returns JSON map of camera_id -> "up" | "down"
"""
from flask import Blueprint, jsonify, current_app
from app.models.camera import Camera

status_bp = Blueprint('status', __name__)


@status_bp.route('/status', methods=['GET'])
def get_status():
    """
    Return JSON map of all cameras and their status.

    Returns:
        JSON: {
            "camera_id_1": "up" or "down",
            "camera_id_2": "up" or "down",
            ...
        }
        Returns {} if no cameras exist.
    """
    cameras = Camera.list()

    status_map = {}
    for camera in cameras:
        camera_id = str(camera['id'])
        is_offline = current_app.stream_manager.is_offline(camera_id)
        status_map[camera_id] = "down" if is_offline else "up"

    return jsonify(status_map)
