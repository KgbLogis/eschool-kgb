import graphene
from graphene_django.types import DjangoObjectType
from .models import Classes
from apps.school.models import School
from apps.program.models import Program
from apps.section.models import Section
from apps.student.models import Student
from apps.core.models import Activity
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q

class ClassesType(DjangoObjectType):
    class Meta:
        model = Classes

class Query(object):
    all_classess = graphene.List(ClassesType, program=graphene.Int(required=False, default_value=0), offset=graphene.Int(required=False, default_value=0), limit=graphene.Int(required=False, default_value=50), filter=graphene.String(required=False, default_value=''))
    classes_by_id = graphene.Field(ClassesType, id=graphene.Int(required=True))

    @login_required
    def resolve_all_classess(self, info, program, offset, limit, filter):

        fields = Classes.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        if info.context.user.is_superuser==True:
            if program == 0:
                return Classes.objects.filter(Qr)[offset:limit]
            else:
                return Classes.objects.filter(program_id = program)
            
        if info.context.user.is_student==True:
            student = Student.objects.get(user=info.context.user)
            return Classes.objects.filter(pk=student.classes_id)
        else:
            if program == 0:
                return Classes.objects.filter(Qr)[offset:limit]
            else:
                return Classes.objects.filter(program_id = program)

    @login_required
    @permission_required('classes.view_classes')
    def resolve_classes_by_id(root, info, id):
        try:
            return Classes.objects.get(id=id)
        except Classes.DoesNotExist:
            return None

#******************* 😎 Classes-MUTATIONS 😎 *************************#
class CreateClasses(graphene.Mutation):
    classes = graphene.Field(ClassesType)

    class Arguments:
        classes = graphene.String()
        # classes_numeric = graphene.String()
        activity = graphene.Int()
        # max_student_num = graphene.Int()
        # teacher = graphene.Int()
        program = graphene.Int()
        school = graphene.Int()
        status = graphene.String()

    @login_required
    @permission_required('classes.add_classes')
    def mutate(self, info, classes, activity, program, school, status):

        activity_i = Activity.objects.get(pk=activity)
        program_i = Program.objects.get(pk=program)
        school_i = School.objects.get(pk=school)
        create_userID_i = info.context.user

        cla = Classes(classes=classes, activity=activity_i, program=program_i, school=school_i, status=status, create_userID=create_userID_i)
        cla.save()
        
        section = Section(section="A", classes=cla, program=program_i, school=school_i, create_userID = create_userID_i)
        section.save()

        return CreateClasses(classes=cla)

class UpdateClasses(graphene.Mutation):
    classes = graphene.Field(ClassesType)

    class Arguments:
        classes = graphene.String()
        activity = graphene.Int()
        program = graphene.Int()
        school = graphene.Int()
        status = graphene.String()
        id = graphene.ID()

    @login_required
    @permission_required('classes.change_classes')
    def mutate(self, info, classes, activity, program, school, status, id):
        
        classes_o = Classes.objects.get(pk=id)

        if classes_o.program.id != program or classes_o.school.id != school:
            school_i = School.objects.get(pk=school)
            sections = Section.objects.filter(classes=classes_o)
            program_i = Program.objects.get(pk=program)
            for section in sections:
                section.program = program_i
                section.school = school_i
                students = Student.objects.filter(section=section)
                for student in students:
                    student.program = program_i
                    student.school = school_i
                    student.save()
                section.save()
            classes_o.program = program_i
            classes_o.school = school_i
        if classes_o.activity.id != activity:
            activity_i = Activity.objects.get(pk=activity)
            classes_o.activity = activity_i

        classes_o.classes = classes
        classes_o.status = status
        classes_o.save()
        return UpdateClasses(classes=classes_o)
        
class DeleteClasses(graphene.Mutation):
    classes = graphene.Field(ClassesType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('classes.delete_classes')
    def mutate(self, info, **kwargs):
        classes = Classes.objects.get(pk=kwargs["id"])
        if classes is not None:
            classes.delete()
        return DeleteClasses(classes=classes)

class Mutation(graphene.ObjectType):
    create_classes = CreateClasses.Field()
    update_classes = UpdateClasses.Field()
    delete_classes = DeleteClasses.Field()