import uuid

import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from tests.factories import MediaFileFactory


def make_access_token(user_id: uuid.UUID | None = None) -> str:
    """Create a signed JWT access token.  Media views only check IsAuthenticated."""
    if user_id is None:
        user_id = uuid.uuid4()
    token = AccessToken()
    token["user_id"] = str(user_id)
    return str(token)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client():
    """APIClient pre-loaded with a valid Bearer token."""
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {make_access_token()}")
    return client


@pytest.fixture
def owner_profile_id():
    return uuid.uuid4()


@pytest.fixture
def media_file(db, owner_profile_id):
    return MediaFileFactory(owner_profile_id=owner_profile_id)
