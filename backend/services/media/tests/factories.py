import uuid

import factory

from media_service.models import MediaFile
from constants import STATUS_PENDING, SERVICE_TYPE_PROFILE


class MediaFileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MediaFile

    service_type = SERVICE_TYPE_PROFILE
    owner_profile_id = factory.LazyFunction(uuid.uuid4)
    status = STATUS_PENDING
    original_filename = "test.jpg"
    content_type = "image/jpeg"
    file = factory.LazyAttribute(
        lambda obj: f"media/PROFILE/{obj.owner_profile_id}/owner/test.jpg"
    )
