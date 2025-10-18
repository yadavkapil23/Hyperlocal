from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func, delete

from ..db import get_db
from ..models import Event, RSVP


rsvp_bp = Blueprint("rsvp", __name__)


@rsvp_bp.post("/events/<int:event_id>/rsvp")
@jwt_required()
def rsvp_event(event_id: int):
    uid = int(get_jwt_identity())
    with next(get_db()) as db:
        event = db.scalar(select(Event).where(Event.id == event_id))
        if not event:
            return jsonify({"detail": "event not found"}), 404
        existing = db.scalar(select(RSVP).where(RSVP.user_id == uid, RSVP.event_id == event_id))
        if existing:
            return jsonify({"detail": "already RSVPed"}), 400
        db.add(RSVP(user_id=uid, event_id=event_id, status="going"))
        db.commit()
        return jsonify({"status": "going"}), 201


@rsvp_bp.delete("/events/<int:event_id>/rsvp")
@jwt_required()
def unrsvp_event(event_id: int):
    uid = int(get_jwt_identity())
    with next(get_db()) as db:
        res = db.execute(
            delete(RSVP).where(RSVP.user_id == uid, RSVP.event_id == event_id)
        )
        if res.rowcount == 0:
            return jsonify({"detail": "not RSVPed"}), 404
        db.commit()
        return jsonify({"status": "removed"})


@rsvp_bp.get("/me/rsvps")
@jwt_required()
def my_rsvps():
    uid = int(get_jwt_identity())
    with next(get_db()) as db:
        rows = db.execute(
            select(RSVP.event_id, func.count().label("count"))
            .where(RSVP.user_id == uid)
            .group_by(RSVP.event_id)
        ).all()
    return jsonify([{"event_id": eid, "count": int(cnt)} for eid, cnt in rows])


