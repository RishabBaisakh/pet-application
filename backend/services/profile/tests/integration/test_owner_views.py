import pytest
from rest_framework import status

from constants import STATUS_ACTIVE, STATUS_ONBOARDING
from profile_service.models import OwnerProfile
from tests.factories import OwnerProfileFactory

pytestmark = pytest.mark.integration

INIT_URL = "/api/profile/init_owner_profile/"
ME_URL = "/api/profile/owners/me/"


@pytest.mark.django_db
class TestInitializeOwnerView:
    def test_creates_owner_profile_returns_201(self, authenticated_client, user_id):
        response = authenticated_client.post(INIT_URL)
        assert response.status_code == status.HTTP_201_CREATED
        assert OwnerProfile.objects.filter(user_id=user_id).exists()

    def test_returns_200_on_duplicate_call_idempotent(
        self, authenticated_client, user_id
    ):
        authenticated_client.post(INIT_URL)
        response = authenticated_client.post(INIT_URL)
        assert response.status_code == status.HTTP_200_OK
        assert OwnerProfile.objects.filter(user_id=user_id).count() == 1

    def test_returns_401_when_unauthenticated(self, api_client):
        response = api_client.post(INIT_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_response_includes_id_and_status(self, authenticated_client):
        response = authenticated_client.post(INIT_URL)
        assert "id" in response.data
        assert "status" in response.data
        assert response.data["status"] == STATUS_ONBOARDING


@pytest.mark.django_db
class TestOwnerProfileMeView:
    def test_get_returns_owner_profile(self, authenticated_client, owner_profile):
        response = authenticated_client.get(ME_URL)
        assert response.status_code == status.HTTP_200_OK
        assert str(response.data["id"]) == str(owner_profile.id)

    def test_get_returns_404_when_profile_not_initialized(self, authenticated_client):
        response = authenticated_client.get(ME_URL)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_returns_401_when_unauthenticated(self, api_client):
        response = api_client.get(ME_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_patch_updates_profile_fields(self, authenticated_client, owner_profile):
        response = authenticated_client.patch(
            ME_URL,
            {"first_name": "Updated", "last_name": "Name", "bio": "New bio"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        owner_profile.refresh_from_db()
        assert owner_profile.first_name == "Updated"
        assert owner_profile.last_name == "Name"

    def test_patch_with_both_names_promotes_status_to_active(
        self, authenticated_client, owner_profile
    ):
        assert owner_profile.status == STATUS_ONBOARDING
        authenticated_client.patch(
            ME_URL,
            {"first_name": "Jane", "last_name": "Doe"},
            format="json",
        )
        owner_profile.refresh_from_db()
        assert owner_profile.status == STATUS_ACTIVE

    def test_patch_with_only_first_name_stays_onboarding(
        self, authenticated_client, owner_profile
    ):
        authenticated_client.patch(
            ME_URL,
            {"first_name": "Jane"},
            format="json",
        )
        owner_profile.refresh_from_db()
        assert owner_profile.status == STATUS_ONBOARDING

    def test_patch_cannot_overwrite_status_directly(
        self, authenticated_client, owner_profile
    ):
        """The client must not be able to manually flip status to ACTIVE."""
        authenticated_client.patch(
            ME_URL,
            {"status": "ACTIVE"},
            format="json",
        )
        owner_profile.refresh_from_db()
        # status field is read-only — no names set so still ONBOARDING
        assert owner_profile.status == STATUS_ONBOARDING
