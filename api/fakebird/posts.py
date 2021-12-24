"""
Posts management blueprint.
"""

import json
import datetime

from bleach import clean
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, ValidationError, validator
from fakebird.db import PostModel, db

bp = Blueprint("posts", __name__, url_prefix="/api/posts")


class PostCreate(BaseModel):
    content: str

    @validator("content")
    def post_should_have_some_content(cls, value: str):
        if value.strip() == "":
            raise ValueError("Some content is required")
        return value.strip()


class PostDetail(BaseModel):
    uuid: str
    content: str
    created: datetime.datetime

    class Config:
        orm_mode = True


@bp.route("/", methods=["POST"])
def create_post():
    try:
        data = PostCreate.parse_obj(request.json)
        model = PostModel(content=clean(data.content, strip=True))
        db.session.add(model)
        db.session.commit()
        db.session.refresh(model)
        return (
            jsonify(json.loads(PostDetail.from_orm(model).json())),
            201,
        )
    except ValidationError as e:
        return jsonify({"errors": e.errors()}), 400


ROWS_PER_PAGE = 10


@bp.route("/", methods=["GET"])
def list_posts():
    page = request.args.get("page", 1, type=int)
    posts = PostModel.query.filter_by(deleted=False).order_by(PostModel.created.desc()).paginate(
        page, ROWS_PER_PAGE, False
    )

    return jsonify(
        {
            "posts": [
                json.loads(PostDetail.from_orm(post).json())
                for post in posts.items
            ],
            "has_next": posts.has_next,
            "has_prev": posts.has_prev,
            "next_num": posts.next_num,
            "prev_num": posts.prev_num,
        }
    )


@bp.route("/<uid>", methods=["GET"])
def get_post(uid):
    model = PostModel.query.filter_by(uuid=uid).first()
    if model.deleted:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(json.loads(PostDetail.from_orm(model).json()))


@bp.route("/<uid>", methods=["DELETE"])
def delete_post(uid):

    model = PostModel.query.filter_by(uuid=uid).first()
    if model.deleted:
        return jsonify({"message": "Post already deleted."}), 400
    model.deleted = True
    db.session.commit()
    return jsonify(json.loads(PostDetail.from_orm(model).json())), 200
