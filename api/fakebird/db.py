import datetime
import uuid
from typing import Any

from sqlalchemy.sql.sqltypes import Boolean

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import BIGINT, Column, DateTime, Unicode

db = SQLAlchemy()


BaseModel: Any = db.Model


def _uuid() -> str:
    return uuid.uuid4().hex


def _now() -> datetime.datetime:
    return datetime.datetime.now(tz=datetime.timezone.utc)


class PostModel(BaseModel):
    __tablename__ = "posts"

    _id = Column("id", BIGINT, primary_key=True)
    uuid = Column(Unicode(32), nullable=False, default=_uuid)
    created = Column(DateTime, nullable=False, default=_now)
    updated = Column(DateTime, nullable=False, default=_now, onupdate=_now)
    content = Column(Unicode, nullable=False)
    deleted = Column(Boolean, default=False)

    @classmethod
    def from_content(cls, content: str):
        return cls(content=content)
