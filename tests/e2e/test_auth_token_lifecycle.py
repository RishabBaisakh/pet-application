"""
E2E: JWT token lifecycle — refresh and blacklisting after logout.

Requirements: docker-compose up (auth service running).
Run with:     pytest tests/e2e/ -v -m e2e
"""

import uuid

import pytest
import requests

pytestmark = pytest.mark.e2e


def _register_and_login(auth_url: str):
    """Helper: register a fresh user and return (session, access_token)."""
    email = f"e2e_{uuid.uuid4().hex[:8]}@example.com"
    password = "E2eStr0ngPass!"

    session = requests.Session()
    reg = session.post(
        f"{auth_url}/api/auth/register/",
        json={
            "email": email,
            "password": password,
            "confirmPassword": password,
        },
    )
    assert reg.status_code == 201, reg.text

    login = session.post(
        f"{auth_url}/api/auth/login/",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200, login.text
    access_token = login.json()["access"]
    return session, access_token


def test_refresh_returns_new_access_token(auth_url):
    """A valid refresh_token cookie can be exchanged for a new access token."""
    session, _ = _register_and_login(auth_url)

    refresh = session.post(f"{auth_url}/api/auth/token/refresh/")
    assert refresh.status_code == 200, refresh.text
    assert "accessToken" in refresh.json()


def test_me_accessible_with_access_token(auth_url):
    """The /me endpoint returns user data when a valid access token is provided."""
    session, access_token = _register_and_login(auth_url)

    me = session.get(
        f"{auth_url}/api/auth/me/",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert me.status_code == 200, me.text
    assert "email" in me.json()


def test_logout_blacklists_refresh_token(auth_url):
    """After logout, the refresh token must be rejected."""
    session, access_token = _register_and_login(auth_url)

    # Logout
    logout = session.post(
        f"{auth_url}/api/auth/logout/",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert logout.status_code == 200, logout.text

    # The blacklisted refresh token must now be rejected
    refresh = session.post(f"{auth_url}/api/auth/token/refresh/")
    assert (
        refresh.status_code == 401
    ), f"Expected 401 after logout but got {refresh.status_code}: {refresh.text}"


def test_me_returns_401_without_token(auth_url):
    """Unauthenticated requests to /me must be rejected."""
    response = requests.get(f"{auth_url}/api/auth/me/")
    assert response.status_code == 401
