import uuid

import pytest
from rest_framework import status

from constants import STATUS_DELETED
from posts_service.models import Post
from tests.factories import PostFactory, PostMediaFactory

pytestmark = [pytest.mark.integration, pytest.mark.django_db]


class TestPostCreateView:
    def test_create_post_with_content(self, authenticated_client, owner_profile_id):
        response = authenticated_client.post(
            "/api/posts/",
            {"content": "Hello world"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["content"] == "Hello world"
        assert str(data["ownerProfileId"]) == str(owner_profile_id)

    def test_create_post_with_media(self, authenticated_client):
        media_id = str(uuid.uuid4())
        response = authenticated_client.post(
            "/api/posts/",
            {"mediaFileIds": [media_id]},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert len(data["media"]) == 1

    def test_create_post_requires_content_or_media(self, authenticated_client):
        response = authenticated_client.post("/api/posts/", {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_post_requires_authentication(self, api_client):
        response = api_client.post(
            "/api/posts/",
            {"content": "Hello"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestPostFeedView:
    def test_feed_returns_active_posts(self, authenticated_client, owner_profile_id):
        PostFactory(owner_profile_id=owner_profile_id)
        PostFactory(owner_profile_id=owner_profile_id)
        response = authenticated_client.get("/api/posts/feed/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()["results"]) >= 2

    def test_feed_excludes_deleted_posts(self, authenticated_client, owner_profile_id):
        post = PostFactory(owner_profile_id=owner_profile_id)
        post.soft_delete()
        response = authenticated_client.get("/api/posts/feed/")
        ids = [p["id"] for p in response.json()["results"]]
        assert str(post.id) not in ids

    def test_feed_requires_authentication(self, api_client):
        response = api_client.get("/api/posts/feed/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_feed_response_has_pagination_shape(self, authenticated_client):
        response = authenticated_client.get("/api/posts/feed/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "results" in data
        assert "next" in data
        assert "previous" in data

    def test_feed_next_cursor_is_null_when_results_fit_in_one_page(
        self, authenticated_client, owner_profile_id
    ):
        PostFactory.create_batch(3, owner_profile_id=owner_profile_id)
        response = authenticated_client.get("/api/posts/feed/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["next"] is None

    def test_feed_next_cursor_present_when_results_exceed_page_size(
        self, authenticated_client, owner_profile_id
    ):
        PostFactory.create_batch(21, owner_profile_id=owner_profile_id)
        response = authenticated_client.get("/api/posts/feed/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["results"]) == 20
        assert data["next"] is not None

    def test_feed_cursor_advances_to_next_page(
        self, authenticated_client, owner_profile_id
    ):
        PostFactory.create_batch(21, owner_profile_id=owner_profile_id)
        first_response = authenticated_client.get("/api/posts/feed/")
        assert first_response.status_code == status.HTTP_200_OK
        first_data = first_response.json()
        assert first_data["next"] is not None

        # Extract the cursor query param from the `next` URL and request page 2
        from urllib.parse import urlparse, parse_qs

        next_url = first_data["next"]
        cursor = parse_qs(urlparse(next_url).query)["cursor"][0]

        second_response = authenticated_client.get(f"/api/posts/feed/?cursor={cursor}")
        assert second_response.status_code == status.HTTP_200_OK
        second_data = second_response.json()
        assert len(second_data["results"]) == 1

        # No overlap between pages
        first_ids = {p["id"] for p in first_data["results"]}
        second_ids = {p["id"] for p in second_data["results"]}
        assert first_ids.isdisjoint(second_ids)


class TestPostDeleteView:
    def test_delete_own_post(self, authenticated_client, owner_profile_id):
        post = PostFactory(owner_profile_id=owner_profile_id)
        response = authenticated_client.delete(f"/api/posts/{post.id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        post.refresh_from_db()
        assert post.status == STATUS_DELETED

    def test_cannot_delete_another_users_post(self, authenticated_client):
        other_post = PostFactory(owner_profile_id=uuid.uuid4())
        response = authenticated_client.delete(f"/api/posts/{other_post.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_already_deleted_post_returns_404(
        self, authenticated_client, owner_profile_id
    ):
        post = PostFactory(owner_profile_id=owner_profile_id)
        post.soft_delete()
        response = authenticated_client.delete(f"/api/posts/{post.id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_requires_authentication(self, api_client):
        post = PostFactory()
        response = api_client.delete(f"/api/posts/{post.id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
