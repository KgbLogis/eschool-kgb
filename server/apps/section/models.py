from django.db.models import CharField, ForeignKey, DateTimeField, IntegerField, CASCADE, Model
from django.conf import settings
from apps.sub_school.models import Sub_school
from apps.school.models import School
from apps.program.models import Program
from apps.classes.models import Classes
from apps.teacher.models import Teacher

class Section(Model):
    section = CharField(max_length=150)
    classes = ForeignKey(Classes, on_delete=CASCADE)
    program = ForeignKey(Program, on_delete=CASCADE)
    max_student_num = IntegerField(default=1)
    teacher = ForeignKey(Teacher, on_delete=CASCADE, null=True, blank=True)
    school = ForeignKey(School, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    def __str__(self):
        return 'id: '+str(self.pk)+' | section: '+self.section+' | classes: ('+str(self.classes)+') | program: ('+str(self.program)+')'
