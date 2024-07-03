import graphene
from graphene_django.types import DjangoObjectType
from .models import Subject
from apps.school.models import School
from apps.sub_school.models import Sub_school
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q
from school.utils import custom_paginate

class SubjectType(DjangoObjectType):
    class Meta:
        model = Subject

class Subject_paginationType(graphene.ObjectType):
    page = graphene.Int()
    per_page = graphene.Int()
    page_count = graphene.Int()
    total_count = graphene.Int()
    records = graphene.List(SubjectType)

class Query(object):
    all_subjects = graphene.List(SubjectType, offset=graphene.Int(required=False, default_value=0), limit=graphene.Int(required=False, default_value=50), filter=graphene.String(required=False, default_value=''))
    subject_by_id = graphene.Field(SubjectType, id=graphene.Int(required=True))
    all_subjects_pagination = graphene.Field(
        Subject_paginationType,
        page=graphene.Int(),
        per_page=graphene.Int(),
        filter=graphene.String(required=False, default_value='')
    )

    @login_required
    @permission_required('subject.view_subject')
    def resolve_all_subjects(self, info, offset, limit, filter):
        fields = Subject.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q

        if info.context.user.is_teacher==True:
            return Subject.objects.filter(Q(create_userID=info.context.user), Qr)
        else:
            return Subject.objects.filter(Qr)
        
    @login_required
    @permission_required('subject.view_subject')
    def resolve_subject_by_id(self, info, id):
        return  Subject.objects.get(pk=id)
    
    @login_required
    @permission_required('subject.view_subject')
    def resolve_all_subjects_pagination(self, info, page, per_page, filter):
        fields = Subject.filter_fields()

        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q
        if info.context.user.is_teacher==True:
            query_set = Subject.objects.filter(Q(create_userID=info.context.user), Qr)
        else:
            query_set = Subject.objects.filter(Qr)
        
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

#******************* 😎 Subject-MUTATIONS 😎 *************************#
class CreateSubject(graphene.Mutation):
    subject = graphene.Field(SubjectType)

    class Arguments:
        school = graphene.Int()
        sub_school = graphene.Int()
        subject = graphene.String()
        content = graphene.String()
        credit = graphene.String()

    @login_required
    @permission_required('subject.add_subject')
    def mutate(self, info, school, sub_school, subject, credit, content):
        
        sub_school_i = Sub_school.objects.get(pk=sub_school)
        school_i = School.objects.get(pk=school)
        create_userID_i = info.context.user

        subject = Subject(school=school_i, sub_school=sub_school_i, content=content, subject=subject, credit=credit, create_userID=create_userID_i)
        subject.save()
        return CreateSubject(subject=subject)

class UpdateSubject(graphene.Mutation):
    subject = graphene.Field(SubjectType)

    class Arguments:
        school = graphene.Int()
        sub_school = graphene.Int()
        subject = graphene.String()
        content = graphene.String()
        credit = graphene.String()
        id = graphene.ID()

    @login_required
    @permission_required('subject.add_subject')
    def mutate(self, info, school, sub_school, subject, content, credit, id):
        
        subject_o = Subject.objects.get(pk=id)
        sub_school_i = Sub_school.objects.get(pk=sub_school)
        school_i = School.objects.get(pk=school)
        
        subject_o.school = school_i
        subject_o.sub_school = sub_school_i
        subject_o.subject = subject
        subject_o.credit = credit
        subject_o.content = content
        subject_o.save()
        return UpdateSubject(subject=subject_o)

class DeleteSubject(graphene.Mutation):
    subject = graphene.Field(SubjectType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('subject.delete_subject')
    def mutate(self, info, **kwargs):
        subject = Subject.objects.get(pk=kwargs["id"])
        if subject is not None:
            subject.delete()
        return DeleteSubject(subject=subject)

class Mutation(graphene.ObjectType):
    create_subject = CreateSubject.Field()
    update_subject = UpdateSubject.Field()
    delete_subject = DeleteSubject.Field()