# Generated by Django 3.2.16 on 2023-02-09 04:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('teacher', '0007_teacher_prop_degree'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teacher',
            name='prop_degree',
        ),
    ]
