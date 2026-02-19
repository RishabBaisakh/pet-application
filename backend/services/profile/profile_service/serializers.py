from rest_framework import serializers
from .models import OwnerProfile, PetProfile


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = "__all__"
        read_only_fields = ("id", "user_id", "created_at", "updated_at")


class PetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = "__all__"
        read_only_fields = ("id", "owner_profile", "created_at", "updated_at")
