import os
from pydantic_settings import BaseSettings

is_vercel = os.getenv("VERCEL") == "1"
default_db_url = "sqlite:////tmp/maritime_demo.db" if is_vercel else "sqlite:///./maritime_demo.db"

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", default_db_url)
    APP_NAME: str = "Maritime Feeder & Container Shipping API"
    API_V1_STR: str = "/api"

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

settings = Settings()
