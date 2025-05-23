# Generated by Django 3.2.20 on 2023-10-23 07:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('handover', '0003_handover_is_successed'),
    ]

    operations = [
        migrations.AddField(
            model_name='handover',
            name='edit_userID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='handover_edit_userID', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='handover',
            name='create_userID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='handover_create_userID', to=settings.AUTH_USER_MODEL),
        ),
    ]
