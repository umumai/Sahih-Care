from fastapi import APIRouter

from app.routers.bulletin_router import router as bulletin_router
from app.routers.health_router import router as health_router

router = APIRouter()
router.include_router(health_router)
router.include_router(bulletin_router)
