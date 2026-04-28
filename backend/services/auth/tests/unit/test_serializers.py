import pytest

from auth_service.serializers import RegisterSerializer, UserSerializer
from tests.factories import UserFactory

pytestmark = pytest.mark.unit


class TestRegisterSerializer:
    """Serializer-level validation — no network, most cases need no DB."""

    def test_password_too_short_is_invalid(self):
        data = {
            "email": "short@example.com",
            "password": "short",
            "confirm_password": "short",
        }
        s = RegisterSerializer(data=data)
        assert not s.is_valid()
        assert "password" in s.errors

    def test_passwords_mismatch_is_invalid(self):
        data = {
            "email": "mismatch@example.com",
            "password": "Str0ngPass123!",
            "confirm_password": "DifferentPass!",
        }
        s = RegisterSerializer(data=data)
        assert not s.is_valid()
        assert "confirm_password" in s.errors

    def test_common_password_is_invalid(self):
        # Django's CommonPasswordValidator rejects well-known passwords
        data = {
            "email": "common@example.com",
            "password": "password1234",
            "confirm_password": "password1234",
        }
        s = RegisterSerializer(data=data)
        assert not s.is_valid()

    def test_numeric_only_password_is_invalid(self):
        data = {
            "email": "numeric@example.com",
            "password": "1234567890",
            "confirm_password": "1234567890",
        }
        s = RegisterSerializer(data=data)
        assert not s.is_valid()

    @pytest.mark.django_db
    def test_valid_data_creates_user_with_hashed_password(self):
        data = {
            "email": "valid@example.com",
            "password": "Str0ngPass123!",
            "confirm_password": "Str0ngPass123!",
        }
        s = RegisterSerializer(data=data)
        assert s.is_valid(), s.errors
        user = s.save()
        assert user.check_password("Str0ngPass123!")
        assert user.password != "Str0ngPass123!"

    @pytest.mark.django_db
    def test_duplicate_email_is_invalid(self):
        UserFactory(email="dup@example.com")
        data = {
            "email": "dup@example.com",
            "password": "Str0ngPass123!",
            "confirm_password": "Str0ngPass123!",
        }
        s = RegisterSerializer(data=data)
        assert not s.is_valid()
        assert "email" in s.errors


class TestUserSerializer:
    def test_all_fields_are_read_only(self):
        """UserSerializer must not allow any field to be written."""
        meta = UserSerializer.Meta
        assert set(meta.read_only_fields) == set(meta.fields)
