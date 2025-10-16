import hashlib
from datetime import timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy import select

from ..db import get_db
from ..models import User, Profile


auth_bp = Blueprint("auth", __name__)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@auth_bp.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    display_name = data.get("display_name") or None
    if not email or not password:
        return jsonify({"detail": "email and password required"}), 400

    with next(get_db()) as db:
        existing = db.scalar(select(User).where(User.email == email))
        if existing:
            return jsonify({"detail": "email already registered"}), 400
        user = User(email=email, password_hash=hash_password(password))
        db.add(user)
        db.flush()
        db.add(Profile(user_id=user.id, display_name=display_name))
        db.commit()
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
        return jsonify({"access_token": token})


@auth_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    with next(get_db()) as db:
        user = db.scalar(select(User).where(User.email == email))
        if not user or user.password_hash != hash_password(password):
            return jsonify({"detail": "invalid credentials"}), 401
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
        return jsonify({"access_token": token})


@auth_bp.get("/me")
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    with next(get_db()) as db:
        user = db.scalar(select(User).where(User.id == uid))
        if not user:
            return jsonify({"detail": "not found"}), 404
        profile = user.profile
        return jsonify(
            {
                "id": user.id,
                "email": user.email,
                "display_name": profile.display_name if profile else None,
            }
        )


