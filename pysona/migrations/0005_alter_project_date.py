# Generated by Django 5.1.3 on 2024-12-20 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pysona", "0004_alter_persona_techsav"),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="date",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
