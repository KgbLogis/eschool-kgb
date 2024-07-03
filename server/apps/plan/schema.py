import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required, permission_required
from .models import Plan, DailyPlan, SubPlan, SubPlanAction
from apps.teacher.models import Teacher
from apps.section.models import Section
from apps.schoolyear.models  import Schoolyear
from apps.employee.models import Employee

class PlanType(DjangoObjectType):
    class Meta:
        model = Plan

class DailyPlanType(DjangoObjectType):
    class Meta:
        model = DailyPlan

class SubPlanType(DjangoObjectType):
    class Meta:
        model = SubPlan

class SubPlanActionType(DjangoObjectType):
    class Meta:
        model = SubPlanAction

class Query(object):
    all_plans = graphene.List(PlanType)
    plan_by_id = graphene.Field(PlanType, id=graphene.ID(required=True))
    all_daily_plans = graphene.List(DailyPlanType, plan=graphene.ID(required=True))
    all_sub_plans = graphene.List(SubPlanType, plan=graphene.ID(required=True))
    all_sub_plan_actions = graphene.List(SubPlanActionType, sub_plan=graphene.ID(required=True))
    
    def resolve_all_plans(self, info):
        if info.context.user.is_teacher == True:
            teacher_o = Teacher.objects.get(user=info.context.user)
            return Plan.objects.filter(teacher=teacher_o).order_by('pk')
        else:
            return Plan.objects.all().order_by('-pk')

    def resolve_plan_by_id(self, info, id):
        return Plan.objects.get(pk=id)
    
    def resolve_all_daily_plans(self, info, plan):
        plan_o = Plan.objects.get(pk=plan)
        return DailyPlan.objects.filter(plan=plan_o).order_by('pk')
    
    def resolve_all_sub_plans(self, info, plan):
        plan_o = Plan.objects.get(pk=plan)
        return SubPlan.objects.filter(plan=plan_o).order_by('pk')

    def resolve_all_sub_plan_actions(self, info, sub_plan):
        sub_plan_o = SubPlan.objects.get(pk=sub_plan)
        return SubPlanAction.objects.filter(sub_plan=sub_plan_o).order_by('pk')

class CreatePlan(graphene.Mutation):
    plan = graphene.Field(PlanType)

    class Arguments:
        section = graphene.ID()
        start_date = graphene.Date()
        end_date = graphene.Date()
    
    def mutate(self, info, section, start_date, end_date):
        teacher_o = Teacher.objects.get(user=info.context.user)
        section_o = Section.objects.get(pk=section)
        schoolyear_o = Schoolyear.objects.get(is_current=True)

        plan_o = Plan(
            teacher=teacher_o, 
            section=section_o,
            schoolyear=schoolyear_o,
            start_date=start_date,
            end_date=end_date
        )
        plan_o.save()

        return CreatePlan(plan=plan_o)

class UpdatePlan(graphene.Mutation):
    plan = graphene.Field(PlanType)

    class Arguments:
        id = graphene.ID()
        section = graphene.ID()
        start_date = graphene.Date()
        end_date = graphene.Date()
    
    def mutate(self, info, id, section, start_date, end_date):
        section_o = Section.objects.get(pk=section)
        plan_o = Plan.objects.get(pk=id)

        plan_o.section=section_o
        plan_o.start_date=start_date
        plan_o.end_date=end_date
        plan_o.save()

        return UpdatePlan(plan=plan_o)

class DeletePlan(graphene.Mutation):
    plan = graphene.Field(PlanType)

    class Arguments:
        id = graphene.ID()
    
    def mutate(self, info, id):
        
        plan_o = Plan.objects.get(pk=id)
        plan_o.delete()

        return DeletePlan(plan=plan_o)

class CreateDailyPlan(graphene.Mutation):
    daily_plan = graphene.Field(DailyPlanType)

    class Arguments:
        plan = graphene.ID()
        action = graphene.String()
        monday = graphene.String()
        tuesday = graphene.String()
        wednesday = graphene.String()
        thursday = graphene.String()
        friday = graphene.String()
        is_all_day = graphene.Boolean()
        all_day = graphene.String()

    def mutate(self, info, plan, action, monday, tuesday, wednesday, thursday, friday, is_all_day, all_day):
        plan_o = Plan.objects.get(pk=plan)

        if (is_all_day==True):
            daily_plan_o = DailyPlan(plan=plan_o, action=action, all_day=all_day, is_all_day=is_all_day)
        else:
            daily_plan_o = DailyPlan(plan=plan_o, action=action, monday=monday, tuesday=tuesday, wednesday=wednesday, thursday=thursday, friday=friday, is_all_day=is_all_day)

        daily_plan_o.save()

        return CreateDailyPlan(daily_plan=daily_plan_o)
        
