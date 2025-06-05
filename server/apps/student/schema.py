import email
import graphene
from graphene_django.types import DjangoObjectType
from graphene_file_upload.scalars import Upload
from .models import Student, Transfer
from apps.core.models import City, District, Student_status, Student_status_extra, Activity, Classtime
from apps.teacher.models import Teacher
from apps.school.models import School
from apps.program.models import Program
from apps.classes.models import Classes
from apps.section.models import Section
from apps.schoolyear.models import Schoolyear
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q
from school.utils import custom_paginate
from datetime import datetime
from graphql import GraphQLError
from graphql_jwt.shortcuts import get_token

class StudentType(DjangoObjectType):
    class Meta:
        model = Student
        exclude = ('expire_date',)
        
    photo = graphene.String()
    is_paid = graphene.Boolean()

    def resolve_photo(self, info):
        
        if self.sex == "Эрэгтэй":
            return 'avatar01.png'
        else:
            return 'avatar02.png'
        
    def resolve_is_paid(self, info):
        if self.expire_date.date() > datetime.now().date():
            return True
        else:
            return False

class TransferType(DjangoObjectType):
    class Meta:
        model = Transfer

class Student_paginationType(graphene.ObjectType):
    page = graphene.Int()
    per_page = graphene.Int()
    page_count = graphene.Int()
    total_count = graphene.Int()
    records = graphene.List(StudentType)

class Query(object):
    all_students_report = graphene.List(
        StudentType
    )
    all_students = graphene.List(
        StudentType, 
        program=graphene.Int(required=False, default_value=0),
        classes=graphene.Int(required=False, default_value=0),
        section=graphene.Int(required=False, default_value=0),
        filter=graphene.String(required=False, default_value='')
    )
    all_students_pagination = graphene.Field(
        Student_paginationType,
        page=graphene.Int(),
        per_page=graphene.Int(),
        filter=graphene.String(required=False, default_value='')
    )
    student_by_id = graphene.Field(StudentType, id=graphene.Int(required=True))
    transfers_by_student = graphene.List(TransferType, student=graphene.Int(required=True))
        
    @login_required
    def resolve_all_students_report(self, info):
        return Student.objects.all()
    
    @login_required
    def resolve_all_students(self, info, program, classes, section, filter):
    

        fields = Student.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        # if info.context.user.is_superuser==True:
        #     return Student.objects.filter(Qr)

        IDQr = Q()

        if not program==0:
            IDQr = Q(program=program)

        if not classes==0:
            IDQr = Q(classes=classes)

        if not section==0:
            IDQr = Q(section=section)
            
        if info.context.user.is_student==True:
            return Student.objects.filter(Q(user=info.context.user), Qr)
        if info.context.user.is_parent==True:
            return Student.objects.filter(id=info.context.user.parent.student.id)
        if info.context.user.is_teacher==True:
            teacher_o = Teacher.objects.get(user=info.context.user)
            section_o = Section.objects.filter(teacher=teacher_o)
            if not section_o:
                return None
            return Student.objects.filter(Q(section__in=section_o), Qr)
            #  students
            # if students is None:
            #     return None
            # else:
        else: 
            return Student.objects.filter(IDQr, Qr)

    @login_required
    @permission_required('subject.view_subject')
    def resolve_all_students_pagination(self, info, page, per_page, filter):
        fields = Student.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        if info.context.user.is_student==True:
            query_set =  Student.objects.filter(Q(user=info.context.user), Qr)
        elif info.context.user.is_parent==True:
            query_set =  Student.objects.filter(id=info.context.user.parent.student.id)
        elif info.context.user.is_teacher==True:
            teacher_o = Teacher.objects.get(user=info.context.user)
            section_o = Section.objects.filter(teacher=teacher_o)
            if not section_o:
                query_set =  Student.objects.none()
            else: 
                query_set =  Student.objects.filter(Q(section__in=section_o), Qr)
        else: 
            query_set = Student.objects.filter(Qr)
            
        subjects = custom_paginate(
            query_set.order_by('-created_at'), 
            int(page), 
            int(per_page)
        )
        page_count = query_set.count() / per_page
        total_count = query_set.count()   

        
        return {
            'page_count': page_count,
            'total_count': total_count,
            'records': subjects,
            'page': page,
            'per_page': per_page
        }
    
    @login_required
    @permission_required('student.view_student')
    def resolve_student_by_id(root, info, id):
        if info.context.user.is_student==True:
            return Student.objects.get(user=info.context.user)
        else:
            return Student.objects.get(id=id)

    @login_required
    @permission_required('student.change_student')
    def resolve_transfers_by_student(root, info, student):
        try:
            return Transfer.objects.filter(student_id=student)
        except Transfer.DoesNotExist:
            return None

