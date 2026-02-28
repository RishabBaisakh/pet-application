import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


# Let's decprecate this flow for a while!
def get_onboarding_status(user_id: str) -> dict:
    url = f"{settings.PROFILE_SERVICE_URL}/api/onboarding-status/?user_id={user_id}"
    headers = {"Internal-Authorization": settings.INTERNAL_SERVICE_KEY}

    try:
        res = requests.get(url, headers=headers, timeout=2)
        res.raise_for_status()

        data = res.json()

        # Validate expected keys
        if "owner_profile_completed" not in data or "pet_profile_completed" not in data:
            raise ValueError("Invalid response from profile service")

        return data

    except requests.HTTPError as e:
        # Profile service responded but with error code
        logger.error(
            "Profile service HTTP error",
            extra={"user_id": user_id, "status": e.response.status_code},
        )
        raise  # propagate to auth view

    except requests.RequestException as e:
        # Network / timeout / DNS
        logger.error(
            "Profile service unreachable", extra={"user_id": user_id, "error": str(e)}
        )
        raise

    except ValueError as e:
        # Bad JSON / missing fields
        logger.error("Invalid profile service response", extra={"user_id": user_id})
        raise
