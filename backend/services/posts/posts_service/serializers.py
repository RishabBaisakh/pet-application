from rest_framework import serializers

from .models import Post, PostMedia


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ["id", "media_file_id", "order"]


class PostSerializer(serializers.ModelSerializer):
    media = PostMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "owner_profile_id",
            "pet_profile_id",
            "content",
            "visibility",
            "status",
            "media",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]


class CreatePostSerializer(serializers.Serializer):
    content = serializers.CharField(required=False, allow_blank=True, default="")
    pet_profile_id = serializers.UUIDField(required=False, allow_null=True)
    visibility = serializers.ChoiceField(
        choices=["PUBLIC", "FRIENDS", "PRIVATE"],
        default="PUBLIC",
    )
    media_file_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        default=list,
    )

    def validate(self, data):
        if not data.get("content") and not data.get("media_file_ids"):
            raise serializers.ValidationError(
                "A post must have either content or at least one media file."
            )
        return data
