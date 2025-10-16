from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class EventCreate(BaseModel):
    title: str = Field(max_length=140)
    description: str | None = None
    category_slug: str
    starts_at: datetime
    ends_at: datetime
    is_public: bool = True
    latitude: float
    longitude: float

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90 <= v <= 90):
            raise ValueError("latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180 <= v <= 180):
            raise ValueError("longitude must be between -180 and 180")
        return v


class EventOut(BaseModel):
    id: int
    title: str
    description: str | None
    category: str
    starts_at: datetime
    ends_at: datetime
    is_public: bool
    distance_m: float | None = None

    class Config:
        from_attributes = True


