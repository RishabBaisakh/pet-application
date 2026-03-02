from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MediaFile, SERVICE_TYPES


class MediaPresignUploadSerializer(serializers.ModelSerializer):
    # Optional pet_id
    pet_id = serializers.UUIDField(required=False, allow_null=True)
    service_type = serializers.ChoiceField(
        choices=[s[0] for s in SERVICE_TYPES], default="profile"
    )

    class Meta:
        model = MediaFile
        fields = ["file", "service_type", "pet_id"]

    def create(self, validated_data):
        # Automatically set owner_id from the logged-in user
        validated_data["owner_id"] = self.context["request"].user.id
        return super().create(validated_data)
