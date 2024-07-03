import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required
from django.contrib.auth import get_user_model
from apps.student.models import Student
from .models import HandOver

class HandOverType(DjangoObjectType):
    class Meta:
        model = HandOver
        fields = ("id", "student", "desc", "is_successed", "date")

    code = graphene.String()

    def resolve_code(self, info):
        return self.code

class Query(object):
    all_hand_overs = graphene.List(HandOverType)

    @login_required
    def resolve_all_hand_overs(self, info, **kwargs):
        if info.context.user.is_student==True:
            return HandOver.objects.filter(student=info.context.user.student)
        if info.context.user.is_teacher==True:
            return HandOver.objects.filter(student__section__teacher=info.context.user.teacher)
        return HandOver.objects.all()
    
class CreateHandOver(graphene.Mutation):
    hand_over = graphene.Field(HandOverType)

    class Arguments:
        student = graphene.ID(required=True)
        desc = graphene.String(required=True)

    @login_required
    def mutate(
        self, 
        info,
        student,
        desc,
    ):
        user_o = get_user_model().objects.get(pk=info.context.user.pk)
        
        student_o = Student.objects.get(pk=student)

        hand_over_o = HandOver(
            student=student_o, 
            desc=desc,
            create_userID=user_o
        )
        hand_over_o.save()

        return CreateHandOver(hand_over=hand_over_o)
    
class SetHandOverSuccessed(graphene.Mutation):
    hand_over = graphene.Field(HandOverType)

    class Arguments:
        code = graphene.String(required=True)

    @login_required
    def mutate(
        self, 
        info,
        code,
    ):
        user_o = get_user_model().objects.get(pk=info.context.user.pk)

        hand_over_o = HandOver.objects.get(code=code)
        hand_over_o.is_successed = True
        hand_over_o.edit_userID = user_o
        hand_over_o.save()

        return SetHandOverSuccessed(hand_over=hand_over_o)
       
class Mutation(graphene.ObjectType):
    create_hand_over = CreateHandOver.Field()
    set_hand_over_successed = SetHandOverSuccessed.Field()