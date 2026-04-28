import uuid

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from constants import STATUS_ACTIVE, STATUS_ONBOARDING
from profile_service.models import PetProfile
from tests.factories import OwnerProfileFactory, PetProfileFactory

pytestmark = pytest.mark.integration

INIT_PET_URL = "/api/profile/init_pet_profile/"
PETS_URL = "/api/profile/pets/"


def pet_detail_url(pet_id):
    return f"/api/profile/pets/{pet_id}/"


@pytest.mark.django_db
class TestInitializePetView:
    def test_creates_pet_profile_returns_201(self, authenticated_client, owner_profile):
        response = authenticated_client.post(INIT_PET_URL)
        assert response.status_code == status.HTTP_201_CREATED
        assert PetProfile.objects.filter(owner_profile=owner_profile).exists()

    def test_returns_200_on_duplicate_call_idempotent(
        self, authenticated_client, owner_profile
    ):
        authenticated_client.post(INIT_PET_URL)
        response = authenticated_client.post(INIT_PET_URL)
        assert response.status_code == status.HTTP_200_OK
        assert PetProfile.objects.filter(owner_profile=owner_profile).count() == 1

    def test_returns_404_when_no_owner_profile(self, authenticated_client):
        """Cannot create pet without an owner profile."""
        response = authenticated_client.post(INIT_PET_URL)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_returns_401_when_unauthenticated(self, api_client):
        response = api_client.post(INIT_PET_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_new_pet_starts_with_onboarding_status(
        self, authenticated_client, owner_profile
    ):
        response = authenticated_client.post(INIT_PET_URL)
        assert response.data["status"] == STATUS_ONBOARDING


@pytest.mark.django_db
class TestPetProfileListCreate:
    def test_list_returns_only_authenticated_users_pets(
        self, authenticated_client, owner_profile, user_id
    ):
        # Own pets
        PetProfileFactory(owner_profile=owner_profile, name="Buddy", type="DOG")
        PetProfileFactory(owner_profile=owner_profile, name="Luna", type="CAT")
        # Another user's pet
        other_owner = OwnerProfileFactory()
        PetProfileFactory(owner_profile=other_owner, name="Max", type="DOG")

        response = authenticated_client.get(PETS_URL)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_list_returns_empty_when_no_pets(self, authenticated_client, owner_profile):
        response = authenticated_client.get(PETS_URL)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_list_returns_empty_when_no_owner_profile(self, authenticated_client):
        response = authenticated_client.get(PETS_URL)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_create_pet_returns_201(self, authenticated_client, active_owner_profile):
        response = authenticated_client.post(
            PETS_URL,
            {
                "name": "Rocky",
                "type": "DOG",
                "breed": "Beagle",
                "age": 2,
                "gender": "M",
                "city": "Vancouver",
                "province": "BC",
                "country": "CA",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED

    def test_create_pet_is_owned_by_authenticated_user(
        self, authenticated_client, active_owner_profile, user_id
    ):
        authenticated_client.post(
            PETS_URL, {"name": "Rocky", "type": "DOG"}, format="json"
        )
        pet = PetProfile.objects.get(owner_profile=active_owner_profile)
        assert str(pet.owner_profile.user_id) == str(user_id)

    def test_list_returns_401_when_unauthenticated(self, api_client):
        response = api_client.get(PETS_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestPetProfileDetail:
    def test_patch_with_name_and_type_promotes_status_to_active(
        self, authenticated_client, owner_profile, pet_profile
    ):
        assert pet_profile.status == STATUS_ONBOARDING
        response = authenticated_client.patch(
            pet_detail_url(pet_profile.id),
            {"name": "Buddy", "type": "DOG"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        pet_profile.refresh_from_db()
        assert pet_profile.status == STATUS_ACTIVE

    def test_patch_with_only_name_stays_onboarding(
        self, authenticated_client, owner_profile, pet_profile
    ):
        authenticated_client.patch(
            pet_detail_url(pet_profile.id),
            {"name": "Buddy"},
            format="json",
        )
        pet_profile.refresh_from_db()
        assert pet_profile.status == STATUS_ONBOARDING

    def test_delete_own_pet_returns_204(
        self, authenticated_client, owner_profile, pet_profile
    ):
        response = authenticated_client.delete(pet_detail_url(pet_profile.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not PetProfile.objects.filter(id=pet_profile.id).exists()

    def test_delete_other_users_pet_returns_404(
        self, authenticated_client, owner_profile
    ):
        """A user must not be able to delete another user's pet."""
        other_owner = OwnerProfileFactory()
        other_pet = PetProfileFactory(
            owner_profile=other_owner, name="NotMine", type="CAT"
        )
        response = authenticated_client.delete(pet_detail_url(other_pet.id))
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert PetProfile.objects.filter(id=other_pet.id).exists()

    def test_patch_returns_401_when_unauthenticated(
        self, api_client, owner_profile, pet_profile
    ):
        response = api_client.patch(
            pet_detail_url(pet_profile.id), {"name": "X"}, format="json"
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
