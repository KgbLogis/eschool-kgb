# Generated by Django 3.2.20 on 2023-09-26 06:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0005_remove_classes_classes_numeric'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='classes',
            name='sub_school',
        ),
    ]
