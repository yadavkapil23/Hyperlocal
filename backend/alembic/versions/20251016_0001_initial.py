from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography


revision = "20251016_0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=64), nullable=False, unique=True),
        sa.Column("slug", sa.String(length=64), nullable=False, unique=True),
    )

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=140), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("location", Geography(geometry_type="POINT", srid=4326), nullable=False),
    )

    op.create_index("idx_events_starts_at", "events", ["starts_at"]) 


def downgrade() -> None:
    op.drop_index("idx_events_starts_at", table_name="events")
    op.drop_table("events")
    op.drop_table("categories")


