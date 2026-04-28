"""
E2E: Full user onboarding flow spanning Auth and Profile services.

Requirements: docker-compose up (all services running).
Run with:     pytest tests/e2e/ -v -m e2e
"""

import pytest
import requests


pytestmark = pytest.mark.e2e


def test_full_onboarding_flow(auth_url, profile_url):
    """
    Happy-path journey:
    Register → login → init owner → complete owner → init pet → complete pet
    → onboarding-status returns both completed.
    """
    import uuid

    email = f"e2e_{uuid.uuid4().hex[:8]}@example.com"
    password = "E2eStr0ngPass!"

    session = requests.Session()

    # 1. Register
    reg = session.post(
        f"{auth_url}/api/auth/register/",
        json={
            "email": email,
            "password": password,
            "confirmPassword": password,
        },
    )
    assert reg.status_code == 201, reg.text
    access_token = reg.json()["accessToken"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # 2. Init owner profile
    init_owner = session.post(
        f"{profile_url}/api/profile/init_owner_profile/", headers=headers
    )
    assert init_owner.status_code == 201, init_owner.text

    # 3. Complete owner profile (both names required to become ACTIVE)
    patch_owner = session.patch(
        f"{profile_url}/api/profile/owners/me/",
        json={"firstName": "E2E", "lastName": "Tester"},
        headers=headers,
    )
    assert patch_owner.status_code == 200, patch_owner.text
    assert patch_owner.json()["status"] == "ACTIVE"

    # 4. Init pet profile
    init_pet = session.post(
        f"{profile_url}/api/profile/init_pet_profile/", headers=headers
    )
    assert init_pet.status_code == 201, init_pet.text
    pet_id = init_pet.json()["id"]

    # 5. Complete pet profile (name + type required to become ACTIVE)
    patch_pet = session.patch(
        f"{profile_url}/api/profile/pets/{pet_id}/",
        json={"name": "Rover", "type": "DOG"},
        headers=headers,
    )
    assert patch_pet.status_code == 200, patch_pet.text
    assert patch_pet.json()["status"] == "ACTIVE"

    # 6. Check onboarding status — both should be complete
    onboarding = session.get(
        f"{profile_url}/api/profile/onboarding-status/", headers=headers
    )
    assert onboarding.status_code == 200, onboarding.text
    payload = onboarding.json()
    assert payload["ownerProfileCompleted"] is True
    assert payload["petProfileCompleted"] is True
