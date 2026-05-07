import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts_service", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PostLike",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("owner_profile_id", models.UUIDField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="likes",
                        to="posts_service.post",
                    ),
                ),
            ],
            options={
                "app_label": "posts_service",
            },
        ),
        migrations.AlterUniqueTogether(
            name="postlike",
            unique_together={("post", "owner_profile_id")},
        ),
    ]
