from constants import SERVICE_TYPE_PROFILE
from rest_framework import serializers

from .models import MediaFile, SERVICE_TYPES


class MediaPresignUploadSerializer(serializers.Serializer):
    owner_profile_id = serializers.UUIDField(required=True)
    pet_profile_id = serializers.UUIDField(required=False, allow_null=True)
    service_type = serializers.ChoiceField(
        choices=[s[0] for s in SERVICE_TYPES],
        required=True,
        error_messages={
            "invalid_choice": "Invalid service type. Must be one of: PROFILE, ACCOUNT, DOCUMENTS."
        },
    )
    filename = serializers.CharField(required=True, max_length=255)
    content_type = serializers.CharField(required=True, max_length=100)

    class Meta:
        model = MediaFile
        fields = [
            "owner_profile_id",
            "pet_profile_id",
            "service_type",
            "filename",
            "content_type",
        ]