#******************* 😎 Student-MUTATIONS 😎 *************************#
class CreateStudent(graphene.Mutation):
    student = graphene.Field(StudentType)

    class Arguments:
        family_name = graphene.String()
        name = graphene.String()
        # photo = Upload()
        phone = graphene.String()
        address = graphene.String()
        join_schoolyear = graphene.String()
        sex = graphene.String()
        classtime = graphene.Int()
        status = graphene.Int()
        status_extra = graphene.Int()
        activity = graphene.Int()
        school = graphene.Int()
        program = graphene.Int()
        classes = graphene.Int()
        section = graphene.Int()
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    @login_required
    @permission_required('student.add_student')
    def mutate(self, info, family_name, name, phone, address, sex, classtime, activity, password, email, school, section, program, classes, status, status_extra, join_schoolyear):


        errors = {}

        # Check if phone exists
        if get_user_model().objects.filter(username=phone).exists():
            errors["phone"] = "Утасны дугаар бүртгэлтэй байна"

        # Check if email exists
        if get_user_model().objects.filter(email=email).exists():
            errors["email"] = "И-мэйл хаяг бүртгэлтэй байна"
          
        VALID_SEX_VALUES = ["Эрэгтэй", "Эмэгтэй"]

        if sex not in VALID_SEX_VALUES:
            errors["sex"] = "Хүйс буруу байна"
        # If any errors, raise them
        if errors:
            raise GraphQLError("Validation failed", extensions={"errors": errors})
        
        classtime_i = Classtime.objects.get(pk=classtime)
        activity_i = Activity.objects.get(pk=activity)
        join_schoolyear_i = Schoolyear.objects.get(pk=join_schoolyear)
        school_i = School.objects.get(pk=school)
        section_i = Section.objects.get(pk=section)
        program_i = Program.objects.get(pk=program)
        classes_i = Classes.objects.get(pk=classes)
        status_i = Student_status.objects.get(pk=status)
        status_extra_i = Student_status_extra.objects.get(pk=status_extra)
        
        current_year = datetime.now().year
        
        try:
            student = Student.objects.all().latest("student_code")
            student_code = student.student_code[-3:]
            student_code = "{:03d}".format(int(student_code) + 1)
            formatted_code = "{:03d}".format(int(student_code) + 1)
            student_code = "s"+str(current_year)[-2:] + formatted_code
        except Student.DoesNotExist:
            student_code = "s"+str(current_year)[-2:] + "001"
        
        userob = get_user_model()(username=phone,email=email,first_name=name,last_name=family_name,is_student=True,is_teacher=False,is_parent=False,)
        userob.set_password(password)
        userob.verified = True
        userob.save()
        user_i = get_user_model().objects.get(pk=userob.pk)

        group = Group.objects.get(pk=2)
        group.user_set.add(user_i)
        stu = Student(
            user=user_i, 
            student_code=student_code, 
            family_name=family_name, 
            name=name, 
            phone=phone,
            address=address, 
            join_schoolyear=join_schoolyear_i,
            sex=sex, 
            classtime=classtime_i, 
            activity=activity_i,
            school=school_i,
            program=program_i,
            classes=classes_i,
            section=section_i,
            status=status_i,
            status_extra=status_extra_i,
        )
        # if photo != '':
        #     stu.photo = photo

        stu.save()

        return CreateStudent(student=stu)

class UpdateStudent(graphene.Mutation):
    student = graphene.Field(StudentType)

    class Arguments:
        family_name = graphene.String()
        name = graphene.String()
        phone = graphene.String()
        address = graphene.String()
        join_schoolyear = graphene.String()
        sex = graphene.String()
        email = graphene.String()
        section = graphene.Int()
        activity = graphene.Int()
        classtime = graphene.Int()
        status_extra = graphene.Int()
        status = graphene.Int()
        school = graphene.Int()
        program = graphene.Int()
        id = graphene.ID()

    @login_required
    @permission_required('student.change_student')
    def mutate(self, info, photo='', **kwargs):

        student = Student.objects.get(pk=kwargs["id"])

        user_o = get_user_model().objects.get(pk = student.user_id)
        
        errors = {}

        # Check if phone exists
        if get_user_model().objects.filter(username=kwargs["phone"]).exclude(pk=user_o.id).exists():
            errors["phone"] = "Утасны дугаар бүртгэлтэй байна"

        # Check if email exists
        if get_user_model().objects.filter(email=kwargs["email"]).exclude(pk=user_o.id).exists():
            errors["email"] = "И-мэйл хаяг бүртгэлтэй байна"
          
        # If any errors, raise them
        if errors:
            raise GraphQLError("Validation failed", extensions={"errors": errors})

        user_o.username = kwargs["phone"]
        user_o.email = kwargs["email"]
        user_o.last_name = kwargs["family_name"]
        user_o.first_name = kwargs["name"]
        user_o.is_student = True
        user_o.save()

        status_o = Student_status.objects.get(pk = kwargs["status"])
        section_o = Section.objects.get(pk = kwargs["section"])
        activity_o = Activity.objects.get(pk = kwargs["activity"])
        classtime_o = Classtime.objects.get(pk = kwargs["classtime"])
        status_extra_o = Student_status_extra.objects.get(pk = kwargs["status_extra"])
        school_o = School.objects.get(pk = kwargs["school"])
        program_o = Program.objects.get(pk = kwargs["program"])

        student.status = status_o
        student.section = section_o
        student.activity = activity_o
        student.classtime = classtime_o
        student.status_extra = status_extra_o
        student.school = school_o
        student.program = program_o
        student.family_name = kwargs["family_name"]
        student.name = kwargs["name"]
        if photo != '':
            student.photo = photo
        student.phone = kwargs["phone"]
        student.address = kwargs["address"]
        student.join_schoolyear_id = kwargs["join_schoolyear"]
        student.sex = kwargs["sex"]
        student.save()
        return UpdateStudent(student=student)

