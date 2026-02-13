from rest_framework import serializers
from .models import OwnerProfile, PetProfile


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = "__all__"


class PetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetProfile
        fields = "__all__"
