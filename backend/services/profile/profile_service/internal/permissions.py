from rest_framework.permissions import BasePermission
from django.conf import settings


class InternalServicePermission(BasePermission):
    """
    Allow access only if Internal-Authorization header matches INTERNAL_SERVICE_KEY
    """

    def has_permission(self, request, view):
        internal_key = request.headers.get("Internal-Authorization")
        return internal_key == settings.INTERNAL_SERVICE_KEY
