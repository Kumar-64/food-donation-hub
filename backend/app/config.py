from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str = "https://nbvvvqcjzxittnzoxmbr.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "sb_publishable_Uf4P3fqsz-TKehZQ4l7ZQQ_zx0lMr-i"
    SUPABASE_DB_PASSWORD: str = "6A?ExURJY*f6yhd"

    # JWT (for backward compatibility / admin tokens)
    SECRET_KEY: str = "foodbridge-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
