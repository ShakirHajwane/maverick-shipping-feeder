import os
from pydantic_settings import BaseSettings, SettingsConfigDict

is_vercel = os.getenv("VERCEL") == "1"
default_db_url = "sqlite:////tmp/maritime_demo.db" if is_vercel else "sqlite:///./maritime_demo.db"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = os.getenv("DATABASE_URL", default_db_url)
    APP_NAME: str = "Maverick Shipping SMNK Feeder API"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:4200,http://127.0.0.1:4200,https://maverick-shipping.com,https://www.maverick-shipping.com",
    )

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
