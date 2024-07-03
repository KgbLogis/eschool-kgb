import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q
from graphene_file_upload.scalars import Upload
from .models import ContactBook
from apps.student.models import Student

class ContactBookType(DjangoObjectType):
    class Meta:
        model = ContactBook


class Query(graphene.ObjectType):

    all_contact_books = graphene.List(
        ContactBookType, filter=graphene.String(required=False, default_value=''))

    @login_required
    @permission_required('contact_book.view_contactbook')
    def resolve_all_contact_books(self, info, filter):

        fields = ContactBook.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter})
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        if info.context.user.is_superuser == True | info.context.user.is_employee == True:
            return ContactBook.objects.filter(Qr).order_by('-created_at')
        if info.context.user.is_student == True:
            student = Student.objects.get(user=info.context.user)
            return ContactBook.objects.filter(Q(student=student), Qr).order_by('-created_at')
        else:
            return ContactBook.objects.filter(Q(create_userID=info.context.user), Qr).order_by('-created_at')


class CreateContactBook(graphene.Mutation):
    contact_book = graphene.Field(ContactBookType)
    class Arguments:
        student = graphene.ID(required=True)
        word_to_say = graphene.String(required=True)
        defecate_count = graphene.Int(required=True)
        is_morning_food_eat = graphene.Boolean(required=True)
        is_sleep = graphene.Boolean(required=True)
        physical_condition = graphene.String(required=True)
        file = Upload(required=False, default_value=None)

    @login_required
    @permission_required('contact_book.add_contactbook')
    def mutate(
        self,
        info,
        student,
        word_to_say,
        defecate_count,
        is_morning_food_eat,
        is_sleep,
        physical_condition,
        file
    ):
        student_o = Student.objects.get(pk=student)
        contact_book = ContactBook(
            student=student_o,
            word_to_say=word_to_say,
            defecate_count=defecate_count,
            is_morning_food_eat=is_morning_food_eat,
            is_sleep=is_sleep,
            physical_condition=physical_condition,
            create_userID=info.context.user
        )
        if file:
            contact_book.file = file
        contact_book.save()
        return CreateContactBook(contact_book=contact_book)

class UpdateContactBook(graphene.Mutation):
    contact_book = graphene.Field(ContactBookType)
    class Arguments:
        id = graphene.ID(required=True)
        student = graphene.ID(required=True)
        word_to_say = graphene.String(required=True)
        defecate_count = graphene.Int(required=True)
        is_morning_food_eat = graphene.Boolean(required=True)
        is_sleep = graphene.Boolean(required=True)
        physical_condition = graphene.String(required=True)
        file = Upload(required=False, default_value=None)

    @login_required
    @permission_required('contact_book.change_contactbook')
    def mutate(
        self,
        info,
        id,
        student,
        word_to_say,
        defecate_count,
        is_morning_food_eat,
        is_sleep,
        physical_condition,
        file
    ):
        contact_book = ContactBook.objects.get(pk=id)
        student_o = Student.objects.get(pk=student)

        contact_book.student = student_o
        contact_book.word_to_say = word_to_say
        contact_book.defecate_count=defecate_count
        contact_book.is_morning_food_eat=is_morning_food_eat
        contact_book.is_sleep=is_sleep
        contact_book.physical_condition=physical_condition
        if file:
            contact_book.file = file
        contact_book.save()
        return UpdateContactBook(contact_book=contact_book)

class DeleteContactBook(graphene.Mutation):
    contact_book = graphene.Field(ContactBookType)
    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    @permission_required('contact_book.delete_contactbook')
    def mutate(self, info, id):
        contact_book = ContactBook.objects.get(pk=id)
        contact_book.delete()
        return DeleteContactBook(contact_book=contact_book)

class Mutation(graphene.ObjectType):
    create_contact_book = CreateContactBook.Field()
    update_contact_book = UpdateContactBook.Field()
    delete_contact_book = DeleteContactBook.Field()