from rest_framework import serializers

from .models import Post, PostMedia


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ["id", "media_file_id", "order"]


class PostSerializer(serializers.ModelSerializer):
    media = PostMediaSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked_by_me = serializers.SerializerMethodField()

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
            "like_count",
            "is_liked_by_me",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def get_like_count(self, obj):
        if hasattr(obj, "like_count"):
            return obj.like_count
        return obj.likes.count()

    def get_is_liked_by_me(self, obj):
        liked_ids = self.context.get("liked_post_ids", set())
        return obj.id in liked_ids


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
