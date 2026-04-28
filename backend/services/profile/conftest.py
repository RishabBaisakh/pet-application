import uuid

import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from tests.factories import OwnerProfileFactory, PetProfileFactory


def make_access_token(user_id: uuid.UUID) -> str:
    """Create a signed JWT access token carrying the given user_id claim.

    Uses JWTStatelessUserAuthentication — no User row required in the DB.
    """
    token = AccessToken()
    token["user_id"] = str(user_id)
    return str(token)


@pytest.fixture
def user_id():
    """A stable UUID that acts as the authenticated user's identity."""
    return uuid.uuid4()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(user_id):
    """APIClient pre-loaded with a valid Bearer token for *user_id*."""
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {make_access_token(user_id)}")
    return client


@pytest.fixture
def owner_profile(db, user_id):
    return OwnerProfileFactory(user_id=user_id)


@pytest.fixture
def active_owner_profile(db, user_id):
    """An owner profile that has already completed onboarding (ACTIVE)."""
    return OwnerProfileFactory(user_id=user_id, first_name="Jane", last_name="Doe")


@pytest.fixture
def pet_profile(db, owner_profile):
    return PetProfileFactory(owner_profile=owner_profile)


@pytest.fixture
def active_pet_profile(db, owner_profile):
    """A pet profile that has already completed onboarding (ACTIVE)."""
    return PetProfileFactory(owner_profile=owner_profile, name="Buddy", type="DOG")
