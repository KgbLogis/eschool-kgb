import graphene
from graphene_django.types import DjangoObjectType
from .models import Section
from .models import Classes
from apps.school.models import School
from apps.program.models import Program
from apps.classes.models import Classes
from apps.student.models import Student
from apps.teacher.models import Teacher
from graphql_jwt.decorators import login_required, permission_required

class SectionType(DjangoObjectType):
    class Meta:
        model = Section

class Query(object):
    all_sections = graphene.List(SectionType)
    sections_by_classes = graphene.List(SectionType, classes=graphene.Int(required=True))
    sections_by_program = graphene.List(SectionType, program=graphene.Int(required=True))
    section_by_id = graphene.Field(SectionType, id=graphene.Int(required=True))

    @login_required
    def resolve_all_sections(self, info, **kwargs):
        if info.context.user.is_superuser==True:
            return Section.objects.all()

        if info.context.user.is_student==True:
            student = Student.objects.get(user=info.context.user)
            return Section.objects.filter(pk=student.section_id)
        else:
            # programs = Program.access_program(Teacher.objects.get(user=info.context.user))
            # return Section.objects.filter(program_id__in=programs)
            return Section.objects.all()

    @login_required
    def resolve_sections_by_classes(root, info, classes):
        try:
            return Section.objects.filter(classes_id=classes)
        except Section.DoesNotExist:
            return None

    @login_required
    def resolve_sections_by_program(root, info, program):
        try:
            return Section.objects.filter(program_id=program)
        except Section.DoesNotExist:
            return None

    @login_required
    @permission_required('section.view_section')
    def resolve_section_by_id(root, info, id):
        try:
            return Section.objects.get(pk=id)
        except Section.DoesNotExist:
            return None

#******************* 😎 Section-MUTATIONS 😎 *************************#
class CreateSection(graphene.Mutation):
    section = graphene.Field(SectionType)

    class Arguments:
        section = graphene.String()
        max_student_num = graphene.Int()
        teacher = graphene.Int()
        classes = graphene.Int()
        program = graphene.Int()
        school = graphene.Int()

    @login_required
    @permission_required('section.add_section')
    def mutate(self, info, section, classes, program, max_student_num, school, teacher):

        school_i = School.objects.get(pk=school)
        teacher_i = Teacher.objects.get(pk=teacher)
        program_i = Program.objects.get(pk=program)
        classes_i = Classes.objects.get(pk=classes)
        create_userID_i = info.context.user

        section = Section(section=section, teacher=teacher_i, classes=classes_i, program=program_i, school=school_i, max_student_num=max_student_num, create_userID = create_userID_i)
        section.save()
        return CreateSection(section=section)

class UpdateSection(graphene.Mutation):
    section = graphene.Field(SectionType)

    class Arguments:
        max_student_num = graphene.Int()
        section = graphene.String()
        teacher = graphene.Int()
        classes = graphene.Int()
        program = graphene.Int()
        school = graphene.Int()
        id = graphene.ID()

    @login_required
    @permission_required('section.change_section')
    def mutate(self, info, section, classes, program, max_student_num, school, id, teacher):

        section_o = Section.objects.get(pk=id)
        school_i = School.objects.get(pk=school)
        teacher_i = Teacher.objects.get(pk=teacher)
        program_i = Program.objects.get(pk=program)
        classes_i = Classes.objects.get(pk=classes)
        
        section_o.section = section
        section_o.max_student_num = max_student_num
        section_o.school = school_i
        section_o.teacher = teacher_i
        section_o.program = program_i
        section_o.classes = classes_i
        section_o.save()
        return UpdateSection(section=section_o)

class DeleteSection(graphene.Mutation):
    section = graphene.Field(SectionType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('section.delete_section')
    def mutate(self, info, **kwargs):
        section = Section.objects.get(pk=kwargs["id"])
        if section is not None:
            section.delete()
        return DeleteSection(section=section)

class Mutation(graphene.ObjectType):
    create_section = CreateSection.Field()
    update_section = UpdateSection.Field()
    delete_section = DeleteSection.Field()