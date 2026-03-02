import uuid
from django.db import models

from constants import STATUS_CHOICES, STATUS_ONBOARDING


class OwnerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True, max_length=1000)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_ONBOARDING
    )

    def name(self):
        return f"{self.first_name} {self.last_name}"


class PetType(models.TextChoices):
    DOG = "DOG", "Dog"
    CAT = "CAT", "Cat"
    RABBIT = "RAB", "Rabbit"
    BIRD = "BRD", "Bird"
    OTHER = "OTH", "Other"


class PetProfile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner_profile = models.ForeignKey(
        OwnerProfile,
        on_delete=models.CASCADE,
        related_name="pet_profiles",
    )

    name = models.CharField(max_length=30, blank=True)
    type = models.CharField(
        max_length=30,
        choices=PetType.choices,
        blank=True,
    )
    breed = models.CharField(max_length=30, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    bio = models.TextField(blank=True, max_length=1000)
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default="O",
    )
    avatar_url = models.URLField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=2, blank=True)
    country = models.CharField(max_length=2, default="CA")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_ONBOARDING
    )
    is_private = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["owner_profile"],
                condition=models.Q(status=STATUS_ONBOARDING),
                name="unique_onboarding_pet_per_owner",
            )
        ]
