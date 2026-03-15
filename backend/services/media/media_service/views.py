import boto3
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from uuid import uuid4

from .models import MediaFile
from constants import STATUS_PENDING, STATUS_ACTIVE


class MediaPresignUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received media upload request with data:", request.data)
        owner_id = request.data["owner_id"]
        pet_id = request.data.get("pet_id")
        service_type = request.data["service_type"]
        filename = request.data["filename"]
        content_type = request.data["content_type"]

        media = MediaFile.objects.create(
            service_type=service_type,
            owner_id=owner_id,
            pet_id=pet_id,
            original_filename=filename,
            content_type=content_type,
            status=STATUS_PENDING,
        )

        key = media.file.field.generate_filename(media, filename)
        media.file.name = key
        media.save(update_fields=["file"])

        s3 = boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
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

        return Response({"status": "confirmed"}, status=status.HTTP_200_OK)
