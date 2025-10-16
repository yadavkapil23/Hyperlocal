from alembic import op
import sqlalchemy as sa


revision = "20251016_0002_auth_rsvp"
down_revision = "20251016_0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("display_name", sa.String(length=80), nullable=True),
    )

    op.create_table(
        "rsvps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("event_id", sa.Integer(), sa.ForeignKey("events.id"), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default=sa.text("'going'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "event_id", name="uq_rsvp_user_event"),
    )


def downgrade() -> None:
    op.drop_table("rsvps")
    op.drop_table("profiles")
    op.drop_table("users")


