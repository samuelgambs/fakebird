import pytest
from flask import Flask

from fakebird import create_app
from fakebird.config import Config
from fakebird.db import db, BaseModel


@pytest.fixture
def config() -> Config:
    return Config()


@pytest.fixture
def app(config: Config):
    return create_app(config)


@pytest.fixture
def client(app: Flask):
    app.config["TESTING"] = True
    with app.app_context():
        # Clean up the database before every test
        for table in reversed(BaseModel.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        with app.test_client() as client:
            yield client
        # And after every test
        for table in reversed(BaseModel.metadata.sorted_tables):
            db.session.execute(table.delete())
