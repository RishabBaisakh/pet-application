import pytest
from rest_framework import status

from constants import STATUS_ACTIVE
from tests.factories import OwnerProfileFactory, PetProfileFactory

pytestmark = pytest.mark.integration

ONBOARDING_URL = "/api/profile/onboarding-status/"


@pytest.mark.django_db
class TestOnboardingStatusView:
    def test_returns_401_when_unauthenticated(self, api_client):
        response = api_client.get(ONBOARDING_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_both_false_when_no_profiles_exist(self, authenticated_client):
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["owner_profile_completed"] is False
        assert response.data["pet_profile_completed"] is False

    def test_owner_false_when_profile_is_still_onboarding(
        self, authenticated_client, owner_profile
    ):
        # owner_profile fixture creates an ONBOARDING profile
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.data["owner_profile_completed"] is False

    def test_owner_true_when_profile_is_active(
        self, authenticated_client, active_owner_profile
    ):
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.data["owner_profile_completed"] is True

    def test_pet_false_when_no_pet_profile_exists(
        self, authenticated_client, active_owner_profile
    ):
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.data["pet_profile_completed"] is False

    def test_pet_false_when_pet_is_still_onboarding(
        self, authenticated_client, active_owner_profile
    ):
        PetProfileFactory(owner_profile=active_owner_profile)  # ONBOARDING status
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.data["pet_profile_completed"] is False

    def test_pet_true_when_pet_is_active(
        self, authenticated_client, active_owner_profile
    ):
        PetProfileFactory(
            owner_profile=active_owner_profile, name="Buddy", type="DOG"
        )  # auto-promotes to ACTIVE
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.data["pet_profile_completed"] is True

    def test_both_true_when_both_profiles_active(
        self, authenticated_client, active_owner_profile
    ):
        PetProfileFactory(owner_profile=active_owner_profile, name="Buddy", type="DOG")
        response = authenticated_client.get(ONBOARDING_URL)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["owner_profile_completed"] is True
        assert response.data["pet_profile_completed"] is True
