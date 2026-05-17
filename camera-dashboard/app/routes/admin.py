"""
Admin panel routes for camera management.
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.models.camera import Camera, ValidationError


admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/admin', methods=['GET'])
def admin_get():
    """
    Display the admin panel with camera list and add form.
    """
    cameras = Camera.list()
    return render_template('admin.html', cameras=cameras)


@admin_bp.route('/admin/add', methods=['POST'])
def admin_add():
    """
    Handle adding a new camera. Validates and persists.
    On validation error: re-render form with error message.
    On success: redirect to admin panel.
    """
    name = request.form.get('name', '').strip()
    ip = request.form.get('ip', '').strip()
    rtsp_url = request.form.get('rtsp_url', '').strip()
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()

    try:
        Camera.create(
            name=name,
            ip=ip,
            rtsp_url=rtsp_url,
            username=username,
            password=password
        )
        flash('Camera added successfully', 'success')
        return redirect(url_for('admin.admin_get'))
    except ValidationError as e:
        flash(str(e), 'error')
        cameras = Camera.list()
        return render_template('admin.html', cameras=cameras), 200


@admin_bp.route('/admin/edit/<int:camera_id>', methods=['POST'])
def admin_edit(camera_id):
    """
    Handle updating a camera. Validates and persists.
    On validation error: re-render form with error message.
    On success: redirect to admin panel.
    """
    camera = Camera.get(camera_id)
    if camera is None:
        return '', 404

    name = request.form.get('name', '').strip()
    ip = request.form.get('ip', '').strip()
    rtsp_url = request.form.get('rtsp_url', '').strip()
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()

    try:
        Camera.update(
            camera_id=camera_id,
            name=name,
            ip=ip,
            rtsp_url=rtsp_url,
            username=username,
            password=password
        )
        flash('Camera updated successfully', 'success')
        return redirect(url_for('admin.admin_get'))
    except ValidationError as e:
        flash(str(e), 'error')
        cameras = Camera.list()
        return render_template('admin.html', cameras=cameras), 200


@admin_bp.route('/admin/delete/<int:camera_id>', methods=['POST'])
def admin_delete(camera_id):
    """
    Handle deleting a camera.
    Returns 404 if camera not found.
    On success: redirect to admin panel.
    """
    camera = Camera.get(camera_id)
    if camera is None:
        return '', 404

    Camera.delete(camera_id)
    flash('Camera deleted successfully', 'success')
    return redirect(url_for('admin.admin_get'))
