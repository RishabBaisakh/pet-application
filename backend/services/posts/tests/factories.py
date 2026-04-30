import uuid

import factory

from posts_service.models import Post, PostMedia
from constants import STATUS_ACTIVE, VISIBILITY_PUBLIC


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    owner_profile_id = factory.LazyFunction(uuid.uuid4)
    pet_profile_id = None
    content = "A test post."
    visibility = VISIBILITY_PUBLIC
    status = STATUS_ACTIVE


class PostMediaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostMedia

    post = factory.SubFactory(PostFactory)
    media_file_id = factory.LazyFunction(uuid.uuid4)
    order = 0
