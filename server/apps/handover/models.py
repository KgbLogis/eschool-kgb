from django.db.models import Model, ForeignKey, CASCADE, DateField, Field, TextField, BooleanField
from datetime import datetime
import random
from apps.student.models import Student
from django.conf import settings

class UniqueCodeField(Field):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 15
        kwargs['unique'] = True
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs['max_length']
        return name, path, args, kwargs

    def db_type(self, connection):
        return 'char(15)'

    def pre_save(self, model_instance, add):
        if add:
            year = datetime.now().year
            month = datetime.now().month
            day = datetime.now().day
            unique_code = f"{year}{month}{day}{random.randint(1000, 9999)}"
            setattr(model_instance, self.attname, unique_code)
            return unique_code
        else:
            return super().pre_save(model_instance, add)

class HandOver(Model):
    student = ForeignKey(Student, on_delete=CASCADE)
    date = DateField(auto_now_add=True)
    code = UniqueCodeField()
    desc = TextField(null=True, blank=True)
    is_successed = BooleanField(default=False)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE, null=True, blank=True, related_name="handover_create_userID")
    edit_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE, null=True, blank=True, related_name="handover_edit_userID")

