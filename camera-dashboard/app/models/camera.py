"""
Camera model with CRUD operations and validation.
"""
from app.db import get_db


class ValidationError(Exception):
    """Raised when camera data fails validation."""
    pass


class Camera:
    """Camera model with CRUD operations."""

    @staticmethod
    def create(name, ip, rtsp_url, username, password):
        """
        Create a new camera and persist it to the database.

        Validation:
        - rtsp_url must start with 'rtsp://'
        - name must be unique
        - cannot exceed 10 cameras total

        Args:
            name (str): Camera name
            ip (str): Camera IP address
            rtsp_url (str): RTSP URL for the camera stream
            username (str): Username for camera authentication
            password (str): Password for camera authentication

        Returns:
            dict: Camera record with id, name, ip, rtsp_url, username, password

        Raises:
            ValidationError: If validation fails
        """
        # Validate RTSP URL
        if not rtsp_url or not rtsp_url.startswith('rtsp://'):
            raise ValidationError("RTSP URL must start with 'rtsp://'")

        # Check max 10 cameras limit
        db = get_db()
        cursor = db.execute("SELECT COUNT(*) as count FROM cameras")
        count_row = cursor.fetchone()
        if count_row['count'] >= 10:
            raise ValidationError("Max 10 cameras allowed")

        # Check unique name
        cursor = db.execute("SELECT id FROM cameras WHERE name = ?", (name,))
        if cursor.fetchone() is not None:
            raise ValidationError("Camera name must be unique")

        # Insert camera
        cursor = db.execute(
            "INSERT INTO cameras (name, ip, rtsp_url, username, password) "
            "VALUES (?, ?, ?, ?, ?)",
            (name, ip, rtsp_url, username, password)
        )
        db.commit()

        # Return the created camera
        return Camera.get(cursor.lastrowid)

    @staticmethod
    def get(camera_id):
        """
        Retrieve a camera by id.

        Args:
            camera_id (int): Camera ID

        Returns:
            dict: Camera record, or None if not found
        """
        db = get_db()
        cursor = db.execute(
            "SELECT id, name, ip, rtsp_url, username, password FROM cameras WHERE id = ?",
            (camera_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    @staticmethod
    def list():
        """
        List all cameras.

        Returns:
            list: List of camera dicts
        """
        db = get_db()
        cursor = db.execute(
            "SELECT id, name, ip, rtsp_url, username, password FROM cameras ORDER BY id"
        )
        return [dict(row) for row in cursor.fetchall()]

    @staticmethod
    def update(camera_id, name, ip, rtsp_url, username, password):
        """
        Update a camera record.

        Validation:
        - rtsp_url must start with 'rtsp://'
        - name must remain unique (unless unchanged)

        Args:
            camera_id (int): Camera ID
            name (str): Camera name
            ip (str): Camera IP address
            rtsp_url (str): RTSP URL
            username (str): Username
            password (str): Password

        Returns:
            dict: Updated camera record, or None if camera not found

        Raises:
            ValidationError: If validation fails
        """
        # Validate RTSP URL
        if not rtsp_url or not rtsp_url.startswith('rtsp://'):
            raise ValidationError("RTSP URL must start with 'rtsp://'")

        # Check if camera exists
        existing = Camera.get(camera_id)
        if existing is None:
            return None

        # Check unique name (allow if same as current)
        if name != existing['name']:
            db = get_db()
            cursor = db.execute("SELECT id FROM cameras WHERE name = ?", (name,))
            if cursor.fetchone() is not None:
                raise ValidationError("Camera name must be unique")

        # Update camera
        db = get_db()
        db.execute(
            "UPDATE cameras SET name = ?, ip = ?, rtsp_url = ?, username = ?, password = ? "
            "WHERE id = ?",
            (name, ip, rtsp_url, username, password, camera_id)
        )
        db.commit()

        return Camera.get(camera_id)

    @staticmethod
    def delete(camera_id):
        """
        Delete a camera by id. Silent no-op if camera not found.

        Args:
            camera_id (int): Camera ID
        """
        db = get_db()
        db.execute("DELETE FROM cameras WHERE id = ?", (camera_id,))
        db.commit()
