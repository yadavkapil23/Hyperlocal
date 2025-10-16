import os


def get_database_url() -> str:
    return os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://thirdplace:thirdplace@db:5432/thirdplace",
    )


