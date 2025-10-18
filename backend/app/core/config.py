import os


def get_database_url() -> str:
    url = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://thirdplace:thirdplace@db:5432/thirdplace",
    )
    # Convert postgresql:// to postgresql+psycopg:// for psycopg driver
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


