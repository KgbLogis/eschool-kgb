from django.contrib import admin
from .models import CustomUser
from django.apps import apps
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "last_name", "first_name", "student", "teacher", "employee")
    list_filter = ("groups", )

admin.site.register(CustomUser, UserAdmin)

app = apps.get_app_config('graphql_auth')

for model_name, model in app.models.items():
    admin.site.register(model)