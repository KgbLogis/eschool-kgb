# Generated by Django 3.2 on 2022-11-30 09:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0002_auto_20221125_1645'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='classes',
            name='teacher',
        ),
    ]
