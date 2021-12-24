import pytest


def test_list_empty_posts(client):
    response = client.get("/api/posts/")
    assert response.status_code == 200
    assert response.json == {"posts": []}


def test_create_a_new_post(client):
    content = "here we gooooo"
    response = client.post(
        "/api/posts/",
        json={
            "content": content,
        },
    )
    assert response.status_code == 201
    assert "uuid" in response.json
    assert response.json["content"] == content


def test_create_a_new_post_with_no_content(client):
    response = client.post(
        "/api/posts/",
        json={},
    )
    assert response.status_code == 400
    assert "errors" in response.json


def test_create_a_post_with_empty_content(client):
    response = client.post(
        "/api/posts/",
        json={"content": ""},
    )
    assert response.status_code == 400
    assert "errors" in response.json


@pytest.mark.parametrize(
    "content,expected",
    [
        ("<span>Hello there", "Hello there"),
        ("<span>Hello there</span>", "Hello there"),
    ],
)
def test_content_is_cleaned_up(client, content, expected):
    response = client.post(
        "/api/posts/",
        json={
            "content": content,
        },
    )
    assert response.status_code == 201
    assert "uuid" in response.json
    assert response.json["content"] == expected


def test_get_recently_created_post(client):
    create_response = client.post(
        "/api/posts/",
        json={
            "content": "totally real content",
        },
    )
    uuid = create_response.json["uuid"]
    get_response = client.get(f"/api/posts/{uuid}")
    assert get_response.status_code == 200
    assert get_response.json == create_response.json


def test_list_recently_created_posts(client):
    create_response = client.post(
        "/api/posts/",
        json={
            "content": "totally real content",
        },
    )
    list_response = client.get(f"/api/posts/")
    assert list_response.status_code == 200
    assert "posts" in list_response.json
    assert list_response.json["posts"] == [create_response.json]


def test_only_latest_10_posts_are_shown(client):
    for i in range(11):
        client.post(
            "/api/posts/",
            json={
                "content": f"totally real content {i}",
            },
        )
    list_response = client.get(f"/api/posts/")
    assert list_response.status_code == 200
    assert "posts" in list_response.json
    assert len(list_response.json["posts"]) == 10