class DeleteStudent(graphene.Mutation):
    student = graphene.Field(StudentType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('student.delete_student')
    def mutate(self, info, **kwargs):
        student = Student.objects.get(pk=kwargs["id"])
        if student is not None:
            userob = get_user_model()(pk = student.user_id)
            userob.delete()
            student.delete()
        return DeleteStudent(student=student)

#******************* 😎 Transfer-MUTATIONS 😎 *************************#
class TransferStudent(graphene.Mutation):
    transfer = graphene.Field(TransferType)

    class Arguments:
        student = graphene.Int()
        status = graphene.Int()
        status_extra = graphene.Int()
        classtime = graphene.Int()
        activity = graphene.Int()
        school = graphene.Int()
        program = graphene.Int()
        classes = graphene.Int()
        section = graphene.Int()
        doc_date = graphene.String()
        doc_num = graphene.String()
        description = graphene.String()

    @login_required
    @permission_required('student.change_student')
    def mutate(self, info, student, status, status_extra, classtime, activity, school, program, classes, section, doc_date, doc_num, description):

        student_i = Student.objects.get(pk=student)

        transfer_i = Transfer(student=student_i, status_id=status, status_extra_id=status_extra, classtime_id=classtime, activity_id=activity, school_id=school, program_id=program, classes_id=classes, section_id=section,doc_date=doc_date, doc_num=doc_num, description=description,old_data = str(student_i), create_userID=info.context.user)
        transfer_i.save()

        return TransferStudent(transfer=transfer_i)
        
class Register(graphene.Mutation):
    
    success = graphene.Boolean()
    token = graphene.String()

    class Arguments:
        name = graphene.String()
        family_name = graphene.String()
        phone = graphene.Int()
        address = graphene.String()
        sex = graphene.String()
        classtime = graphene.ID()
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, name, family_name, phone, address, sex, classtime, password, email):
        
        errors = {}

        # Check if phone exists
        if get_user_model().objects.filter(username=phone).exists():
            errors["phone"] = "Утасны дугаар бүртгэлтэй байна"

        # Check if email exists
        if get_user_model().objects.filter(email=email).exists():
            errors["email"] = "И-мэйл хаяг бүртгэлтэй байна"
          
        VALID_SEX_VALUES = ["Эрэгтэй", "Эмэгтэй"]

        if sex not in VALID_SEX_VALUES:
            errors["sex"] = "Хүйс буруу байна"
        # If any errors, raise them
        if errors:
            raise GraphQLError("Validation failed", extensions={"errors": errors})
        
        
        classtime_i = Classtime.objects.get(pk=classtime)
        activity_i = Activity.objects.get(name="Ердийн")
        status_i = Student_status.objects.get(name="Шинээр бүртгүүлсэн")
        status_extra_i = Student_status_extra.objects.get(name="Үндсэн элсэлт")
        join_schoolyear_i = Schoolyear.objects.get(is_current=True)

        current_year = join_schoolyear_i.start_date.year
        
        try:
            student = Student.objects.all().latest("student_code")
            student_code = student.student_code[-3:]
            student_code = "{:03d}".format(int(student_code) + 1)
            formatted_code = "{:03d}".format(int(student_code) + 1)
            student_code = "s"+str(current_year)[-2:] + formatted_code
        except Student.DoesNotExist:
            student_code = "s"+str(current_year)[-2:] + "001"
        
        userob = get_user_model()(username=phone,email=email,first_name=name,last_name=family_name,is_student=True,is_teacher=False,is_parent=False,)
        userob.set_password(password)
        userob.verified = True
        userob.save()
        
        token = get_token(userob)
        
        user_i = get_user_model().objects.get(pk=userob.pk)

        group = Group.objects.get(pk=2)
        group.user_set.add(user_i)
        stu = Student(
            user=user_i, 
            student_code=student_code,
            family_name=family_name, 
            name=name,
            phone=phone, 
            address=address, 
            join_schoolyear=join_schoolyear_i,
            sex=sex, 
            classtime=classtime_i, 
            activity=activity_i,
            status=status_i,
            status_extra=status_extra_i
        )

        stu.save()

        return Register(
            success=True,
            token=token
        )

class Mutation(graphene.ObjectType):
    create_student = CreateStudent.Field()
    update_student = UpdateStudent.Field()
    delete_student = DeleteStudent.Field()
    transfer_student = TransferStudent.Field()
    register = Register.Field()