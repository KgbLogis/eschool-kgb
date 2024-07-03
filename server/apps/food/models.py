from django.db.models import Model, CharField, TextField, DateTimeField, ImageField, ForeignKey, CASCADE
from tenants.middlewares import get_current_db_name
from django.conf import settings
from apps.schoolyear.models import Schoolyear
from apps.program.models import Program

class FoodMenu(Model):
    program = ForeignKey(Program, on_delete=CASCADE)
    name = CharField(max_length=50)

    def filter_fields():
        return ['name', 'program__program']

class Food(Model):
    food_menu = ForeignKey(FoodMenu, on_delete=CASCADE)
    name = CharField(max_length=50)
    ingredients = TextField()
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

class FoodFile(Model):
    upload_path = 'default'
    if(get_current_db_name()!=None):
        upload_path = get_current_db_name()
    image =ImageField(upload_to='static/uploads/'+upload_path+'/food_image/%Y/%m/%d/')
    food = ForeignKey(Food, on_delete=CASCADE)

class DailyMenu(Model):
    NAME_CHOICES = (
        ('MORNING', 'Өглөө',),
        ('AFTERNOON', 'Өдөр',),
        ('EVENING', 'Орой'),
    )
    program = ForeignKey(Program, on_delete=CASCADE)
    schoolyear = ForeignKey(Schoolyear, on_delete=CASCADE)
    name = CharField(
        max_length=50,
        choices=NAME_CHOICES,
    )
    created_at = DateTimeField(auto_now_add=True)

class DailyMenuFood(Model):
    daily_menu = ForeignKey(DailyMenu, on_delete=CASCADE)
    food = ForeignKey(Food, on_delete=CASCADE)