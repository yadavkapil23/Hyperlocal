from datetime import datetime

from geoalchemy2 import Geography
from sqlalchemy import DateTime, Integer, Boolean, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)

    events: Mapped[list["Event"]] = relationship("Event", back_populates="category")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(140), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Geography(Point, 4326) for distance queries in meters
    location: Mapped[bytes] = mapped_column(Geography(geometry_type="POINT", srid=4326), nullable=False)

    category: Mapped[Category] = relationship("Category", back_populates="events")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    profile: Mapped["Profile"] = relationship("Profile", back_populates="user", uselist=False)
    rsvps: Mapped[list["RSVP"]] = relationship("RSVP", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    display_name: Mapped[str | None] = mapped_column(String(80))

    user: Mapped[User] = relationship("User", back_populates="profile")


class RSVP(Base):
    __tablename__ = "rsvps"
    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_rsvp_user_event"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="going")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user: Mapped[User] = relationship("User", back_populates="rsvps")
    event: Mapped[Event] = relationship("Event", backref="rsvps")


