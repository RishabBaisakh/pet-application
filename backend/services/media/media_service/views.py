from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MediaFileUploadSerializer


class MediaFileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = MediaFileUploadSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            media_file = serializer.save()
            return Response(
                {
                    "id": str(media_file.id),
                    "file_url": media_file.file.url,
                    "service_type": media_file.service_type,
                    "pet_id": str(media_file.pet_id) if media_file.pet_id else None,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
