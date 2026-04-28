import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories import UserFactory

pytestmark = pytest.mark.integration

REGISTER_URL = "/api/auth/register/"
LOGIN_URL = "/api/auth/login/"
REFRESH_URL = "/api/auth/token/refresh/"
LOGOUT_URL = "/api/auth/logout/"
ME_URL = "/api/auth/me/"


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestRegisterView:
    def test_register_returns_201_and_access_token(self, api_client):
        response = api_client.post(
            REGISTER_URL,
            {
                "email": "new@example.com",
                "password": "Str0ngPass123!",
                "confirm_password": "Str0ngPass123!",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert "access_token" in response.data
        assert response.data["user"]["email"] == "new@example.com"

    def test_register_duplicate_email_returns_400(self, api_client):
        UserFactory(email="taken@example.com")
        response = api_client.post(
            REGISTER_URL,
            {
                "email": "taken@example.com",
                "password": "Str0ngPass123!",
                "confirm_password": "Str0ngPass123!",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_weak_password_returns_400(self, api_client):
        response = api_client.post(
            REGISTER_URL,
            {
                "email": "weak@example.com",
                "password": "short",
                "confirm_password": "short",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestLoginView:
    def test_login_returns_200_and_access_token(self, user, api_client):
        response = api_client.post(
            LOGIN_URL,
            {"email": user.email, "password": "testpass123!"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_login_sets_refresh_token_cookie(self, user, api_client):
        response = api_client.post(
            LOGIN_URL,
            {"email": user.email, "password": "testpass123!"},
            format="json",
        )
        assert "refresh_token" in response.cookies

    def test_login_wrong_password_returns_401(self, user, api_client):
        response = api_client.post(
            LOGIN_URL,
            {"email": user.email, "password": "wrongpassword!"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_unknown_email_returns_401(self, api_client):
        response = api_client.post(
            LOGIN_URL,
            {"email": "ghost@example.com", "password": "Str0ngPass123!"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_fields_returns_400(self, api_client):
        response = api_client.post(LOGIN_URL, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Token Refresh
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestRefreshTokenView:
    def test_refresh_with_valid_cookie_returns_new_access_token(self, user):
        client = APIClient()
        login_resp = client.post(
            LOGIN_URL,
            {"email": user.email, "password": "testpass123!"},
            format="json",
        )
        assert login_resp.status_code == status.HTTP_200_OK

        refresh_resp = client.post(REFRESH_URL)
        assert refresh_resp.status_code == status.HTTP_200_OK
        assert "access_token" in refresh_resp.data

    def test_refresh_without_cookie_returns_400(self, api_client):
        response = api_client.post(REFRESH_URL)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_refresh_with_blacklisted_token_returns_401(self, user):
        refresh = RefreshToken.for_user(user)
        refresh_str = str(refresh)
        refresh.blacklist()

        client = APIClient()
        client.cookies["refresh_token"] = refresh_str

        response = client.post(REFRESH_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestLogoutView:
    def test_logout_requires_authentication(self, api_client):
        response = api_client.post(LOGOUT_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_blacklists_refresh_token(self, user):
        client = APIClient()
        login_resp = client.post(
            LOGIN_URL,
            {"email": user.email, "password": "testpass123!"},
            format="json",
        )
        access_token = login_resp.data["access"]
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        logout_resp = client.post(LOGOUT_URL)
        assert logout_resp.status_code == status.HTTP_200_OK

        # The blacklisted refresh token must now be rejected
        refresh_resp = client.post(REFRESH_URL)
        assert refresh_resp.status_code == status.HTTP_401_UNAUTHORIZED


# ---------------------------------------------------------------------------
# Me
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestMeView:
    def test_me_returns_user_data_when_authenticated(self, authenticated_client, user):
        response = authenticated_client.get(ME_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user.email

    def test_me_returns_401_when_unauthenticated(self, api_client):
        response = api_client.get(ME_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
