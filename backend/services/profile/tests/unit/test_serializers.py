import pytest

from profile_service.serializers import OwnerProfileSerializer, PetProfileSerializer

pytestmark = pytest.mark.unit


class TestOwnerProfileSerializer:
    def test_read_only_fields_cannot_be_written(self):
        meta = OwnerProfileSerializer.Meta
        for field in ("id", "status", "created_at", "updated_at"):
            assert field in meta.read_only_fields

    def test_valid_writable_fields_pass(self):
        data = {
            "first_name": "Jane",
            "last_name": "Doe",
            "bio": "Hello world",
            "avatar_url": "https://example.com/avatar.jpg",
        }
        s = OwnerProfileSerializer(data=data)
        assert s.is_valid(), s.errors

    def test_status_cannot_be_set_by_client(self):
        data = {"first_name": "Jane", "last_name": "Doe", "status": "ACTIVE"}
        s = OwnerProfileSerializer(data=data)
        s.is_valid()
        assert "status" not in s.validated_data


class TestPetProfileSerializer:
    def test_read_only_fields_cannot_be_written(self):
        meta = PetProfileSerializer.Meta
        for field in ("id", "owner_profile_id", "status", "created_at", "updated_at"):
            assert field in meta.read_only_fields

    def test_invalid_pet_type_is_rejected(self):
        data = {"name": "Buddy", "type": "DRAGON"}
        s = PetProfileSerializer(data=data)
        assert not s.is_valid()
        assert "type" in s.errors

    def test_valid_data_passes(self):
        data = {
            "name": "Buddy",
            "type": "DOG",
            "breed": "Labrador",
            "age": 3,
            "gender": "M",
            "city": "Toronto",
            "province": "ON",
            "country": "CA",
        }
        s = PetProfileSerializer(data=data)
        assert s.is_valid(), s.errors

    def test_invalid_gender_is_rejected(self):
        data = {"name": "Buddy", "type": "DOG", "gender": "X"}
        s = PetProfileSerializer(data=data)
        assert not s.is_valid()
        assert "gender" in s.errors

    def test_all_optional_fields_can_be_blank(self):
        s = PetProfileSerializer(data={})
        # All fields are optional on PetProfileSerializer
        assert s.is_valid(), s.errors
