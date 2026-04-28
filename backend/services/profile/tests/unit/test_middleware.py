import json

import pytest
from django.http import HttpResponse
from django.test import RequestFactory

from profile_service.middleware.camelcase_middleware import (
    CamelCaseMiddleware,
    to_camel,
    to_snake,
)

pytestmark = pytest.mark.unit


class TestToSnake:
    def test_converts_camel_to_snake(self):
        assert to_snake({"firstName": "Jane", "lastName": "Doe"}) == {
            "first_name": "Jane",
            "last_name": "Doe",
        }

    def test_handles_nested_dict(self):
        result = to_snake({"ownerProfile": {"userId": "abc"}})
        assert result == {"owner_profile": {"user_id": "abc"}}

    def test_handles_list(self):
        result = to_snake([{"petType": "DOG"}, {"petType": "CAT"}])
        assert result == [{"pet_type": "DOG"}, {"pet_type": "CAT"}]

    def test_already_snake_case_unchanged(self):
        assert to_snake({"first_name": "Jane"}) == {"first_name": "Jane"}


class TestToCamel:
    def test_converts_snake_to_camel(self):
        assert to_camel({"owner_profile_id": "123", "is_private": True}) == {
            "ownerProfileId": "123",
            "isPrivate": True,
        }

    def test_handles_nested_dict(self):
        result = to_camel({"pet_profile": {"owner_profile_id": "abc"}})
        assert result == {"petProfile": {"ownerProfileId": "abc"}}


class TestCamelCaseMiddleware:
    def _make_middleware(self):
        return CamelCaseMiddleware(get_response=lambda r: None)

    def test_process_request_converts_body(self):
        factory = RequestFactory()
        request = factory.patch(
            "/api/profile/owners/me/",
            data=json.dumps({"firstName": "Jane", "avatarUrl": "http://x.com/a.jpg"}),
            content_type="application/json",
        )
        self._make_middleware().process_request(request)
        body = json.loads(request.body)
        assert body == {"first_name": "Jane", "avatar_url": "http://x.com/a.jpg"}

    def test_process_response_converts_snake_to_camel(self):
        factory = RequestFactory()
        request = factory.get("/api/profile/onboarding-status/")
        response = HttpResponse(
            content=json.dumps(
                {
                    "owner_profile_completed": True,
                    "pet_profile_completed": False,
                }
            ),
            content_type="application/json",
        )
        result = self._make_middleware().process_response(request, response)
        payload = json.loads(result.content)
        assert payload == {
            "ownerProfileCompleted": True,
            "petProfileCompleted": False,
        }
