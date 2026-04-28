from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from .models import OwnerProfile, PetProfile
from .serializers import (
    OwnerInitResponseSerializer,
    OwnerProfileSerializer,
    PetInitResponseSerializer,
    PetProfileSerializer,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from constants import STATUS_ACTIVE, STATUS_ONBOARDING


# TODO: Add Rate limiting to onboarding status endpoint to prevent abuse - can be implemented using drf throttling or nginx/cloudflare rate limiting in production
class OnboardingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner_profile = OwnerProfile.objects.filter(user_id=request.user.id).first()

        owner_profile_completed = bool(
            owner_profile and owner_profile.status == STATUS_ACTIVE
        )
        pet_profile_completed = PetProfile.objects.filter(
            owner_profile=owner_profile,
            status=STATUS_ACTIVE,
        ).exists()

        onboarding_status = {
            "owner_profile_completed": owner_profile_completed,
            "pet_profile_completed": pet_profile_completed,
        }

        return Response(onboarding_status)


class InitializeOwnerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        owner_profile, created = OwnerProfile.objects.get_or_create(
            user_id=request.user.id
        )
        data = OwnerInitResponseSerializer(owner_profile).data
        return Response(data, status=201 if created else 200)


class OwnerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = OwnerProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return OwnerProfile.objects.filter(user_id=self.request.user.id)

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        owner_profile = OwnerProfile.objects.filter(user_id=request.user.id).first()
        if not owner_profile:
            return Response(
                {"error": "Owner profile not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "PATCH":
            serializer = self.get_serializer(
                owner_profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return Response(self.get_serializer(owner_profile).data)


class InitializePetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        owner_profile = OwnerProfile.objects.filter(user_id=request.user.id).first()
        if not owner_profile:
            return Response(
                {
                    "error": "Owner profile not found. Please create an owner profile first."
                },
                status=404,
            )

        pet_profile, created = PetProfile.objects.get_or_create(
            owner_profile=owner_profile, status=STATUS_ONBOARDING
        )
        data = PetInitResponseSerializer(pet_profile).data
        return Response(data, status=201 if created else 200)


class PetProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PetProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        owner_profile = OwnerProfile.objects.filter(
            user_id=self.request.user.id
        ).first()
        if not owner_profile:
            return PetProfile.objects.none()
        return PetProfile.objects.filter(owner_profile=owner_profile)

    def perform_create(self, serializer):
        owner_profile = OwnerProfile.objects.filter(
            user_id=self.request.user.id
        ).first()
        if not owner_profile:
            raise ValidationError(
                "Owner profile not found. Please create an owner profile first."
            )
        serializer.save(owner_profile=owner_profile)
