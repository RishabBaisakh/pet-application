from django.http import JsonResponse
from django.urls import path

from .views import PostDetailView, PostListCreateView


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("health/", health),
    path("api/posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("api/posts/feed/", PostListCreateView.as_view(), name="post-feed"),
    path("api/posts/<uuid:post_id>/", PostDetailView.as_view(), name="post-detail"),
]
