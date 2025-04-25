import os
from dotenv import load_dotenv

load_dotenv()

class Settings():
    app_name = "A2T"
    environment = "development"
    DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    # AWS settings
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET = os.getenv("S3_BUCKET")

