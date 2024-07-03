from django.db.models import CharField, ForeignKey, DateTimeField, IntegerField, CASCADE, Model
from django.conf import settings
from apps.sub_school.models import Sub_school
from apps.school.models import School
from apps.program.models import Program
from apps.teacher.models import Teacher
from apps.core.models import Degree, Activity

class Classes(Model):
    STATUS_CHOICES = (
        ('OPEN', 'Суралцаж буй',),
        ('CLOSED', 'Төгссөн',),
    )
    classes = CharField(max_length=150)
    activity = ForeignKey(Activity, on_delete=CASCADE)
    program = ForeignKey(Program, on_delete=CASCADE)
    school = ForeignKey(School, on_delete=CASCADE)
    status = CharField(
        max_length=30,
        choices=STATUS_CHOICES,
    )
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    def __str__(self):
        return 'id: '+str(self.pk)+' | classes: '+self.classes

    def filter_fields():
        return ['classes']
