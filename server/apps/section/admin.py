from django.contrib import admin
from django.urls import reverse
from django.utils.http import urlencode
from django.utils.html import format_html
from .models import Section

class SectionAdmin(admin.ModelAdmin):
    list_display = ("pk", "classes", "section", "view_students_link")

    def view_students_link(self, obj):
        count = obj.student_set.count()
        url = (
            # reverse("admin:core_person_changelist")
            # + "?"
            urlencode({"section__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} Students</a>', url, count)

    view_students_link.short_description = "Students"

# Register your models here.
admin.site.register(Section, SectionAdmin)