import uuid

import pytest

from posts_service.serializers import CreatePostSerializer, PostSerializer
from tests.factories import PostFactory, PostMediaFactory

pytestmark = pytest.mark.unit


class TestCreatePostSerializer:
    def test_valid_with_content_only(self):
        s = CreatePostSerializer(data={"content": "Hello world"})
        assert s.is_valid(), s.errors

    def test_valid_with_media_only(self):
        s = CreatePostSerializer(data={"media_file_ids": [str(uuid.uuid4())]})
        assert s.is_valid(), s.errors

    def test_valid_with_content_and_media(self):
        s = CreatePostSerializer(
            data={
                "content": "Hello",
                "media_file_ids": [str(uuid.uuid4())],
            }
        )
        assert s.is_valid(), s.errors

    def test_invalid_with_neither_content_nor_media(self):
        s = CreatePostSerializer(data={})
        assert not s.is_valid()
        assert "non_field_errors" in s.errors

    def test_invalid_with_blank_content_and_no_media(self):
        s = CreatePostSerializer(data={"content": ""})
        assert not s.is_valid()

    def test_default_visibility_is_public(self):
        s = CreatePostSerializer(data={"content": "Hi"})
        s.is_valid()
        assert s.validated_data["visibility"] == "PUBLIC"

    def test_visibility_choices(self):
        for choice in ("PUBLIC", "FRIENDS", "PRIVATE"):
            s = CreatePostSerializer(data={"content": "Hi", "visibility": choice})
            assert s.is_valid(), s.errors

    def test_invalid_visibility(self):
        s = CreatePostSerializer(data={"content": "Hi", "visibility": "INVALID"})
        assert not s.is_valid()


class TestPostSerializer:
    @pytest.mark.django_db
    def test_serializes_post_fields(self):
        post = PostFactory()
        s = PostSerializer(post)
        data = s.data
        assert "id" in data
        assert "ownerProfileId" not in data  # raw serializer returns snake_case
        assert "owner_profile_id" in data
        assert data["content"] == post.content

    @pytest.mark.django_db
    def test_includes_nested_media(self):
        post = PostFactory()
        PostMediaFactory(post=post, order=0)
        PostMediaFactory(post=post, order=1)
        s = PostSerializer(post)
        assert len(s.data["media"]) == 2
