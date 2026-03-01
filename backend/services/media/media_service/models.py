import uuid
from django.db import models
from django.utils.deconstruct import deconstructible

# Allowed service types
SERVICE_TYPES = [
    ("profile", "Profile images"),
    ("account", "User-generated content / posts"),
    ("documents", "PDFs, certificates, forms"),
]


@deconstructible
class UploadToPath:
    """
    Callable for dynamic S3 paths with hash-based filenames.
    Handles both owner-level and pet-level profile images.
    """

    def __init__(self, base_folder="media"):
        self.base_folder = base_folder

    def __call__(self, instance, filename):
        ext = filename.split(".")[-1].lower()
        new_filename = f"{uuid.uuid4()}.{ext}"

        # Determine subfolder: owner or pet
        if hasattr(instance, "pet_id") and instance.pet_id:
            subfolder = str(instance.pet_id)  # pet-level image
        else:
            subfolder = "owner"  # owner-level image

        return f"{self.base_folder}/{instance.service_type}/{instance.owner_id}/{subfolder}/{new_filename}"


# Instantiate callable for ImageField
upload_to_path = UploadToPath(base_folder="media")


class MediaFile(models.Model):
    """
    Represents media stored in S3 with dynamic paths.
    Handles:
                - Owner profile images
                - Pet profile images
                - Other service types (account, documents)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_TYPES,
        help_text="Type/category of the media (profile, account, documents)",
    )
    owner_id = models.UUIDField(
        help_text="ID of the entity (owner) that owns this file"
    )
    pet_id = models.UUIDField(
        blank=True, null=True, help_text="ID of the pet (optional, only for pet images)"
    )
    file = models.FileField(upload_to=upload_to_path, help_text="File stored in S3")
    original_filename = models.CharField(max_length=255, blank=True)
    content_type = models.CharField(max_length=100, blank=True)
    size = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "media_files"
        indexes = [
            models.Index(fields=["service_type", "owner_id", "pet_id"]),
        ]
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        # Capture original filename, content type, size
        if self.file and not self.original_filename:
            self.original_filename = self.file.name
            self.size = self.file.size
            if hasattr(self.file.file, "content_type"):
                self.content_type = self.file.file.content_type
        super().save(*args, **kwargs)

    def __str__(self):
        if self.pet_id:
            subfolder = str(self.pet_id)
        else:
            subfolder = "owner"
        return (
            f"{self.service_type}/{self.owner_id}/{subfolder}/{self.original_filename}"
        )
