import uuid

from django.db import models

from constants import (
    STATUS_ACTIVE,
    STATUS_CHOICES,
    VISIBILITY_PUBLIC,
    VISIBILITY_CHOICES,
)


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_profile_id = models.UUIDField(db_index=True)
    pet_profile_id = models.UUIDField(null=True, blank=True, db_index=True)
    content = models.TextField(blank=True, default="")
    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default=VISIBILITY_PUBLIC,
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "posts_service"
        ordering = ["-created_at"]

    def soft_delete(self):
        from constants import STATUS_DELETED

        self.status = STATUS_DELETED
        self.save(update_fields=["status", "updated_at"])


class PostMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="media")
    media_file_id = models.UUIDField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = "posts_service"
        ordering = ["order"]
