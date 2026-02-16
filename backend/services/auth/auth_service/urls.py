from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from .views import RefreshTokenView, RegisterView, MeView, LogoutView, LoginView


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("health/", health),
    # Auth API
    path("api/auth/register/", RegisterView.as_view(), name="auth-register"),
    path("api/auth/login/", LoginView.as_view(), name="auth-login"),
    path("api/auth/token/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("api/auth/me/", MeView.as_view(), name="auth-me"),
]
