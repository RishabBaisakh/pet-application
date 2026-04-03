from rest_framework import serializers
from .models import OwnerProfile, PetProfile


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = (
            "id",
            "first_name",
            "last_name",
            "bio",
            "avatar_url",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user_id", "status", "created_at", "updated_at")


class OwnerInitResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = ("id", "status")


class PetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = (
            "id",
            "name",
            "age",
            "breed",
            "bio",
            "avatar_url",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner_profile", "status", "created_at", "updated_at")
