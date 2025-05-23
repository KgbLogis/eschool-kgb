# Generated by Django 3.2.18 on 2023-08-15 06:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0005_rename_employee_compartment_employee_compartment'),
        ('plan', '0002_subplan_game'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyplan',
            name='approved_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='employee.employee'),
        ),
        migrations.AddField(
            model_name='subplanaction',
            name='approved_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='employee.employee'),
        ),
    ]
