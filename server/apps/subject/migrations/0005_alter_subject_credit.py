# Generated by Django 3.2 on 2022-11-30 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subject', '0004_alter_subject_credit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='credit',
            field=models.CharField(max_length=50),
        ),
    ]
