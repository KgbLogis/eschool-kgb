import graphene
from graphene_django.types import DjangoObjectType
from .models import CustomUser
from apps.student.models import Student
from apps.teacher.models import Teacher
from apps.parent.models import Parent
from apps.employee.models import Employee
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token
from graphene.types.generic import GenericScalar

class AccountType(DjangoObjectType):
    class Meta:
        model = CustomUser
        
    avatar = graphene.String()

    def resolve_avatar(self, info):
        return 'avatar01.png'


class Custom_accountType(graphene.ObjectType):
    email = graphene.String()
    family_name = graphene.String()
    name = graphene.String()
    phone = graphene.String()
    phone2 = graphene.String()
    address = graphene.String()

class ErrorType(graphene.ObjectType):
    message = graphene.String()
    code = graphene.String()

class PasswordChangeErrorsType(graphene.ObjectType):
    non_field_errors = graphene.List(ErrorType)

class PasswordChangeResponse(graphene.ObjectType):
    success = graphene.Boolean()
    errors = GenericScalar()
    token = graphene.String()
    
class Query(object):
    all_accounts = graphene.List(AccountType)
    account_self = graphene.Field(Custom_accountType)

    @login_required
    def resolve_all_accounts(self, info, **kwargs):
        return CustomUser.objects.filter(is_student = False, is_teacher = False, is_parent = False)

    @login_required
    def resolve_account_self(self, info, **kwargs):

        user_i = info.context.user

        if user_i.is_superuser == True:
            return {
            "email":user_i.email,
            "family_name":user_i.first_name,
            "name": user_i.last_name,
            "phone": '',
            "phone2": '',
            "address": '',}
        elif user_i.is_student == True:
            account_i = Student.objects.get(pk=user_i.student.id)
        elif user_i.is_teacher == True:
            account_i = Teacher.objects.get(pk=user_i.teacher.id)
        elif user_i.is_parent == True:
            account_i = Parent.objects.get(pk=user_i.parent.id)
        elif user_i.is_employee == True:
            account_i = Employee.objects.get(pk=user_i.employee.id)

        return {
        "email":user_i.email,
        "family_name":user_i.first_name,
        "name": user_i.last_name,
        "phone": account_i.phone,
        "phone2": account_i.phone2,
        "address": account_i.address,
        }


#******************* 😎 Account-MUTATIONS 😎 *************************#
class UpdateMyAccount(graphene.Mutation):
    account = graphene.Field(Custom_accountType)

    class Arguments:
        email = graphene.String()
        family_name = graphene.String()
        name = graphene.String()
        phone = graphene.String()
        phone2 = graphene.String()
        address = graphene.String()

    @login_required
    def mutate(self, info, email, family_name, name, phone, phone2, address):

        user_i = info.context.user
        user_i.email = email
        user_i.first_name = family_name
        user_i.last_name = name
        user_i.save()

        if user_i.is_superuser == True:
            return UpdateMyAccount(account={
            "email":user_i.email,
            "family_name":user_i.first_name,
            "name": user_i.last_name,
            "phone": '',
            "phone2": '',
            "address": '',})
        elif user_i.is_student == True:
            account_i = Student.objects.get(pk=user_i.student.id)
        elif user_i.is_teacher == True:
            account_i = Teacher.objects.get(pk=user_i.teacher.id)
        elif user_i.is_parent == True:
            account_i = Parent.objects.get(pk=user_i.parent.id)
        elif user_i.is_employee == True:
            account_i = Employee.objects.get(pk=user_i.employee.id)
        
        account_i.family_name = family_name
        account_i.name = name
        account_i.phone = phone
        account_i.phone2 = phone2
        account_i.address = address
        account_i.save()
        return UpdateMyAccount(account=account_i)

class PasswordChange(graphene.Mutation):
    
    success = graphene.Boolean()
    errors = GenericScalar()
    token = graphene.String()
    
    class Arguments:
        old_password = graphene.String()
        new_password1 = graphene.String()
        new_password2 = graphene.String()

    @login_required
    def mutate(self, info, old_password, new_password1, new_password2):
        user_i = info.context.user
        errors={}
        
        if not user_i.check_password(old_password):
            old_password_error = {"oldPassword": "Нууц үг буруу байна"}
            errors = {**errors, **old_password_error}
            return PasswordChange(
                success=False,
                errors=errors,
                token=None
            )
        if new_password1 == new_password2:
            user_i.check_password(old_password)
            # user_i.set_password(new_password1)
            # user_i.save()
            token = get_token(user_i)
            return PasswordChange(
                success=True,
                errors=errors,
                token=token
            )
        else:
            new_password1_error = {"newPassword2": "Нууц үг таарахгүй байна байна"}
            errors = {**errors, **new_password1_error}
            return PasswordChange(
                success=False,
                errors=errors,
                token=None
            )

class Mutation(graphene.ObjectType):
    update_my_account = UpdateMyAccount.Field()
    password_change = PasswordChange.Field()