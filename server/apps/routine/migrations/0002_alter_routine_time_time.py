# Generated by Django 3.2.15 on 2023-01-06 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routine', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='routine_time',
            name='time',
            field=models.CharField(max_length=100),
        ),
    ]
