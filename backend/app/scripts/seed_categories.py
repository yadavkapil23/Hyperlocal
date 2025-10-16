from sqlalchemy import select

from ..db import get_db
from ..models import Category


DEFAULT_CATEGORIES = [
    ("Sports", "sports"),
    ("Music", "music"),
    ("Books", "books"),
    ("Outdoors", "outdoors"),
    ("Tech", "tech"),
]


def main() -> None:
    with next(get_db()) as db:
        existing = {c.slug for c in db.execute(select(Category)).scalars()}
        for name, slug in DEFAULT_CATEGORIES:
            if slug in existing:
                continue
            db.add(Category(name=name, slug=slug))
        db.commit()


if __name__ == "__main__":
    main()