class UpdateDailyPlan(graphene.Mutation):
    daily_plan = graphene.Field(DailyPlanType)

    class Arguments:
        id = graphene.ID()
        action = graphene.String()
        monday = graphene.String()
        tuesday = graphene.String()
        wednesday = graphene.String()
        thursday = graphene.String()
        friday = graphene.String()
        is_all_day = graphene.Boolean()
        all_day = graphene.String()

    def mutate(self, info, id, action, monday, tuesday, wednesday, thursday, friday, is_all_day, all_day):
        daily_plan_o = DailyPlan.objects.get(pk=id)


        daily_plan_o.action=action
        daily_plan_o.is_all_day=is_all_day
        if (is_all_day==True):
            daily_plan_o.all_day=all_day
        else:
            daily_plan_o.monday=monday
            daily_plan_o.tuesday=tuesday
            daily_plan_o.wednesday=wednesday
            daily_plan_o.thursday=thursday
            daily_plan_o.friday=friday
        daily_plan_o.save()

        return UpdateDailyPlan(daily_plan=daily_plan_o)

class DeleteDailyPlan(graphene.Mutation):
    daily_plan = graphene.Field(DailyPlanType)

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        daily_plan_o = DailyPlan.objects.get(pk=id)
        daily_plan_o.delete()

        return DeleteDailyPlan(daily_plan=daily_plan_o)      

class CreateSubPlan(graphene.Mutation):
    sub_plan = graphene.Field(SubPlanType)

    class Arguments:
        plan = graphene.ID()
        subject_name = graphene.String()
        content = graphene.String()
        goal = graphene.String()
        teaching_methods = graphene.String()
        consumables = graphene.String()
        walk = graphene.String()
        running = graphene.String()
        jumping = graphene.String()
        shoot = graphene.String()
        hand = graphene.String()
        body = graphene.String()
        game = graphene.String()

    def mutate(self, info, plan, subject_name, content, goal, teaching_methods, consumables, walk, running, jumping, shoot, hand, body, game):
        plan_o = Plan.objects.get(pk=plan)

        sub_plan_o = SubPlan(
            plan=plan_o, 
            subject_name=subject_name, 
            content=content, 
            goal=goal, 
            teaching_methods=teaching_methods, 
            consumables=consumables, 
            walk=walk, 
            running=running, 
            jumping=jumping, 
            shoot=shoot, 
            hand=hand, 
            body=body,
            game=game
        )
        sub_plan_o.save()

        return CreateSubPlan(sub_plan=sub_plan_o)

class UpdateSubPlan(graphene.Mutation):
    sub_plan = graphene.Field(SubPlanType)

    class Arguments:
        id = graphene.ID()
        subject_name = graphene.String()
        content = graphene.String()
        goal = graphene.String()
        teaching_methods = graphene.String()
        consumables = graphene.String()
        walk = graphene.String()
        running = graphene.String()
        jumping = graphene.String()
        shoot = graphene.String()
        hand = graphene.String()
        body = graphene.String()
        game = graphene.String()

    def mutate(self, info, id, subject_name, content, goal, teaching_methods, consumables, walk, running, jumping, shoot, hand, body, game):
        sub_plan_o = SubPlan.objects.get(pk=id)
        
        sub_plan_o.subject_name=subject_name
        sub_plan_o.content=content
        sub_plan_o.goal=goal
        sub_plan_o.teaching_methods=teaching_methods
        sub_plan_o.consumables=consumables
        sub_plan_o.walk=walk
        sub_plan_o.running=running
        sub_plan_o.jumping=jumping
        sub_plan_o.shoot=shoot
        sub_plan_o.hand=hand
        sub_plan_o.body=body
        sub_plan_o.game=game
        sub_plan_o.save()

        return UpdateSubPlan(sub_plan=sub_plan_o)

class DeleteSubPlan(graphene.Mutation):
    sub_plan = graphene.Field(SubPlanType)

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        sub_plan_o = SubPlan.objects.get(pk=id)
        sub_plan_o.delete()

        return DeleteSubPlan(sub_plan=sub_plan_o)

