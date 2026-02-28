from .internal.permissions import (
    InternalServicePermission,
)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import OwnerProfile, PetProfile
from .serializers import OwnerProfileSerializer, PetProfileSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


# TODO: Put it in separate files if the API grows too much, for now it's manageable in a single file
# TODO: Add Rate limiting to onboarding status endpoint to prevent abuse - can be implemented using drf throttling or nginx/cloudflare rate limiting in production
class OnboardingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner_profile = OwnerProfile.objects.filter(user_id=request.user.id).first()
        pet_profile = PetProfile.objects.filter(owner_profile=owner_profile).first()

        onboarding_status = {
            "owner_profile_completed": bool(owner_profile),
            "pet_profile_completed": bool(pet_profile),
        }

        return Response(onboarding_status)


class OwnerProfileViewSet(viewsets.ModelViewSet):
    queryset = OwnerProfile.objects.all()
    serializer_class = OwnerProfileSerializer
    permission_classes = [IsAuthenticated]


class PetProfileViewSet(viewsets.ModelViewSet):
    queryset = PetProfile.objects.all()
    serializer_class = PetProfileSerializer
    permission_classes = [IsAuthenticated]
