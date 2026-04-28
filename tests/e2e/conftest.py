"""
Shared fixtures for E2E tests.

These tests run against live services started via docker-compose.
All tests are auto-skipped when the auth service is unreachable.
Run with: pytest tests/e2e/ -v -m e2e
"""

import pytest
import requests


AUTH_BASE = "http://localhost:8000"
PROFILE_BASE = "http://localhost:8001"


def _services_reachable() -> bool:
    try:
        requests.get(f"{AUTH_BASE}/health/", timeout=2)
        return True
    except requests.RequestException:
        return False


def pytest_collection_modifyitems(items):
    if not _services_reachable():
        skip = pytest.mark.skip(
            reason="Docker services not reachable — run docker-compose up first"
        )
        for item in items:
            if "e2e" in item.keywords:
                item.add_marker(skip)


@pytest.fixture(scope="session")
def auth_url():
    return AUTH_BASE


@pytest.fixture(scope="session")
def profile_url():
    return PROFILE_BASE


@pytest.fixture
def register_and_login(auth_url):
    """Register a unique user and return (access_token, session) with cookie jar."""
    import uuid

    email = f"e2e_{uuid.uuid4().hex[:8]}@example.com"
    password = "E2eStr0ngPass!"

    session = requests.Session()
    reg = session.post(
        f"{auth_url}/api/auth/register/",
        json={"email": email, "password": password, "confirmPassword": password},
    )
    assert reg.status_code == 201, reg.text
    access_token = reg.json()["accessToken"]
    return access_token, session
