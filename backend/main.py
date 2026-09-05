# from fastapi import FastAPI

# from app.routers.router import router


# app = FastAPI(title="Sahih Care API")
# app.include_router(router, prefix="/api")

from app.services.gemini_service import ask_gemini


message = ask_gemini(
    "Malaysia have 1000000 corona case today"
)