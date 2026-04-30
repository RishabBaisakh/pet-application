import json

import pytest
from django.http import HttpResponse
from django.test import RequestFactory

from posts_service.middleware.camelcase_middleware import (
    CamelCaseMiddleware,
    to_camel,
    to_snake,
)

pytestmark = pytest.mark.unit


class TestToSnake:
    def test_converts_camel_to_snake(self):
        assert to_snake({"mediaFileId": "abc", "petProfileId": "xyz"}) == {
            "media_file_id": "abc",
            "pet_profile_id": "xyz",
        }

    def test_handles_nested_dict(self):
        result = to_snake({"ownerProfile": {"userId": "abc"}})
        assert result == {"owner_profile": {"user_id": "abc"}}

    def test_handles_list(self):
        result = to_snake([{"mediaFileId": "a"}, {"mediaFileId": "b"}])
        assert result == [{"media_file_id": "a"}, {"media_file_id": "b"}]

    def test_already_snake_case_unchanged(self):
        assert to_snake({"content": "hello"}) == {"content": "hello"}


class TestToCamel:
    def test_converts_snake_to_camel(self):
        assert to_camel({"owner_profile_id": "123", "media_file_id": "abc"}) == {
            "ownerProfileId": "123",
            "mediaFileId": "abc",
        }

    def test_handles_nested_dict(self):
        result = to_camel({"post_media": {"media_file_id": "abc"}})
        assert result == {"postMedia": {"mediaFileId": "abc"}}


class TestCamelCaseMiddleware:
    def _make_middleware(self):
        return CamelCaseMiddleware(get_response=lambda r: None)

    def test_process_request_converts_body(self):
        factory = RequestFactory()
        request = factory.post(
            "/api/posts/",
            data=json.dumps({"mediaFileIds": ["abc"], "petProfileId": None}),
            content_type="application/json",
        )
        self._make_middleware().process_request(request)
        body = json.loads(request.body)
        assert body == {"media_file_ids": ["abc"], "pet_profile_id": None}

    def test_process_request_ignores_non_json(self):
        factory = RequestFactory()
        request = factory.post(
            "/api/posts/", data="plain text", content_type="text/plain"
        )
        result = self._make_middleware().process_request(request)
        assert result is None

    def test_process_response_converts_keys(self):
        factory = RequestFactory()
        request = factory.get("/api/posts/feed/")
        response = HttpResponse(
            content=json.dumps({"owner_profile_id": "123", "created_at": "now"}),
            content_type="application/json",
        )
        result = self._make_middleware().process_response(request, response)
        data = json.loads(result.content)
        assert "ownerProfileId" in data
        assert "createdAt" in data
