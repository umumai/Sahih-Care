from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routers.router import router


FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

app = FastAPI(title="Sahih Care API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix="/api")
# Same-origin frontend calls POST /verify at the root.
app.include_router(router)


@app.api_route("/", methods=["GET", "HEAD"])
def serve_index():
    index_path = FRONTEND_DIR / "index.html"
    if not index_path.exists():
        return {"ok": True, "message": "Sahih Care API is running. See /docs for the API."}
    return FileResponse(index_path)


# Mount static assets only if the frontend has actually been built next to
# this backend — keeps the API runnable standalone (e.g. for the Telegram
# bot, or API testing) without requiring a frontend/ directory to exist.
for mount_path, subdir in (("/css", "css"), ("/js", "js"), ("/ASSET", "ASSET")):
    asset_dir = FRONTEND_DIR / subdir
    if asset_dir.is_dir():
        app.mount(mount_path, StaticFiles(directory=asset_dir), name=subdir)
