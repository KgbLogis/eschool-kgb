# Generated by Django 3.2.16 on 2022-12-09 08:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0002_remove_program_degree'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='program',
            name='program_numeric',
        ),
    ]
