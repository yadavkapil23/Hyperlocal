import os
from flask import Flask, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .routes.health import health_bp
from .routes.events import events_bp
from .routes.categories import categories_bp
from .routes.auth import auth_bp
from .routes.rsvp import rsvp_bp


def create_app() -> Flask:
    app = Flask(__name__)
    # Allow all origins for production deployment
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*"  # Allow all origins in production
            }
        },
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
    JWTManager(app)

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(events_bp, url_prefix="/api")
    app.register_blueprint(categories_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(rsvp_bp, url_prefix="/api")

    # Serve React frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve React frontend for all non-API routes"""
        # If it's an API route, let Flask handle it normally
        if path.startswith('api/'):
            return None
        
        # Build path to frontend dist directory
        frontend_path = os.path.join('/app', 'frontend', 'dist')
        
        # If path is empty or just '/', serve index.html
        if not path or path == '/':
            return send_file(os.path.join(frontend_path, 'index.html'))
        
        # Try to serve the requested file
        try:
            return send_from_directory(frontend_path, path)
        except:
            # If file doesn't exist, serve index.html (for client-side routing)
            return send_file(os.path.join(frontend_path, 'index.html'))

    return app


