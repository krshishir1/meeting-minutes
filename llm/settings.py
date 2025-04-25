import os
from dotenv import load_dotenv

load_dotenv()

class Settings():
    app_name = "A2T"
    environment = "development"
    DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

