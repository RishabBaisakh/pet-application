import pytest
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.unit

User = get_user_model()


@pytest.mark.django_db
class TestUserManager:
    def test_create_user_hashes_password(self):
        user = User.objects.create_user("hash@example.com", "testpass123!")
        assert user.check_password("testpass123!")
        assert user.password != "testpass123!"

    def test_create_user_normalizes_email(self):
        user = User.objects.create_user("UPPER@EXAMPLE.COM", "testpass123!")
        assert user.email == "upper@example.com"

    def test_create_user_requires_email(self):
        with pytest.raises(ValueError, match="email"):
            User.objects.create_user("", "testpass123!")

    def test_create_superuser_sets_is_staff_and_role(self):
        user = User.objects.create_superuser("admin@example.com", "Admin1pass!")
        assert user.is_staff is True
        assert user.role == "admin"
        assert user.is_superuser is True

    def test_create_superuser_rejects_non_admin_role(self):
        with pytest.raises(ValueError, match="role=admin"):
            User.objects.create_superuser(
                "admin2@example.com", "Admin1pass!", role="owner"
            )


@pytest.mark.django_db
class TestUserModel:
    def test_str_returns_email(self):
        user = User.objects.create_user("str@example.com", "testpass123!")
        assert str(user) == "str@example.com"

    def test_id_is_uuid(self):
        import uuid

        user = User.objects.create_user("uuid@example.com", "testpass123!")
        assert isinstance(user.id, uuid.UUID)

    def test_default_role_is_owner(self):
        user = User.objects.create_user("role@example.com", "testpass123!")
        assert user.role == "owner"

    def test_default_is_verified_false(self):
        user = User.objects.create_user("verify@example.com", "testpass123!")
        assert user.is_verified is False
