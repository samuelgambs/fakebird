import json

import sqlalchemy

from flask import Flask
from fakebird import posts
from fakebird.db import db
from fakebird.config import Config
from flask_migrate import Migrate

migrate = Migrate()

def create_app(config: Config = None):

    # Config the app
    if config is None:
        config = Config()

    app = Flask(__name__)
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config.from_mapping(json.loads(config.json()))

    # Init plugins
    db.init_app(app)


    migrate.init_app(app, db)


    # Register our blueprints
    app.register_blueprint(posts.bp)

    return app
