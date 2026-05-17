"""
Views routes for grid and single camera views.
"""
from flask import Blueprint, render_template, abort
from app.models.camera import Camera

views_bp = Blueprint('views', __name__)


@views_bp.route('/', methods=['GET'])
def grid():
    """
    Display the camera grid view with all cameras.
    Queries all cameras and renders them as MJPEG tiles.
    """
    cameras = Camera.list()
    return render_template('grid.html', cameras=cameras)


@views_bp.route('/camera/<int:camera_id>', methods=['GET'])
def single_camera(camera_id):
    """
    Display a single camera in full-screen view.

    Args:
        camera_id (int): The ID of the camera to display

    Returns:
        Rendered single.html template with the camera

    Raises:
        404: If the camera does not exist
    """
    camera = Camera.get(camera_id)
    if camera is None:
        abort(404)
    return render_template('single.html', camera=camera)
