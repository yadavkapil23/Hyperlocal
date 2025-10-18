"""Enable PostGIS extension

Revision ID: 20251016_0000_enable_postgis
Revises: 
Create Date: 2025-01-16 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20251016_0000_enable_postgis'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable PostGIS extension
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')


def downgrade() -> None:
    # Disable PostGIS extension
    op.execute('DROP EXTENSION IF EXISTS postgis;')
