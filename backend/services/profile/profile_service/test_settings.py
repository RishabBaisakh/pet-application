"""
Standalone settings for running tests locally.
Uses SQLite in-memory to avoid needing a live PostgreSQL instance.
Profile service uses JWTStatelessUserAuthentication — no User model needed.
"""

from datetime import timedelta

SECRET_KEY = "test-secret-key-for-profile-testing-only-do-not-use-in-production"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INTERNAL_SERVICE_KEY = "test-internal-service-key"

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "rest_framework",
    "corsheaders",
    "profile_service",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "profile_service.middleware.camelcase_middleware.CamelCaseMiddleware",
]

ROOT_URLCONF = "profile_service.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTStatelessUserAuthentication",
    ),
}

SIMPLE_JWT = {
    "SIGNING_KEY": "test-jwt-secret-for-profile-testing-only",
    "ALGORITHM": "HS256",
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

USE_TZ = True
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
