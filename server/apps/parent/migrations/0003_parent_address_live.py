# Generated by Django 3.2.16 on 2023-02-09 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parent', '0002_auto_20221223_1253'),
    ]

    operations = [
        migrations.AddField(
            model_name='parent',
            name='address_live',
            field=models.TextField(blank=True),
        ),
    ]
