from fastapi import APIRouter

from app.schemas.bulletin import Bulletin
from app.services.bulletin_service import get_bulletins

router = APIRouter(tags=["bulletins"])


@router.get("/bulletins", response_model=list[Bulletin])
def list_bulletins() -> list[Bulletin]:
    return get_bulletins()
