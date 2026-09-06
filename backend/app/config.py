import os
from pathlib import Path

from dotenv import load_dotenv

APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_DIR = BACKEND_DIR.parent

for env_path in (
    BACKEND_DIR / ".env",
    APP_DIR / ".env",
    PROJECT_DIR / ".env",
):
    load_dotenv(env_path, override=False)

load_dotenv(override=False)


def get_gemini_api_key() -> str:
    return (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
        or os.getenv("GOOGLE_GENAI_API_KEY")
        or ""
    ).strip()


def get_gemini_model() -> str:
    return (os.getenv("GEMINI_MODEL") or "gemini-3.6-flash").strip()


GEMINI_API_KEY = get_gemini_api_key()
GEMINI_MODEL = get_gemini_model()
