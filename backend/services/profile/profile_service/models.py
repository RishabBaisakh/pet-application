import uuid
from django.db import models


class OwnerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    bio = models.TextField(blank=True, max_length=1000)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def name(self):
        return f"{self.first_name} {self.last_name}"


class PetProfile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_profile = models.ForeignKey(
        OwnerProfile, on_delete=models.CASCADE, related_name="pet_profiles"
    )
    name = models.CharField(max_length=30)
    species = models.CharField(max_length=30)
    breed = models.CharField(max_length=30, blank=True)
    age = models.PositiveIntegerField()
    bio = models.TextField(blank=True, max_length=1000)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default="O")
    avatar_url = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
