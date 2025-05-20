import graphene
from graphene_django.types import DjangoObjectType
from .models import Live, Live_config
from apps.teacher.models import Teacher
from apps.student.models import Student
from apps.section.models import Section
from graphql_jwt.decorators import login_required, permission_required
import random
import hashlib
from datetime import datetime
from django.utils import timezone
import urllib.parse
from django.db.models import Q

class LiverType(DjangoObjectType):
    class Meta:
        model = Live

class Live_configType(DjangoObjectType):
    class Meta:
        model = Live_config

class Live_urltype(graphene.ObjectType):
    url = graphene.String()
    password = graphene.String()

class Query(object):
    all_lives = graphene.List(LiverType, offset=graphene.Int(required=False, default_value=0), limit=graphene.Int(required=False, default_value=50), filter=graphene.String())
    live_by_id = graphene.Field(LiverType, id=graphene.Int(required=True))
    live_config = graphene.Field(LiverType)
    get_liveurl = graphene.Field(Live_urltype, live_id=graphene.Int())

    @login_required
    @permission_required('live.view_live')
    def resolve_all_lives(self, info, offset, limit, filter):
        if info.context.user.is_superuser==True:
            return Live.objects.filter(Q(title__icontains=filter) | Q(description__icontains=filter))[offset:limit]
            
        if info.context.user.is_student==True:
            student = Student.objects.get(user=info.context.user)
            
            cutoff = timezone.now().replace(microsecond=0)
            
            live = Live.objects.filter(
                section=student.section
            )[offset:limit]

            for d in live:
                print(d.date, cutoff)
                                
            return live
        else:
            # teachers = Teacher.access_teacher(Teacher.objects.get(user=info.context.user))
            # return Live.objects.filter(teacher_id__in=teachers)
            return Live.objects.filter(Q(title__icontains=filter) | Q(description__icontains=filter))[offset:limit]

    @login_required
    @permission_required('live.view_live')
    def resolve_live_by_id(root, info, id):
        try:
            return Live.objects.get(pk=id)
        except Live.DoesNotExist:
            return None

    @login_required
    def resolve_live_config(root, info):
        try:
            return Live_config.objects.last()
        except Live_config.DoesNotExist:
            return None

    @login_required
    def resolve_get_liveurl(root, info, live_id):
        try:
            live = Live.objects.get(pk=live_id)

            return {"url":live.meeting_id, "password": live.password }

        except Live.DoesNotExist:
            return None

#******************* 😎 Live-MUTATIONS 😎 *************************#
class CreateLive(graphene.Mutation):
    live = graphene.Field(LiverType)

    class Arguments:
        title = graphene.String()
        date = graphene.DateTime()
        duration = graphene.Int()
        description = graphene.String()
        status = graphene.String()
        teacher = graphene.Int()
        section = graphene.Int()

    @login_required
    @permission_required('live.add_live')
    def mutate(self, info, title, date, duration, description, status, teacher, section):
        
        teacher_i = Teacher.objects.get(pk=teacher)
        create_userID_i = info.context.user
        password = 'Mon_Kor_Power_'+str(random.randrange(1, 100000))
        meeting_id = str(random.randrange(1, 100000))

        live_o = Live(
            title=title, 
            date=date, 
            duration=duration, 
            description=description, 
            status=status, 
            teacher=teacher_i,
            section_id = section,
            meeting_id=meeting_id, 
            password=password,
            create_userID=create_userID_i
        )
        live_o.save()

        return CreateLive(live=live_o)

class UpdateLive(graphene.Mutation):
    live = graphene.Field(LiverType)

    class Arguments:
        title = graphene.String()
        date = graphene.DateTime()
        duration = graphene.Int()
        description = graphene.String()
        status = graphene.String()
        teacher = graphene.Int()
        section = graphene.Int()
        id = graphene.ID()

    @login_required
    @permission_required('live.change_live')
    def mutate(self, info, title, date, duration, description, status, teacher, section, id):
        
        live_o = Live.objects.get(pk=id)
        teacher_i = Teacher.objects.get(pk=teacher)
        section_i = Section.objects.get(pk=section)

        password = 'Mon_Kor_Power_'+str(random.randrange(1, 100000))
        meeting_id = str(random.randrange(1, 100000))

        title = urllib.parse.quote_plus(title)
        
        live_o.title = title
        live_o.date = date
        live_o.duration = duration
        live_o.description = description
        live_o.status = status
        live_o.teacher = teacher_i
        live_o.section = section_i
        live_o.meeting_id = meeting_id
        live_o.password = password
        live_o.save()
        
        return UpdateLive(live=live_o)
        
class DeleteLive(graphene.Mutation):
    live = graphene.Field(LiverType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('live.delete_live')
    def mutate(self, info, **kwargs):
        live_o = Live.objects.get(pk=kwargs["id"])
        live_o.delete()
        return DeleteLive(live=live_o)

class Mutation(graphene.ObjectType):
    create_live = CreateLive.Field()
    update_live = UpdateLive.Field()
    delete_live = DeleteLive.Field()