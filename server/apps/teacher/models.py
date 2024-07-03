from django.conf import settings
from django.db.models import DateTimeField, DateField, Model, TextField, CharField, ForeignKey, ImageField, EmailField, OneToOneField, CASCADE
from apps.core.models import City, District, Teacher_status, Degree
from django.conf import settings
from apps.school.models import School
from apps.sub_school.models import Sub_school
from tenants.middlewares import get_current_db_name

def user_directory_path(instance, filename):
    upload_path = 'default'
    if(get_current_db_name()!=None):
        upload_path = get_current_db_name()
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'uploads/'+upload_path+'/photo/user_{0}/{1}'.format(instance.user.id, filename)

class Teacher(Model):
    ACCESS_CHOICES = (
        ('A_1', 'Багш',),
        ('A_2', 'Туслах багш'),
    )
    user = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    teacher_code = CharField(unique=True, max_length=40)
    access = CharField(
        max_length=10,
        choices=ACCESS_CHOICES,
        default='A_1'
    )
    family_name = CharField(max_length=100)
    name = CharField(max_length=100)
    registerNo = CharField(max_length=50)
    photo = ImageField(upload_to=user_directory_path, default='default.jpg')
    phone = CharField(max_length=8, blank=True)
    phone2 = CharField(max_length=8, blank=True)
    address = TextField(blank=True)
    # prop_degree = ForeignKey(Prop_Degree, on_delete=CASCADE, null=True, blank=True)
    degree = ForeignKey(Degree, on_delete=CASCADE, null=True, blank=True)
    join_date = DateField(blank=True)
    join_before = CharField(blank=True, max_length=120)
    sex = CharField(max_length=10)
    birthdate = DateField(blank=True)
    birth_city = ForeignKey(City, on_delete=CASCADE)
    birth_district = ForeignKey(District, on_delete=CASCADE)
    status = ForeignKey(Teacher_status, on_delete=CASCADE)
    school = ForeignKey(School, on_delete=CASCADE)
    sub_school = ForeignKey(Sub_school, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    create_userID = ForeignKey(settings.AUTH_USER_MODEL, related_name = 'create_userID', on_delete=CASCADE)

    def __str__(self):
        return 'id: '+str(self.pk)+' | family_name: '+self.family_name+' | name: '+str(self.name)

    def access_teacher(teacher):
        return Teacher.objects.filter(pk=teacher.pk).values('id')
        # if teacher.access == 'A_1':
        #     return Teacher.objects.all().values('id')
        # elif teacher.access == 'A_2':
        #     return Teacher.objects.filter(school=teacher.school).values('id')
        # elif teacher.access == 'A_3':
        #     return Teacher.objects.filter(sub_school=teacher.sub_school).values('id')
        # elif teacher.access == 'A_4':
        #     return Teacher.objects.filter(pk=teacher.pk).values('id')

    def filter_fields():
        return ['teacher_code','registerNo','family_name','name', 'phone','phone2','school__name','sub_school__name', 'join_date']
