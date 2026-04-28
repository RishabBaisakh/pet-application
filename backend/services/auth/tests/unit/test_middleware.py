import json

import pytest
from django.http import HttpResponse
from django.test import RequestFactory

from auth_service.middleware.camelcase_middleware import (
    CamelCaseMiddleware,
    to_camel,
    to_snake,
)

pytestmark = pytest.mark.unit


class TestToSnake:
    def test_converts_camel_to_snake(self):
        assert to_snake({"firstName": "John", "lastName": "Doe"}) == {
            "first_name": "John",
            "last_name": "Doe",
        }

    def test_handles_nested_dict(self):
        result = to_snake({"petProfile": {"ownerProfileId": "abc"}})
        assert result == {"pet_profile": {"owner_profile_id": "abc"}}

    def test_handles_list_of_dicts(self):
        result = to_snake([{"firstName": "A"}, {"firstName": "B"}])
        assert result == [{"first_name": "A"}, {"first_name": "B"}]

    def test_passthrough_scalar_values(self):
        assert to_snake("hello") == "hello"
        assert to_snake(42) == 42
        assert to_snake(None) is None

    def test_already_snake_case_unchanged(self):
        assert to_snake({"first_name": "John"}) == {"first_name": "John"}


class TestToCamel:
    def test_converts_snake_to_camel(self):
        assert to_camel({"first_name": "John", "last_name": "Doe"}) == {
            "firstName": "John",
            "lastName": "Doe",
        }

    def test_handles_nested_dict(self):
        result = to_camel({"pet_profile": {"owner_profile_id": "abc"}})
        assert result == {"petProfile": {"ownerProfileId": "abc"}}

    def test_handles_list_of_dicts(self):
        result = to_camel([{"first_name": "A"}, {"first_name": "B"}])
        assert result == [{"firstName": "A"}, {"firstName": "B"}]

    def test_passthrough_scalar_values(self):
        assert to_camel("hello") == "hello"
        assert to_camel(42) == 42


class TestCamelCaseMiddleware:
    def _make_middleware(self):
        return CamelCaseMiddleware(get_response=lambda r: None)

    def test_process_request_converts_camelcase_body(self):
        factory = RequestFactory()
        request = factory.post(
            "/api/auth/register/",
            data=json.dumps({"firstName": "John", "confirmPassword": "pass"}),
            content_type="application/json",
        )
        self._make_middleware().process_request(request)
        body = json.loads(request.body.decode("utf-8"))
        assert body == {"first_name": "John", "confirm_password": "pass"}

    def test_process_request_ignores_non_json_content_type(self):
        factory = RequestFactory()
        raw = b"field=value"
        request = factory.post(
            "/",
            data=raw,
            content_type="application/x-www-form-urlencoded",
        )
        self._make_middleware().process_request(request)
        # Body must be untouched
        assert request.body == raw

    def test_process_request_ignores_empty_body(self):
        factory = RequestFactory()
        request = factory.post("/", data=b"", content_type="application/json")
        # Should not raise
        self._make_middleware().process_request(request)

    def test_process_response_converts_snake_to_camel(self):
        factory = RequestFactory()
        request = factory.get("/api/auth/me/")
        response = HttpResponse(
            content=json.dumps({"first_name": "John", "last_name": "Doe"}),
            content_type="application/json",
        )
        result = self._make_middleware().process_response(request, response)
        assert json.loads(result.content) == {"firstName": "John", "lastName": "Doe"}

    def test_process_response_converts_nested_response(self):
        factory = RequestFactory()
        request = factory.get("/")
        response = HttpResponse(
            content=json.dumps({"owner_profile": {"user_id": "123"}}),
            content_type="application/json",
        )
        result = self._make_middleware().process_response(request, response)
        assert json.loads(result.content) == {"ownerProfile": {"userId": "123"}}

    def test_process_response_ignores_non_json_response(self):
        factory = RequestFactory()
        request = factory.get("/")
        response = HttpResponse(content=b"<html></html>", content_type="text/html")
        result = self._make_middleware().process_response(request, response)
        assert result.content == b"<html></html>"
