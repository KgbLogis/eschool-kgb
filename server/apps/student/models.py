from unittest import TextTestRunner
from django.conf import settings
from django.db.models import DateTimeField, DateField, Model, TextField, CharField, ForeignKey, IntegerField, ImageField, BooleanField, OneToOneField, CASCADE
from apps.core.models import City, District, Student_status, Student_status_extra, Activity, Degree, Classtime
from django.conf import settings
from apps.school.models import School
from apps.program.models import Program
from apps.classes.models import Classes
from apps.section.models import Section
from apps.schoolyear.models import Schoolyear
from tenants.middlewares import get_current_db_name

def user_directory_path(instance, filename):
    upload_path = 'default'
    if(get_current_db_name()!=None):
        upload_path = get_current_db_name()
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'uploads/'+upload_path+'/photo/user_{0}/{1}'.format(instance.user.id, filename)

class Student(Model):
    user = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    is_paid = BooleanField(default=False)
    student_code = CharField(unique=True, max_length=40)
    registerNo = CharField(max_length=50)
    religion = CharField(max_length=100)
    surname = CharField(max_length=100)
    family_name = CharField(max_length=100)
    name = CharField(max_length=100)
    nationality = CharField(max_length=100)
    state = CharField(max_length=100)
    photo = ImageField(upload_to=user_directory_path, default='default.jpg')
    phone = CharField(max_length=8, blank=True)
    address = TextField(blank=True)
    join_date = CharField(blank=True, max_length=20)
    join_schoolyear = ForeignKey(Schoolyear, on_delete=CASCADE)
    sex = CharField(max_length=10)
    classtime = ForeignKey(Classtime, on_delete=CASCADE)
    status = ForeignKey(Student_status, on_delete=CASCADE)
    status_extra = ForeignKey(Student_status_extra, on_delete=CASCADE)
    activity = ForeignKey(Activity, on_delete=CASCADE)
    birthdate = DateField(blank=True)
    birth_city = ForeignKey(City, on_delete=CASCADE)
    birth_district = ForeignKey(District, on_delete=CASCADE)
    school = ForeignKey(School, on_delete=CASCADE)
    program = ForeignKey(Program, on_delete=CASCADE)
    classes = ForeignKey(Classes, on_delete=CASCADE)
    section = ForeignKey(Section, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, related_name = 'create_user', on_delete=CASCADE)

    def __str__(self):
        return 'family_name: '+self.family_name+' | name: '+str(self.name) + ' | is_paid: ' +str(self.is_paid)
        
    def access_student(teacher):
        section = Section.objects.filter(teacher=teacher).values('id')
        if not section:
            return None
        return Student.objects.filter(section=section).values('id')
        # if teacher.access == 'A_1':
        #     return Student.objects.all().values('id')
        # elif teacher.access == 'A_2':
        #     return Student.objects.filter(school=teacher.school).values('id')
        # elif teacher.access == 'A_3':
        #     programs = Program.objects.filter(sub_school=teacher.sub_school).values('id')
        #     return Student.objects.filter(program__in=programs).values('id')
        # elif teacher.access == 'A_4':
        #     classes = Classes.objects.filter(teacher=teacher).values('id')
        #     if not classes:
        #         return None
        #     return Student.objects.filter(classes=classes).values('id')

    def filter_fields():
        return ['student_code','registerNo','surname','family_name','name', 'phone','school__name','program__program','classes__classes']
        # 'program__program_numeric',
        # ,'classes__classes_numeric'

class Transfer(Model):
    student = ForeignKey(Student, on_delete=CASCADE)
    school = ForeignKey(School, on_delete=CASCADE)
    program = ForeignKey(Program, on_delete=CASCADE)
    classes = ForeignKey(Classes, on_delete=CASCADE)
    section = ForeignKey(Section, on_delete=CASCADE)
    status = ForeignKey(Student_status, on_delete=CASCADE)
    status_extra = ForeignKey(Student_status_extra, on_delete=CASCADE)
    classtime = ForeignKey(Classtime, on_delete=CASCADE)
    activity = ForeignKey(Activity, on_delete=CASCADE)
    doc_date = CharField(blank=True, max_length=120)
    doc_num = CharField(blank=True, max_length=120)
    description = TextField(blank=True)
    old_data = TextField()
    created_at = DateTimeField(auto_now_add=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)