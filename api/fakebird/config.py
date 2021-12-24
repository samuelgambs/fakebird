from pydantic import BaseSettings, PostgresDsn


class Config(BaseSettings):
    SQLALCHEMY_DATABASE_URI: PostgresDsn
    APPLICATION_ERROR_RATE: float = 0
