from .serializers import (
    MediaPresignUploadSerializer,
)
import boto3
from botocore.client import Config
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import MediaFile
from constants import STATUS_PENDING, STATUS_ACTIVE


class MediaPresignUploadView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MediaPresignUploadSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        owner_profile_id = data["owner_profile_id"]
        pet_profile_id = data.get("pet_profile_id")
        service_type = data["service_type"]
        filename = data["filename"]
        content_type = data["content_type"]

        media, _ = MediaFile.objects.update_or_create(
            service_type=service_type,
            owner_profile_id=owner_profile_id,
            pet_profile_id=pet_profile_id,
            status=STATUS_PENDING,
            defaults={
                "original_filename": filename,
                "content_type": content_type,
            },
        )

        key = media.file.field.generate_filename(media, filename)
        media.file.name = key
        media.save(update_fields=["file"])

        s3 = boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
        )

        upload_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=300,
        )

        file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{key}"

        return Response(
            {
                "media_id": media.id,
                "upload_url": upload_url,
                "file_url": file_url,
                "key": key,
            }
        )


class MediaConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, media_id):
        media = get_object_or_404(MediaFile, id=media_id)
        media.status = STATUS_ACTIVE
        media.save(update_fields=["status"])
        return Response({"media": media}, status=status.HTTP_200_OK)
