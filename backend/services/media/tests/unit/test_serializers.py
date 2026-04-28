import pytest

from media_service.serializers import MediaPresignUploadSerializer

pytestmark = pytest.mark.unit


class TestMediaPresignUploadSerializer:
    def _valid_data(self, **overrides):
        base = {
            "owner_profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "service_type": "PROFILE",
            "filename": "avatar.jpg",
            "content_type": "image/jpeg",
        }
        base.update(overrides)
        return base

    def test_valid_data_passes(self):
        s = MediaPresignUploadSerializer(data=self._valid_data())
        assert s.is_valid(), s.errors

    def test_missing_owner_profile_id_is_invalid(self):
        data = self._valid_data()
        del data["owner_profile_id"]
        s = MediaPresignUploadSerializer(data=data)
        assert not s.is_valid()
        assert "owner_profile_id" in s.errors

    def test_invalid_service_type_is_rejected(self):
        s = MediaPresignUploadSerializer(data=self._valid_data(service_type="INVALID"))
        assert not s.is_valid()
        assert "service_type" in s.errors

    def test_valid_service_types_accepted(self):
        for service_type in ("PROFILE", "ACCOUNT", "DOCUMENTS"):
            s = MediaPresignUploadSerializer(
                data=self._valid_data(service_type=service_type)
            )
            assert s.is_valid(), f"{service_type} should be valid — {s.errors}"

    def test_pet_profile_id_is_optional(self):
        # Without pet_profile_id — valid
        s = MediaPresignUploadSerializer(data=self._valid_data())
        assert s.is_valid(), s.errors

    def test_pet_profile_id_accepts_null(self):
        s = MediaPresignUploadSerializer(data=self._valid_data(pet_profile_id=None))
        assert s.is_valid(), s.errors

    def test_pet_profile_id_with_valid_uuid(self):
        s = MediaPresignUploadSerializer(
            data=self._valid_data(pet_profile_id="b2c3d4e5-f6a7-8901-bcde-f12345678901")
        )
        assert s.is_valid(), s.errors

    def test_missing_filename_is_invalid(self):
        data = self._valid_data()
        del data["filename"]
        s = MediaPresignUploadSerializer(data=data)
        assert not s.is_valid()
        assert "filename" in s.errors

    def test_missing_content_type_is_invalid(self):
        data = self._valid_data()
        del data["content_type"]
        s = MediaPresignUploadSerializer(data=data)
        assert not s.is_valid()
        assert "content_type" in s.errors

    def test_invalid_uuid_for_owner_profile_id_is_rejected(self):
        s = MediaPresignUploadSerializer(
            data=self._valid_data(owner_profile_id="not-a-uuid")
        )
        assert not s.is_valid()
        assert "owner_profile_id" in s.errors
