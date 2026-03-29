from django.contrib import admin
from django.urls import path
from .views import MediaPresignUploadView, MediaConfirmView

urlpatterns = [
    path("api/media/presign/", MediaPresignUploadView.as_view()),
    path("api/media/<uuid:media_id>/confirm/", MediaConfirmView.as_view()),
]
