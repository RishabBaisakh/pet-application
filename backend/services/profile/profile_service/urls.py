from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OnboardingStatusView, OwnerProfileViewSet, PetProfileViewSet

router = DefaultRouter()
router.register(r"owners", OwnerProfileViewSet, basename="owner")
router.register(r"pets", PetProfileViewSet, basename="pet")

urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "api/onboarding-status/",
        OnboardingStatusView.as_view(),
        name="onboarding-status",
    ),
]
