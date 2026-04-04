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
        read_only_fields = ("id", "status", "created_at", "updated_at")


class OwnerInitResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = ("id", "status")


class PetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = (
            "id",
            "owner_profile_id",
            "name",
            "age",
            "type",
            "breed",
            "bio",
            "avatar_url",
            "status",
            "city",
            "province",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "owner_profile_id",
            "status",
            "created_at",
            "updated_at",
        )


class PetInitResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = ("id", "owner_profile_id", "status")
