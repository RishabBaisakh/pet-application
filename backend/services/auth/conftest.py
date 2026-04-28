import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories import UserFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return UserFactory()


@pytest.fixture
def authenticated_client(db, user):
    """APIClient with a valid JWT access token for the test user."""
    refresh = RefreshToken.for_user(user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client


@pytest.fixture
def refresh_token_str(db, user):
    """A valid serialised refresh token string for the test user."""
    refresh = RefreshToken.for_user(user)
    return str(refresh)
