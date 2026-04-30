import uuid

import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from tests.factories import PostFactory


def make_access_token(owner_profile_id: uuid.UUID | None = None) -> str:
    """Create a signed JWT access token carrying the given owner_profile_id claim."""
    if owner_profile_id is None:
        owner_profile_id = uuid.uuid4()
    token = AccessToken()
    token["user_id"] = str(owner_profile_id)
    return str(token)


@pytest.fixture
def owner_profile_id():
    """A stable UUID that acts as the authenticated user's owner profile identity."""
    return uuid.uuid4()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(owner_profile_id):
    """APIClient pre-loaded with a valid Bearer token for *owner_profile_id*."""
    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {make_access_token(owner_profile_id)}"
    )
    return client


@pytest.fixture
def post(db, owner_profile_id):
    return PostFactory(owner_profile_id=owner_profile_id)
