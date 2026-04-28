"""
Standalone settings for running tests locally.
Uses SQLite in-memory to avoid needing a live PostgreSQL instance.
S3 calls are mocked via moto in tests.
"""

from datetime import timedelta

SECRET_KEY = "test-secret-key-for-media-testing-only-do-not-use-in-production"
DEBUG = True
ALLOWED_HOSTS = ["*"]

# AWS settings — overridden by moto mock in tests
AWS_ACCESS_KEY_ID = "testing"
AWS_SECRET_ACCESS_KEY = "testing"
AWS_STORAGE_BUCKET_NAME = "test-media-bucket"
AWS_S3_REGION_NAME = "us-east-1"

INSTALLED_APPS = [
    "corsheaders",
    "media_service",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "rest_framework",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "media_service.middleware.camelcase_middleware.CamelCaseMiddleware",
]

ROOT_URLCONF = "media_service.urls"

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
    "SIGNING_KEY": "test-jwt-secret-for-media-testing-only",
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
