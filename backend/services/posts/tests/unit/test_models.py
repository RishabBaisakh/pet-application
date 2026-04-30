import uuid

import pytest

from constants import STATUS_ACTIVE, STATUS_DELETED
from posts_service.models import Post
from tests.factories import PostFactory, PostMediaFactory

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


class TestPostModel:
    def test_default_status_is_active(self):
        post = PostFactory()
        assert post.status == STATUS_ACTIVE

    def test_soft_delete_sets_status_deleted(self):
        post = PostFactory()
        post.soft_delete()
        post.refresh_from_db()
        assert post.status == STATUS_DELETED

    def test_soft_delete_does_not_remove_row(self):
        post = PostFactory()
        post_id = post.id
        post.soft_delete()
        assert Post.objects.filter(id=post_id).exists()

    def test_default_visibility_is_public(self):
        post = PostFactory()
        assert post.visibility == "PUBLIC"

    def test_pet_profile_id_optional(self):
        post = PostFactory(pet_profile_id=None)
        assert post.pet_profile_id is None

    def test_owner_profile_id_stored(self):
        uid = uuid.uuid4()
        post = PostFactory(owner_profile_id=uid)
        assert post.owner_profile_id == uid


class TestPostMediaModel:
    def test_media_linked_to_post(self):
        post = PostFactory()
        media = PostMediaFactory(post=post)
        assert media.post == post

    def test_media_order_default_zero(self):
        media = PostMediaFactory()
        assert media.order == 0

    def test_multiple_media_ordered(self):
        post = PostFactory()
        m1 = PostMediaFactory(post=post, order=0)
        m2 = PostMediaFactory(post=post, order=1)
        ids = list(post.media.values_list("order", flat=True))
        assert ids == [0, 1]
