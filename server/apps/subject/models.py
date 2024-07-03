from django.db.models import Model, CharField, DateTimeField, ForeignKey, CASCADE
from django.conf import settings
from apps.school.models import School
from apps.sub_school.models import Sub_school

# Create your models here.
class Subject(Model):
  
    school = ForeignKey(School, on_delete=CASCADE)
    sub_school = ForeignKey(Sub_school, on_delete=CASCADE)
    subject = CharField(max_length=200)
    content = CharField(max_length=200, null=True, blank=True)
    credit = CharField(max_length=50)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    def __str__(self):
        return self.subject

    def filter_fields():
        return ['school__name','subject','credit']
