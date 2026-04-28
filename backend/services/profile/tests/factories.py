import uuid

import factory

from profile_service.models import OwnerProfile, PetProfile
from constants import STATUS_ONBOARDING


class OwnerProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OwnerProfile

    user_id = factory.LazyFunction(uuid.uuid4)
    first_name = ""
    last_name = ""
    status = STATUS_ONBOARDING


class PetProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PetProfile

    owner_profile = factory.SubFactory(OwnerProfileFactory)
    name = ""
    type = ""
    status = STATUS_ONBOARDING
