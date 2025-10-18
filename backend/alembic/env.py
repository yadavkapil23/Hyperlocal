from __future__ import with_statement

from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Ensure project root is on sys.path so `import app` works when alembic runs
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app.db import Base
from app.models import *  # noqa: F401,F403


config = context.config

fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline():
    url = os.getenv(
        "DATABASE_URL",
        config.get_main_option("sqlalchemy.url"),
    )
    # Convert postgresql:// to postgresql+psycopg:// for psycopg driver
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    configuration = config.get_section(config.config_ini_section)
    url = os.getenv("DATABASE_URL", configuration["sqlalchemy.url"])
    # Convert postgresql:// to postgresql+psycopg:// for psycopg driver
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    configuration["sqlalchemy.url"] = url
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


