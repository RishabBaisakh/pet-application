"""
Standalone settings for running tests locally.
Uses SQLite in-memory to avoid needing a live PostgreSQL instance.
"""

from datetime import timedelta

SECRET_KEY = "test-secret-key-for-auth-testing-only-do-not-use-in-production"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INTERNAL_SERVICE_KEY = "test-internal-service-key"
PROFILE_SERVICE_URL = "http://localhost:8001"

AUTH_USER_MODEL = "auth_service.User"

INSTALLED_APPS = [
    "auth_service.apps.AuthServiceConfig",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "auth_service.middleware.camelcase_middleware.CamelCaseMiddleware",
]

ROOT_URLCONF = "auth_service.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}

SIMPLE_JWT = {
    "SIGNING_KEY": "test-jwt-secret-for-auth-testing-only",
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

USE_TZ = True
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
