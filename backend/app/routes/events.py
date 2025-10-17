from datetime import datetime
from typing import List

from flask import Blueprint, jsonify, request
from sqlalchemy import select, func, cast
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from geoalchemy2 import Geography, Geometry

from ..db import get_db
from ..models import Event, Category


events_bp = Blueprint("events", __name__)


@events_bp.get("/events")
def list_events():
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
    except (TypeError, ValueError):
        return jsonify({"detail": "lat and lon are required"}), 400

    radius_m = int(request.args.get("radius_m", 2000))
    radius_m = max(10, min(radius_m, 20000))
    limit = int(request.args.get("limit", 20))
    limit = max(1, min(limit, 100))
    offset = int(request.args.get("offset", 0))
    offset = max(0, offset)
    starts_after_str = request.args.get("starts_after")
    category_slug = request.args.get("category")

    starts_after: datetime | None = None
    if starts_after_str:
        try:
            starts_after = datetime.fromisoformat(starts_after_str.replace("Z", "+00:00"))
        except ValueError:
            return jsonify({"detail": "invalid starts_after datetime"}), 400

    point_geom = from_shape(Point(lon, lat), srid=4326)
    point_geog = cast(point_geom, Geography)
    # Use ST_Distance on geography (meters) and ensure both sides are geography
    distance_expr = func.ST_Distance(Event.location, point_geog).label("distance_m")
    within_expr = func.ST_DWithin(Event.location, point_geog, radius_m)
    # Provide latitude/longitude in response (cast geography -> geometry for ST_X/ST_Y)
    lat_expr = func.ST_Y(cast(Event.location, Geometry)).label("latitude")
    lon_expr = func.ST_X(cast(Event.location, Geometry)).label("longitude")

    results = []
    with next(get_db()) as db:  # type: Session
        # Always join Category so we can safely read slug without lazy loading
        base_stmt = (
            select(Event, distance_expr, Category.slug, lat_expr, lon_expr)
            .join(Category, Event.category_id == Category.id)
            .where(within_expr)
        )
        if starts_after is not None:
            base_stmt = base_stmt.where(Event.starts_at >= starts_after)
        if category_slug is not None:
            base_stmt = base_stmt.where(Category.slug == category_slug)
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total = db.scalar(count_stmt) or 0
        stmt = base_stmt.order_by(distance_expr, Event.starts_at).limit(limit).offset(offset)
        rows = db.execute(stmt).all()
        for event, distance_m, cat_slug, latitude, longitude in rows:
            results.append(
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "category": cat_slug,
                    "starts_at": event.starts_at.isoformat(),
                    "ends_at": event.ends_at.isoformat(),
                    "is_public": event.is_public,
                    "distance_m": float(distance_m) if distance_m is not None else None,
                    "latitude": float(latitude) if latitude is not None else None,
                    "longitude": float(longitude) if longitude is not None else None,
                }
            )

    return jsonify({
        "results": results,
        "total": int(total),
        "limit": limit,
        "offset": offset,
    })


@events_bp.post("/events")
def create_event():
    data = request.get_json(silent=True) or {}
    required = ["title", "category_slug", "starts_at", "ends_at", "latitude", "longitude"]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"detail": f"missing fields: {', '.join(missing)}"}), 400

    try:
        lat = float(data["latitude"])
        lon = float(data["longitude"])
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"detail": "invalid latitude/longitude"}), 400

    try:
        starts_at = datetime.fromisoformat(str(data["starts_at"]).replace("Z", "+00:00"))
        ends_at = datetime.fromisoformat(str(data["ends_at"]).replace("Z", "+00:00"))
    except ValueError:
        return jsonify({"detail": "invalid datetime format"}), 400

    with next(get_db()) as db:  # type: Session
        category = db.scalar(select(Category).where(Category.slug == data["category_slug"]))
        if category is None:
            return jsonify({"detail": "invalid category"}), 400

        location = from_shape(Point(lon, lat), srid=4326)
        event = Event(
            title=str(data["title"]),
            description=str(data.get("description") or ""),
            category_id=category.id,
            starts_at=starts_at,
            ends_at=ends_at,
            is_public=bool(data.get("is_public", True)),
            location=location,
        )
        db.add(event)
        db.commit()
        db.refresh(event)

        return (
            jsonify(
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "category": category.slug,
                    "starts_at": event.starts_at.isoformat(),
                    "ends_at": event.ends_at.isoformat(),
                    "is_public": event.is_public,
                }
            ),
            201,
        )


