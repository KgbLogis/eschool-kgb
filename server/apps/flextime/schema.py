import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required
from .models import Flex_time, Flex_time_sub
from apps.program.models import Program

class FlexTimeType(DjangoObjectType):
    class Meta:
        model = Flex_time

class FlexTimeSubType(DjangoObjectType):
    class Meta:
        model = Flex_time_sub

class Query(object):
    all_flex_times = graphene.List(FlexTimeType)
    flex_time_by_id = graphene.Field(FlexTimeType, id=graphene.Int(required=True))
    all_flex_time_subs = graphene.List(FlexTimeSubType, flex_time=graphene.ID(required=True))
    flex_time_sub_by_id = graphene.Field(FlexTimeSubType, id=graphene.Int(required=True))
    
    @login_required
    def resolve_all_flex_times(self, info, ):
        if info.context.user.is_student==True:
            return Flex_time.objects.filter(is_current=True, program=info.context.user.student.program)
        if info.context.user.is_teacher==True:
            return Flex_time.objects.filter(is_current=True)
        else: 
            return Flex_time.objects.all()

    @login_required
    def resolve_flex_time_by_id(self, info, id):
        try:
            return Flex_time.objects.get(pk=id)
        except Flex_time.DoesNotExist:
            return Flex_time.objects.none()
    
    @login_required
    def resolve_all_flex_time_subs(self, info, flex_time):
        flex_time_o = Flex_time.objects.get(pk=flex_time)
        return Flex_time_sub.objects.filter(flex_time=flex_time_o).order_by('start_at')
    
    @login_required
    def resolve_flex_time_sub_by_id(self, info, id):
        try:
            return Flex_time_sub.objects.get(pk=id)
        except Flex_time_sub.DoesNotExist:
            return Flex_time_sub.objects.none()

class CreateFlexTime(graphene.Mutation):
    flex_time = graphene.Field(FlexTimeType)

    class Arguments:
        program = graphene.ID()
        is_current = graphene.Boolean()

    @login_required
    def mutate(self, info, program, is_current):
        program_o = Program.objects.get(pk=program)
        flex_time = Flex_time(program=program_o, is_current=is_current)
        flex_time.save()

        return CreateFlexTime(flex_time=flex_time)

class UpdateFlexTime(graphene.Mutation):
    flex_time = graphene.Field(FlexTimeType)

    class Arguments:
        id = graphene.ID()
        program = graphene.ID()
        is_current = graphene.Boolean()

    @login_required
    def mutate(self, info, id, program, is_current):
        flex_time = Flex_time.objects.get(pk=id)
        flex_time.program = Program.objects.get(pk=program)
        flex_time.is_current = is_current
        flex_time.save()

        return UpdateFlexTime(flex_time=flex_time)

class DeleteFlexTime(graphene.Mutation):
    flex_time = graphene.Field(FlexTimeType)

    class Arguments:
        id = graphene.ID()

    @login_required
    def mutate(self, info, id):
        flex_time = Flex_time.objects.get(pk=id)
        flex_time.delete()

        return DeleteFlexTime(flex_time=flex_time)

class CreateFlexTimeSub(graphene.Mutation):
    flex_time_sub = graphene.Field(FlexTimeSubType)

    class Arguments:
        flex_time = graphene.ID()
        action = graphene.String()
        start_at = graphene.Time()
        end_at = graphene.Time()
        content = graphene.String()

    @login_required
    def mutate(self, info, flex_time, action, start_at, end_at, content):
        flex_time_o = Flex_time.objects.get(pk=flex_time)
        flex_time_sub = Flex_time_sub(flex_time=flex_time_o, action=action, start_at=start_at, end_at=end_at, content=content)
        flex_time_sub.save()

        return CreateFlexTimeSub(flex_time_sub=flex_time_sub)

class UpdateFlexTimeSub(graphene.Mutation):
    flex_time_sub = graphene.Field(FlexTimeSubType)

    class Arguments:
        id = graphene.ID()
        flex_time = graphene.ID()
        action = graphene.String()
        start_at = graphene.Time()
        end_at = graphene.Time()
        content = graphene.String()

    @login_required
    def mutate(self, info, id, flex_time, action, start_at, end_at, content):
        flex_time_sub = Flex_time_sub.objects.get(pk=id)
        flex_time_sub.flex_time = Flex_time.objects.get(pk=flex_time)
        flex_time_sub.action = action
        flex_time_sub.start_at = start_at
        flex_time_sub.end_at = end_at
        flex_time_sub.content = content
        flex_time_sub.save()

        return UpdateFlexTimeSub(flex_time_sub=flex_time_sub)

class DeleteFlexTimeSub(graphene.Mutation):
    flex_time_sub = graphene.Field(FlexTimeSubType)

    class Arguments:
        id = graphene.ID()

    @login_required
    def mutate(self, info, id):
        flex_time_sub = Flex_time_sub.objects.get(pk=id)
        flex_time_sub.delete()

        return DeleteFlexTimeSub(flex_time_sub=flex_time_sub)

class Mutation(graphene.ObjectType):
    create_flex_time = CreateFlexTime.Field()
    update_flex_time = UpdateFlexTime.Field()
    delete_flex_time = DeleteFlexTime.Field()
    create_flex_time_sub = CreateFlexTimeSub.Field()
    update_flex_time_sub = UpdateFlexTimeSub.Field()
    delete_flex_time_sub = DeleteFlexTimeSub.Field()