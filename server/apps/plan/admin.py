from django.contrib import admin
from .models import Plan, DailyPlan, SubPlan, SubPlanAction

# Register your models here.
admin.site.register(Plan)
admin.site.register(DailyPlan)
admin.site.register(SubPlan)
admin.site.register(SubPlanAction)