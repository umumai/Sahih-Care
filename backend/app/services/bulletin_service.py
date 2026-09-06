import json

from app.config import BULLETINS_PATH
from app.schemas.bulletin import Bulletin


def get_bulletins() -> list[Bulletin]:
    """Load bulletins from the static JSON file (MVP storage per the README).

    Swap this for a database read later without touching the router or schema.
    """
    if not BULLETINS_PATH.exists():
        return []

    try:
        raw = json.loads(BULLETINS_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"Failed to read bulletins from {BULLETINS_PATH}: {exc}")
        return []

    bulletins: list[Bulletin] = []
    for item in raw if isinstance(raw, list) else []:
        try:
            bulletins.append(Bulletin(**item))
        except Exception as exc:
            print(f"Skipping malformed bulletin entry {item!r}: {exc}")
    return bulletins
