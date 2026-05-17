"""
Flask application factory for Camera Dashboard.
"""
import os
from flask import Flask


def create_app(config=None):
    """
    Create and configure the Flask application.

    Args:
        config (dict, optional): Configuration dictionary to apply to app.config.
                                 If not provided, defaults are used.

    Returns:
        Flask: Configured Flask app instance.
    """
    app = Flask(__name__)

    # Set default configuration
    app.config['TESTING'] = False
    app.config['SECRET_KEY'] = 'dev-secret-change-in-prod'
    app.config['DATABASE'] = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), '..', 'cameras.db'
    )

    # Apply provided config (overrides defaults)
    if config:
        app.config.update(config)

    # Initialize database
    from app.db import init_db, close_db
    with app.app_context():
        init_db()

    app.teardown_appcontext(close_db)

    # Initialize stream manager
    from app.streams.manager import StreamManager
    stream_manager = StreamManager()
    app.stream_manager = stream_manager

    # Start workers for all cameras in DB
    with app.app_context():
        from app.models.camera import Camera
        cameras = Camera.list()
        for camera in cameras:
            stream_manager.start(camera["id"], camera["rtsp_url"])

    # Register blueprints
    from app.routes.admin import admin_bp
    from app.routes.stream import stream_bp
    from app.routes.views import views_bp
    from app.routes.status import status_bp
    app.register_blueprint(admin_bp)
    app.register_blueprint(stream_bp)
    app.register_blueprint(views_bp)
    app.register_blueprint(status_bp)

    # Create and start retry loop
    from app.streams.retry import RetryLoop
    retry_loop = RetryLoop(stream_manager, interval=30)
    retry_loop.start()
    app.retry_loop = retry_loop

    return app
