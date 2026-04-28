import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    role = "owner"
    is_active = True
    is_verified = False

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        raw = extracted if extracted else "testpass123!"
        obj.set_password(raw)
        if create:
            obj.save()
