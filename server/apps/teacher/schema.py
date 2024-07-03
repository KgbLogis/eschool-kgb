import graphene
from graphene_django.types import DjangoObjectType
from graphene_file_upload.scalars import Upload
from .models import Teacher
from apps.core.models import City, District, Teacher_status, Degree
from apps.school.models import School
from apps.sub_school.models import Sub_school
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from apps.subject.models import Subject
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q

class TeacherType(DjangoObjectType):
    class Meta:
        model = Teacher

class Query(object):
    all_teachers = graphene.List(TeacherType, offset=graphene.Int(required=False, default_value=0), limit=graphene.Int(required=False, default_value=50), filter=graphene.String(required=False, default_value=''))
    teacher_by_id = graphene.Field(TeacherType, id=graphene.Int(required=True))

    @login_required
    def resolve_all_teachers(self, info, offset, limit, filter, subject=None):

        fields = Teacher.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        # if info.context.user.is_superuser==True:
        #     return Teacher.objects.filter(Qr)

        if info.context.user.is_student==True:
            return None
        if info.context.user.is_teacher==True:
            teachers = Teacher.access_teacher(Teacher.objects.get(user=info.context.user))
            print(Teacher.objects.get(user=info.context.user).access)
            return Teacher.objects.filter(Q(pk__in=teachers), Qr)

        else: 
            return Teacher.objects.filter(Qr)

    @login_required
    @permission_required('teacher.view_teacher')
    def resolve_teacher_by_id(root, info, id):
        try:
            return Teacher.objects.get(pk=id)
        except Teacher.DoesNotExist:
            return None

#******************* 😎 Teacher-MUTATIONS 😎 *************************#
class CreateTeacher(graphene.Mutation):
    teacher = graphene.Field(TeacherType)

    class Arguments:
        teacher_code = graphene.String(required=True)
        access = graphene.String(required=True)
        family_name = graphene.String()
        name = graphene.String()
        registerNo = graphene.String()
        photo = Upload()
        phone = graphene.String()
        phone2 = graphene.String()
        degree = graphene.Int()
        address = graphene.String()
        join_date = graphene.String()
        join_before = graphene.String()
        sex = graphene.String()
        birthdate = graphene.String()
        birth_city = graphene.Int()
        birth_district = graphene.Int()
        status = graphene.Int()
        school = graphene.Int()
        sub_school = graphene.Int()

        password = graphene.String(required=True)
        username = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, teacher_code, access, family_name, name, registerNo, phone, phone2, degree, address, join_date, join_before, sex, birthdate, birth_city, birth_district, status, school, sub_school, password, username, email, photo=''):
        
        birth_city_i = City.objects.get(pk=birth_city)
        birth_district_i = District.objects.get(pk=birth_district)
        status_i = Teacher_status.objects.get(pk=status)
        school_i = School.objects.get(pk=school)
        sub_school_i = Sub_school.objects.get(pk=sub_school)
        create_userID_i = info.context.user
        degree_i = Degree.objects.get(pk=degree)
        
        userob = get_user_model()(username=username,email=email,first_name=name,last_name=family_name,is_student=False,is_teacher=True,is_parent=False,)
        userob.set_password(password)
        userob.save()
        user_i = get_user_model().objects.get(pk=userob.pk)

        
        group = Group.objects.get(pk=1)
        group.user_set.add(user_i)

        teacher_o = Teacher(user=user_i, teacher_code=teacher_code, access='A_'+access, family_name=family_name, name=name, registerNo=registerNo, phone=phone, phone2=phone2, degree=degree_i, address=address, join_date=join_date, join_before=join_before, sex=sex, birthdate=birthdate, birth_city=birth_city_i, birth_district=birth_district_i, status=status_i, school=school_i, sub_school=sub_school_i, create_userID = create_userID_i)

        # if photo != '':
        #     teacher_o.photo = photo

        teacher_o.save()
        return CreateTeacher(teacher=teacher_o)

class UpdateTeacher(graphene.Mutation):
    teacher = graphene.Field(TeacherType)

    class Arguments:
        teacher_code = graphene.String()
        access = graphene.String()
        family_name = graphene.String()
        name = graphene.String()
        registerNo = graphene.String()
        photo = Upload()
        phone = graphene.String()
        phone2 = graphene.String()
        degree = graphene.Int()
        address = graphene.String()
        join_date = graphene.String()
        join_before = graphene.String()
        sex = graphene.String()
        birthdate = graphene.String()
        birth_city = graphene.Int()
        birth_district = graphene.Int()
        status = graphene.Int()
        school = graphene.Int()
        sub_school = graphene.Int()
        username = graphene.String()
        email = graphene.String()
        id = graphene.ID(required=True)

    @login_required
    @permission_required('teacher.change_teacher')
    def mutate(self, info, photo='', **kwargs):

        teacher_o = Teacher.objects.get(pk=kwargs["id"])
        birth_city_i = City.objects.get(pk=kwargs["birth_city"])
        birth_district_i = District.objects.get(pk=kwargs["birth_district"])
        status_i = Teacher_status.objects.get(pk=kwargs["status"])
        school_i = School.objects.get(pk=kwargs["school"])
        degree_i = Degree.objects.get(pk=kwargs["degree"])
        sub_school_i = Sub_school.objects.get(pk=kwargs["sub_school"])
        user_o = get_user_model().objects.get(pk = teacher_o.user_id)

        user_o.username = kwargs["username"]
        user_o.last_name = kwargs["family_name"]
        user_o.first_name = kwargs["name"]
        user_o.email = kwargs["email"]
        user_o.is_teacher = True
        user_o.save()
        
        teacher_o.teacher_code = kwargs["teacher_code"]
        if teacher_o.access != 'A_'+kwargs["access"]:
            if "['" in kwargs["access"]:
                x = kwargs["access"].replace("['", "")
                x = x.replace("']", "")
                teacher_o.access = 'A_'+x
            else:
                teacher_o.access = 'A_'+kwargs["access"]
        teacher_o.family_name = kwargs["family_name"]
        teacher_o.name = kwargs["name"]
        teacher_o.registerNo = kwargs["registerNo"]
        if photo != '':
            teacher_o.photo = photo
        teacher_o.phone = kwargs["phone"]
        teacher_o.phone2 = kwargs["phone2"]
        teacher_o.degree = degree_i
        teacher_o.address = kwargs["address"]
        teacher_o.join_date = kwargs["join_date"]
        teacher_o.join_before = kwargs["join_before"]
        teacher_o.sex = kwargs["sex"]
        teacher_o.birthdate = kwargs["birthdate"]
        teacher_o.birth_city = birth_city_i
        teacher_o.birth_district = birth_district_i
        teacher_o.status = status_i
        teacher_o.school = school_i
        teacher_o.sub_school = sub_school_i
        teacher_o.save()
        return UpdateTeacher(teacher=teacher_o)

class DeleteTeacher(graphene.Mutation):
    teacher = graphene.Field(TeacherType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('teacher.delete_teacher')
    def mutate(self, info, **kwargs):
        teacher = Teacher.objects.get(pk=kwargs["id"])
        if teacher is not None:
            userob = get_user_model()(pk = teacher.user_id)
            userob.delete()
            teacher.delete()
        return DeleteTeacher(teacher=teacher)

class Mutation(graphene.ObjectType):
    create_teacher = CreateTeacher.Field()
    update_teacher = UpdateTeacher.Field()
    delete_teacher = DeleteTeacher.Field()