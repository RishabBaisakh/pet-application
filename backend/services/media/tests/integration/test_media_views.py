import uuid

import boto3
import pytest
from moto import mock_aws
from rest_framework import status

from constants import STATUS_ACTIVE, STATUS_PENDING
from media_service.models import MediaFile
from tests.factories import MediaFileFactory

pytestmark = pytest.mark.integration

PRESIGN_URL = "/api/media/presign/"


def confirm_url(media_id):
    return f"/api/media/{media_id}/confirm/"


@pytest.fixture(autouse=True)
def mock_s3_bucket(settings):
    """Activate moto S3 mock and create the test bucket for every test in this module."""
    with mock_aws():
        s3 = boto3.client("s3", region_name=settings.AWS_S3_REGION_NAME)
        s3.create_bucket(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
        yield


@pytest.mark.django_db
class TestMediaPresignUploadView:
    def _valid_payload(self, owner_profile_id=None):
        return {
            "owner_profile_id": str(owner_profile_id or uuid.uuid4()),
            "service_type": "PROFILE",
            "filename": "avatar.jpg",
            "content_type": "image/jpeg",
        }

    def test_returns_200_with_upload_url_and_media_id(
        self, authenticated_client, owner_profile_id
    ):
        payload = self._valid_payload(owner_profile_id)
        response = authenticated_client.post(PRESIGN_URL, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "upload_url" in response.data
        assert "media_id" in response.data
        assert "file_url" in response.data

    def test_creates_media_file_with_pending_status(
        self, authenticated_client, owner_profile_id
    ):
        payload = self._valid_payload(owner_profile_id)
        response = authenticated_client.post(PRESIGN_URL, payload, format="json")
        media_id = response.data["media_id"]
        media = MediaFile.objects.get(id=media_id)
        assert media.status == STATUS_PENDING

    def test_upload_url_is_a_non_empty_string(
        self, authenticated_client, owner_profile_id
    ):
        payload = self._valid_payload(owner_profile_id)
        response = authenticated_client.post(PRESIGN_URL, payload, format="json")
        assert isinstance(response.data["upload_url"], str)
        assert len(response.data["upload_url"]) > 0

    def test_presign_with_pet_profile_id(self, authenticated_client, owner_profile_id):
        payload = self._valid_payload(owner_profile_id)
        payload["pet_profile_id"] = str(uuid.uuid4())
        response = authenticated_client.post(PRESIGN_URL, payload, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_second_presign_for_same_owner_reuses_media_record(
        self, authenticated_client, owner_profile_id
    ):
        """update_or_create should return the same record on repeated calls."""
        payload = self._valid_payload(owner_profile_id)
        resp1 = authenticated_client.post(PRESIGN_URL, payload, format="json")
        resp2 = authenticated_client.post(PRESIGN_URL, payload, format="json")
        assert resp1.data["media_id"] == resp2.data["media_id"]
        assert MediaFile.objects.filter(owner_profile_id=owner_profile_id).count() == 1

    def test_returns_401_when_unauthenticated(self, api_client, owner_profile_id):
        response = api_client.post(
            PRESIGN_URL, self._valid_payload(owner_profile_id), format="json"
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_owner_profile_id_returns_400(self, authenticated_client):
        response = authenticated_client.post(
            PRESIGN_URL,
            {
                "service_type": "PROFILE",
                "filename": "a.jpg",
                "content_type": "image/jpeg",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_invalid_service_type_returns_400(
        self, authenticated_client, owner_profile_id
    ):
        payload = self._valid_payload(owner_profile_id)
        payload["service_type"] = "INVALID"
        response = authenticated_client.post(PRESIGN_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestMediaConfirmView:
    def test_confirm_updates_status_to_active(self, authenticated_client, media_file):
        authenticated_client.post(confirm_url(media_file.id))
        media_file.refresh_from_db()
        assert media_file.status == STATUS_ACTIVE

    def test_confirm_returns_200(self, authenticated_client, media_file):
        response = authenticated_client.post(confirm_url(media_file.id))
        assert response.status_code == status.HTTP_200_OK

    def test_confirm_unknown_id_returns_404(self, authenticated_client):
        response = authenticated_client.post(confirm_url(uuid.uuid4()))
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_confirm_returns_401_when_unauthenticated(self, api_client, media_file):
        response = api_client.post(confirm_url(media_file.id))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
