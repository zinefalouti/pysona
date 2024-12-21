# Generated by Django 5.1.3 on 2024-12-15 23:52

import django.db.models.deletion
import pysona.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pysona", "0002_alter_customuser_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="thumbnail",
            field=models.ImageField(
                blank=True, null=True, upload_to=pysona.models.get_unique_filename
            ),
        ),
        migrations.CreateModel(
            name="Persona",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "thumbnail",
                    models.ImageField(
                        blank=True,
                        null=True,
                        upload_to=pysona.models.get_unique_filename,
                    ),
                ),
                ("age", models.PositiveIntegerField()),
                ("occup", models.CharField(max_length=255)),
                ("location", models.CharField(max_length=255)),
                ("status", models.CharField(max_length=255)),
                ("education", models.CharField(max_length=255)),
                ("background", models.TextField()),
                ("techsav", models.IntegerField()),
                ("efficiency", models.IntegerField(default=0)),
                ("curiosity", models.IntegerField(default=0)),
                ("techintuit", models.IntegerField(default=0)),
                ("techexpert", models.IntegerField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("date", models.DateTimeField()),
                ("uxboard", models.URLField()),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Assign",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("score", models.IntegerField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "persona",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="pysona.persona"
                    ),
                ),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="pysona.project"
                    ),
                ),
            ],
        ),
    ]
