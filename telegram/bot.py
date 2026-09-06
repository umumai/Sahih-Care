import logging
import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from telegram.error import TelegramError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

PROJECT_DIR = Path(__file__).resolve().parents[1]
ENV_CANDIDATES = (
    PROJECT_DIR / "backend" / ".env",
    PROJECT_DIR / "backend" / "app" / ".env",
)

env_path = next((p for p in ENV_CANDIDATES if p.exists()), ENV_CANDIDATES[0])

if not env_path.exists():
    logger.error(f"Environment file not found. Tried: {', '.join(str(p) for p in ENV_CANDIDATES)}")
    raise RuntimeError("Environment file not found (expected backend/.env or backend/app/.env)")

load_dotenv(env_path)
logger.info(f"Loaded environment from {env_path}")

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "").strip()
if not TELEGRAM_TOKEN:
    logger.error("TELEGRAM_TOKEN is missing or empty in %s", env_path)
    raise RuntimeError(f"TELEGRAM_TOKEN is missing or empty from {env_path}")
logger.info("TELEGRAM_TOKEN loaded successfully")

# Point this at your deployed backend when you go live; defaults to local dev.
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000").rstrip("/")
logger.info(f"Backend URL configured as: {BACKEND_URL}")

VERDICT_EMOJI = {
    "VERIFIED": "\U0001F7E2",
    "FALSE": "\U0001F534",
    "MISLEADING": "\U0001F7E0",
    "UNVERIFIED": "\u26AA",
    "NOT_HEALTH": "\u2139\uFE0F",
}


def format_answer(answer: dict) -> str:
    emoji = VERDICT_EMOJI.get(answer.get("verdict", ""), "")
    lines = [f"{emoji} *{answer.get('verdict', 'UNVERIFIED')}*", "", answer.get("title", "")]
    if answer.get("summary"):
        lines.append(answer["summary"])
    if answer.get("details"):
        lines.append("")
        lines.append(answer["details"])
    sources = answer.get("sources") or []
    if sources:
        lines.append("")
        lines.append("Sources:")
        lines.extend(f"- {s.get('name', '')} {s.get('url', '')}".strip() for s in sources)
    return "\n".join(line for line in lines if line is not None)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        """
        Welcome to SahihCare!
Got a health claim that you're not sure about?
Send it here — paste it or forward the message, and I'll help you make sense of it.

    🟢 Verified
    🔴 False
    🟠 Misleading
    ⚪ Unverified

🔎 Just send the claim. I'll do the checking.

Powered by Gemini.

        """
    )


async def check_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.message.text
    await update.message.chat.send_action("typing")
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/health/check",
            json={"message": message, "language": "ms"},
            timeout=30,
        )
        response.raise_for_status()
        await update.message.reply_text(format_answer(response.json()), parse_mode="Markdown")
        logger.info(f"Successfully processed text check from user {update.effective_user.id}")
    except requests.RequestException as exc:
        logger.error(f"Backend call failed: {exc}", exc_info=True)
        await update.message.reply_text(
            "Sorry, I couldn't reach the checking service right now. Please try again shortly."
        )
    except Exception as exc:
        logger.error(f"Unexpected error in check_text: {exc}", exc_info=True)
        await update.message.reply_text(
            "An unexpected error occurred. Please try again later."
        )


async def check_image(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    photo = update.message.photo[-1]  # largest available size
    file = await photo.get_file()
    image_bytes = bytes(await file.download_as_bytearray())
    await update.message.chat.send_action("typing")
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/health/check-image",
            files={"image": ("photo.jpg", image_bytes, "image/jpeg")},
            data={"language": "ms"},
            timeout=30,
        )
        response.raise_for_status()
        await update.message.reply_text(format_answer(response.json()), parse_mode="Markdown")
        logger.info(f"Successfully processed image check from user {update.effective_user.id}")
    except requests.RequestException as exc:
        logger.error(f"Backend call failed for image: {exc}", exc_info=True)
        await update.message.reply_text(
            "Sorry, I couldn't reach the checking service right now. Please try again shortly."
        )
    except Exception as exc:
        logger.error(f"Unexpected error in check_image: {exc}", exc_info=True)
        await update.message.reply_text(
            "An unexpected error occurred. Please try again later."
        )


def main() -> None:
    logger.info("="*60)
    logger.info("Starting SahihCare Telegram Bot...")
    logger.info("="*60)
    
    try:
        # Step 1: Create application
        logger.info("Step 1: Initializing Telegram Application...")
        try:
            app = Application.builder().token(TELEGRAM_TOKEN).build()
            logger.info("✓ Application initialized successfully")
        except TelegramError as exc:
            logger.error(f"✗ Failed to initialize Application with provided token: {exc}", exc_info=True)
            raise RuntimeError("Failed to authenticate with Telegram. Please check your TELEGRAM_TOKEN.") from exc
        except Exception as exc:
            logger.error(f"✗ Unexpected error during Application initialization: {exc}", exc_info=True)
            raise
        
        # Step 2: Add handlers
        logger.info("Step 2: Adding command and message handlers...")
        try:
            app.add_handler(CommandHandler("start", start))
            logger.info("  ✓ Added /start command handler")
            app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, check_text))
            logger.info("  ✓ Added text message handler")
            app.add_handler(MessageHandler(filters.PHOTO, check_image))
            logger.info("  ✓ Added image/photo handler")
        except Exception as exc:
            logger.error(f"✗ Failed to add handlers: {exc}", exc_info=True)
            raise RuntimeError("Failed to configure bot handlers.") from exc
        
        # Step 3: Start polling
        logger.info("Step 3: Starting polling...")
        logger.info("="*60)
        logger.info("🤖 Bot is now running and listening for messages")
        logger.info("📍 Backend URL: " + BACKEND_URL)
        logger.info("Press Ctrl+C to stop the bot")
        logger.info("="*60)
        
        try:
            app.run_polling()
        except KeyboardInterrupt:
            logger.info("\n\nBot interrupted by user (Ctrl+C)")
            logger.info("Shutting down gracefully...")
        except TelegramError as exc:
            logger.error(f"✗ Telegram polling error: {exc}", exc_info=True)
            raise
        except Exception as exc:
            logger.error(f"✗ Unexpected error during polling: {exc}", exc_info=True)
            raise
            
    except RuntimeError as exc:
        logger.critical(f"Bot startup failed: {exc}")
        raise SystemExit(1) from exc
    except Exception as exc:
        logger.critical(f"Critical error in bot startup: {exc}", exc_info=True)
        raise SystemExit(1) from exc
    finally:
        logger.info("Bot shutdown complete")


if __name__ == "__main__":
    main()