import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .routes.health import health_bp
from .routes.events import events_bp
from .routes.categories import categories_bp
from .routes.auth import auth_bp
from .routes.rsvp import rsvp_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
    JWTManager(app)

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(events_bp, url_prefix="/api")
    app.register_blueprint(categories_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(rsvp_bp, url_prefix="/api")

    return app