class CreateSubPlanAction(graphene.Mutation):
    sub_plan_action = graphene.Field(SubPlanActionType)

    class Arguments:
        sub_plan = graphene.ID()
        action = graphene.String()
        teacher_activity = graphene.String()
        student_activity = graphene.String()

    def mutate(self, info, sub_plan, action, teacher_activity, student_activity):
        sub_plan_o = SubPlan.objects.get(pk=sub_plan)

        sub_plan_action_o = SubPlanAction(
            sub_plan=sub_plan_o, 
            action=action, 
            teacher_activity=teacher_activity, 
            student_activity=student_activity
        )
        sub_plan_action_o.save()

        return CreateSubPlanAction(sub_plan_action=sub_plan_action_o)

class UpdateSubPlanAction(graphene.Mutation):
    sub_plan_action = graphene.Field(SubPlanActionType)

    class Arguments:
        id = graphene.ID()
        action = graphene.String()
        teacher_activity = graphene.String()
        student_activity = graphene.String()

    def mutate(self, info, id, action, teacher_activity, student_activity):
        sub_plan_action_o = SubPlanAction.objects.get(pk=id)
        
        sub_plan_action_o.action=action
        sub_plan_action_o.teacher_activity=teacher_activity
        sub_plan_action_o.student_activity=student_activity
        sub_plan_action_o.save()

        return UpdateSubPlanAction(sub_plan_action=sub_plan_action_o)

class DeleteSubPlanAction(graphene.Mutation):
    sub_plan_action = graphene.Field(SubPlanActionType)

    class Arguments:
        id = graphene.ID()

    def mutate(self, info, id):
        sub_plan_action_o = SubPlanAction.objects.get(pk=id)
        sub_plan_action_o.delete()

        return DeleteSubPlanAction(sub_plan_action=sub_plan_action_o)

class ApprovePlan(graphene.Mutation):
    plan = graphene.Field(PlanType)

    class Arguments: 
        plan = graphene.ID()

    def mutate(self, info, plan):

        plan_o = Plan.objects.get(pk=plan)
        employee_o = Employee.objects.get(user=info.context.user)

        daily_plans = DailyPlan.objects.filter(plan=plan_o)
        for daily_plan in daily_plans:
            daily_plan.approved_by = employee_o
            daily_plan.save()
        
        sub_plan_actions = SubPlanAction.objects.filter(sub_plan__plan=plan_o)
        for sub_plan_action in sub_plan_actions:
            sub_plan_action.approved_by = employee_o
            sub_plan_action.save()

        plan_o.approved_by = employee_o
        plan_o.save()

        return ApprovePlan(plan=plan_o)

class ApproveDailyPlan(graphene.Mutation):
    daily_plan = graphene.Field(DailyPlanType)

    class Arguments:
        daily_plan = graphene.ID()
        is_approved = graphene.Boolean()

    def mutate(self, info, daily_plan, is_approved):

        daily_plan_o = DailyPlan.objects.get(pk=daily_plan)
        employee_o = Employee.objects.get(user=info.context.user)
        if is_approved:
            daily_plan_o.approved_by = employee_o
        else:
            daily_plan_o.approved_by = None
        daily_plan_o.save()

        return ApproveDailyPlan(daily_plan=daily_plan_o)

class ApproveSubPlanAction(graphene.Mutation):
    sub_plan_action = graphene.Field(SubPlanActionType)

    class Arguments:
        sub_plan_action = graphene.ID()
        is_approved = graphene.Boolean()

    def mutate(self, info, sub_plan_action, is_approved):

        sub_plan_action_o = SubPlanAction.objects.get(pk=sub_plan_action)
        employee_o = Employee.objects.get(user=info.context.user)
        if is_approved:
            sub_plan_action_o.approved_by = employee_o
        else: 
            sub_plan_action_o.approved_by = None
        sub_plan_action_o.save()

        return ApproveSubPlanAction(sub_plan_action=sub_plan_action_o)

class Mutation(graphene.ObjectType):
    create_plan = CreatePlan.Field()
    update_plan = UpdatePlan.Field()
    delete_plan = DeletePlan.Field()
    create_daily_plan = CreateDailyPlan.Field()
    update_daily_plan = UpdateDailyPlan.Field()
    delete_daily_plan = DeleteDailyPlan.Field()
    create_sub_plan = CreateSubPlan.Field()
    update_sub_plan = UpdateSubPlan.Field()
    delete_sub_plan = DeleteSubPlan.Field()
    create_sub_plan_action = CreateSubPlanAction.Field()
    update_sub_plan_action = UpdateSubPlanAction.Field()
    delete_sub_plan_action = DeleteSubPlanAction.Field()
    approve_plan = ApprovePlan.Field()
    approve_daily_plan = ApproveDailyPlan.Field()
    approve_sub_plan_action = ApproveSubPlanAction.Field()


