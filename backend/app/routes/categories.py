from flask import Blueprint, jsonify
from sqlalchemy import select

from ..db import get_db
from ..models import Category


categories_bp = Blueprint("categories", __name__)


@categories_bp.get("/categories")
def list_categories():
    with next(get_db()) as db:
        rows = db.execute(select(Category).order_by(Category.name)).scalars().all()
    return jsonify([
        {"id": c.id, "name": c.name, "slug": c.slug} for c in rows
    ])


