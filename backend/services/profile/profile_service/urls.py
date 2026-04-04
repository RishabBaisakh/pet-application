from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OnboardingStatusView,
    OwnerProfileViewSet,
    PetProfileViewSet,
    InitializeOwnerView,
    InitializePetView,
)

router = DefaultRouter()
router.register(r"owners", OwnerProfileViewSet, basename="owner")
router.register(r"pets", PetProfileViewSet, basename="pet")

urlpatterns = [
    path("api/profile/", include(router.urls)),
    path(
        "api/profile/onboarding-status/",
        OnboardingStatusView.as_view(),
        name="onboarding-status",
    ),
    path("api/profile/init_owner_profile/", InitializeOwnerView.as_view()),
    path("api/profile/init_pet_profile/", InitializePetView.as_view()),
]
