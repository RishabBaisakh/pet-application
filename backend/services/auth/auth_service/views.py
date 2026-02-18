from datetime import datetime, timedelta
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.http import http_date

from .serializers import RegisterSerializer, UserSerializer


# TODO: Manage is_verified field and email verification process
# TODO: Settings - Manage password reset process
# TODO: Settings - Manage is_active field to allow admins to deactivate accounts without deleting them - can be implemented by adding an is_active field to User model and checking it during authentication
# TODO: Add rate limiting to login endpoint to prevent brute-force attacks - while deployment, use nginx or cloudflare for rate limiting instead of drf throttling for better performance
# TODO: Add account lockout after multiple failed login attempts - can be implemented using a custom field in User model to track failed attempts and lockout time, and check it during authentication
# TODO: Add support for social authentication (Google, Facebook, etc.) - can be implemented using django-allauth or custom integration with social auth providers
class RefreshTokenView(APIView):
    """
    Refresh access token using refresh token from httpOnly cookie.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        # Read refresh token from cookie
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
        except TokenError:
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        return Response({"access_token": access_token}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # uses custom UserManager.create_user()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        user_data = UserSerializer(user).data

        return Response(
            {
                "user": {
                    "id": str(user_data["id"]),
                    "email": user_data["email"],
                },
                "access_token": access_token,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response(
            {
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                },
                "access": access,
            },
            status=status.HTTP_200_OK,
        )

        # Set refresh token in httpOnly cookie
        cookie_max_age = 7 * 24 * 60 * 60  # 7 days
        expires = datetime.utcnow() + timedelta(seconds=cookie_max_age)
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
            expires=http_date(expires.timestamp()),
        )

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
