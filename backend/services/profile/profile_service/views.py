from rest_framework import viewsets, permissions
from .models import OwnerProfile, PetProfile
from .serializers import OwnerProfileSerializer, PetProfileSerializer


class OwnerProfileViewSet(viewsets.ModelViewSet):
    queryset = OwnerProfile.objects.all()
    serializer_class = OwnerProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PetProfileViewSet(viewsets.ModelViewSet):
    queryset = PetProfile.objects.all()
    serializer_class = PetProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
