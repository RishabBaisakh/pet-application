import uuid
from django.db import IntegrityError
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import OwnerProfile, PetProfile
from .serializers import OwnerProfileSerializer, PetProfileSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from constants import STATUS_ACTIVE, STATUS_ONBOARDING


# TODO: Put it in separate files if the API grows too much, for now it's manageable in a single file
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
        owner_profile, _ = OwnerProfile.objects.get_or_create(user_id=request.user.id)

        return Response({"owner_id": str(owner_profile.id)}, status=201)


class OwnerProfileViewSet(viewsets.ModelViewSet):
    queryset = OwnerProfile.objects.all()
    serializer_class = OwnerProfileSerializer
    permission_classes = [IsAuthenticated]


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

        pet_profile = PetProfile.objects.filter(
            owner_profile=owner_profile, status=STATUS_ONBOARDING
        ).first()
        if pet_profile:
            return Response({"pet_id": str(pet_profile.id)}, status=200)

        try:
            pet_profile = PetProfile.objects.create(owner_profile=owner_profile)
            return Response({"pet_id": str(pet_profile.id)}, status=201)
        except IntegrityError:
            existing_pet_profile = PetProfile.objects.filter(
                owner_profile=owner_profile,
                status=STATUS_ONBOARDING,
            ).first()

            if existing_pet_profile:
                return Response({"pet_id": str(existing_pet_profile.id)}, status=200)

            return Response(
                {
                    "error": "Could not initialize pet profile due to a concurrent request."
                },
                status=409,
            )


class PetProfileViewSet(viewsets.ModelViewSet):
    queryset = PetProfile.objects.all()
    serializer_class = PetProfileSerializer
    permission_classes = [IsAuthenticated]
