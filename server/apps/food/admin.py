from django.contrib import admin
from .models import FoodMenu, Food, FoodFile, DailyMenu, DailyMenuFood

# Register your models here.
admin.site.register(FoodMenu)
admin.site.register(Food)
admin.site.register(FoodFile)
admin.site.register(DailyMenu)
admin.site.register(DailyMenuFood)