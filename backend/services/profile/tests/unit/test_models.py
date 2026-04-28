import pytest
from django.db import IntegrityError

from constants import STATUS_ACTIVE, STATUS_ONBOARDING
from profile_service.models import OwnerProfile, PetProfile
from tests.factories import OwnerProfileFactory, PetProfileFactory

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


class TestOwnerProfileModel:
    def test_status_promotes_to_active_when_both_names_set(self):
        profile = OwnerProfileFactory(first_name="Jane", last_name="Doe")
        assert profile.status == STATUS_ACTIVE

    def test_status_stays_onboarding_with_only_first_name(self):
        profile = OwnerProfileFactory(first_name="Jane", last_name="")
        assert profile.status == STATUS_ONBOARDING

    def test_status_stays_onboarding_with_only_last_name(self):
        profile = OwnerProfileFactory(first_name="", last_name="Doe")
        assert profile.status == STATUS_ONBOARDING

    def test_status_stays_onboarding_with_no_names(self):
        profile = OwnerProfileFactory()
        assert profile.status == STATUS_ONBOARDING

    def test_patch_to_active_on_save(self):
        profile = OwnerProfileFactory()
        assert profile.status == STATUS_ONBOARDING
        profile.first_name = "Jane"
        profile.last_name = "Doe"
        profile.save()
        profile.refresh_from_db()
        assert profile.status == STATUS_ACTIVE

    def test_already_active_stays_active(self):
        profile = OwnerProfileFactory(first_name="Jane", last_name="Doe")
        assert profile.status == STATUS_ACTIVE
        profile.save()
        profile.refresh_from_db()
        assert profile.status == STATUS_ACTIVE

    def test_user_id_is_unique(self):
        import uuid

        uid = uuid.uuid4()
        OwnerProfileFactory(user_id=uid)
        with pytest.raises(IntegrityError):
            OwnerProfileFactory(user_id=uid)


class TestPetProfileModel:
    def test_status_promotes_to_active_when_name_and_type_set(self):
        owner = OwnerProfileFactory()
        pet = PetProfileFactory(owner_profile=owner, name="Buddy", type="DOG")
        assert pet.status == STATUS_ACTIVE

    def test_status_stays_onboarding_with_only_name(self):
        owner = OwnerProfileFactory()
        pet = PetProfileFactory(owner_profile=owner, name="Buddy", type="")
        assert pet.status == STATUS_ONBOARDING

    def test_status_stays_onboarding_with_only_type(self):
        owner = OwnerProfileFactory()
        pet = PetProfileFactory(owner_profile=owner, name="", type="DOG")
        assert pet.status == STATUS_ONBOARDING

    def test_patch_to_active_on_save(self):
        owner = OwnerProfileFactory()
        pet = PetProfileFactory(owner_profile=owner)
        assert pet.status == STATUS_ONBOARDING
        pet.name = "Luna"
        pet.type = "CAT"
        pet.save()
        pet.refresh_from_db()
        assert pet.status == STATUS_ACTIVE

    def test_unique_onboarding_constraint_per_owner(self):
        """Only one ONBOARDING pet is allowed per owner at a time."""
        owner = OwnerProfileFactory()
        PetProfileFactory(owner_profile=owner)  # first ONBOARDING pet — OK
        with pytest.raises(IntegrityError):
            PetProfileFactory(owner_profile=owner)  # second ONBOARDING pet — violation

    def test_multiple_active_pets_allowed_per_owner(self):
        """The constraint only applies to ONBOARDING pets."""
        owner = OwnerProfileFactory()
        PetProfileFactory(owner_profile=owner, name="Buddy", type="DOG")
        PetProfileFactory(owner_profile=owner, name="Luna", type="CAT")
        assert PetProfile.objects.filter(owner_profile=owner).count() == 2
