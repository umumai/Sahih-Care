from google import genai

from app.config import GEMINI_API_KEY
from app.prompts.health_prompt import prompt_setup


client = genai.Client(
    api_key=GEMINI_API_KEY
)

chat = client.chats.create(
    model="gemini-3.6-flash"
)


def ask_gemini(question):
    try:
        response = chat.send_message(
            message=f"""
{prompt_setup}

User question:
{question}
"""
        )

        result = response.text.strip()

        # Ensure that it only accepts health questions
        if result == "NOT_HEALTH":
            message = "Sorry, I can only help with health-related questions."
        else:
            message = result

        print(message)
        return message

    # Error handling
    except Exception as e:
        print(f"Error: {e}")

        message = "Sorry, the health checking service is currently unavailable."

        print(message)
        return message