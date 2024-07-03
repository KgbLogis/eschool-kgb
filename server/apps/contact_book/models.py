from django.db.models import Model, CharField, TextField, IntegerField, ForeignKey, CASCADE, DateTimeField, FileField, BooleanField
from django.conf import settings
from tenants.middlewares import get_current_db_name
from apps.student.models import Student

# Create your models here.
class ContactBook(Model):
    upload_path = 'default'
    if(get_current_db_name()!=None):
        upload_path = get_current_db_name()
    file =FileField(upload_to='static/uploads/'+upload_path+'/contact_book/%Y/%m/%d/', max_length=500 ,null=True, blank=True)
    #Биеийн байдал
    physical_condition = CharField(max_length=200, null=True, blank=True)
    #Унтсан эсэх
    is_sleep = BooleanField(default=True, null=True, blank=True)
    #Өглөөний цай уусан эсэх
    is_morning_food_eat = BooleanField(default=True, null=True, blank=True)
    #Бие зассан тоо
    defecate_count = IntegerField(default=1, null=True, blank=True)
    #Хэлэх үг
    word_to_say = TextField()
    date = DateTimeField(null=True, blank=True)
    #Хүүхэд
    student = ForeignKey(Student, on_delete=CASCADE)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = DateTimeField(auto_now=True)

    def filter_fields():
        return ['student__family_name','student__name', 'created_at']