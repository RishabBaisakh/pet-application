from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from constants import STATUS_ACTIVE, STATUS_DELETED
from .models import Post, PostLike, PostMedia
from .pagination import FeedCursorPagination
from .serializers import CreatePostSerializer, PostSerializer


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner_profile_id = request.auth.get("user_id")
        posts = (
            Post.objects.filter(status=STATUS_ACTIVE)
            .annotate(like_count=Count("likes"))
            .prefetch_related("media")
        )
        paginator = FeedCursorPagination()
        page = paginator.paginate_queryset(posts, request)

        post_ids = [p.id for p in page]
        liked_post_ids = set(
            PostLike.objects.filter(
                post_id__in=post_ids,
                owner_profile_id=owner_profile_id,
            ).values_list("post_id", flat=True)
        )

        serializer = PostSerializer(
            page, many=True, context={"liked_post_ids": liked_post_ids}
        )
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CreatePostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        owner_profile_id = request.auth.get("user_id")

        post = Post.objects.create(
            owner_profile_id=owner_profile_id,
            pet_profile_id=data.get("pet_profile_id"),
            content=data["content"],
            visibility=data["visibility"],
        )

        media_file_ids = data.get("media_file_ids", [])
        if media_file_ids:
            PostMedia.objects.bulk_create(
                [
                    PostMedia(post=post, media_file_id=media_id, order=idx)
                    for idx, media_id in enumerate(media_file_ids)
                ]
            )

        out = PostSerializer(post)
        return Response(out.data, status=status.HTTP_201_CREATED)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        owner_profile_id = request.auth.get("user_id")

        try:
            post = Post.objects.get(id=post_id, status=STATUS_ACTIVE)
        except Post.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if str(post.owner_profile_id) != str(owner_profile_id):
            return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        post.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        owner_profile_id = request.auth.get("user_id")
        try:
            post = Post.objects.get(id=post_id, status=STATUS_ACTIVE)
        except Post.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        _, created = PostLike.objects.get_or_create(
            post=post, owner_profile_id=owner_profile_id
        )
        if not created:
            return Response(
                {"detail": "Already liked."}, status=status.HTTP_409_CONFLICT
            )
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, post_id):
        owner_profile_id = request.auth.get("user_id")
        deleted, _ = PostLike.objects.filter(
            post_id=post_id, owner_profile_id=owner_profile_id
        ).delete()
        if not deleted:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
