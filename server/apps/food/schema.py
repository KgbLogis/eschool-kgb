import graphene
from graphene_django.types import DjangoObjectType
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required, permission_required
from django.db.models import Q
from .models import FoodMenu, Food, FoodFile, DailyMenu, DailyMenuFood
from apps.schoolyear.models import Schoolyear
from apps.program.models import Program

class FoodMenuType(DjangoObjectType):
    class Meta:
        model = FoodMenu

class FoodType(DjangoObjectType):
    class Meta:
        model = Food

class FoodFileType(DjangoObjectType):
    class Meta:
        model = FoodFile

class DailyMenuType(DjangoObjectType):
    class Meta:
        model = DailyMenu        

class DailyMenuFoodType(DjangoObjectType):
    class Meta:
        model = DailyMenuFood

class Query(object):

    all_food_menus = graphene.List(FoodMenuType, filter=graphene.String(required=False, default_value=''))
    all_foods = graphene.List(FoodType, food_menu=graphene.ID(required=True))
    food_by_id = graphene.Field(FoodType, id=graphene.ID(required=True))
    all_food_files_by_food = graphene.List(FoodFileType, food=graphene.ID(required=True))
    all_daily_menus = graphene.List(DailyMenuType)
    all_daily_menu_foods = graphene.List(DailyMenuFoodType, daily_menu=graphene.ID(required=True))

    @login_required
    @permission_required('food.view_foodmenu')
    def resolve_all_food_menus(self, info, filter):

        fields = FoodMenu.filter_fields()
        Qr = None
        for field in fields:
            q = Q(**{"%s__icontains" % field: filter })
            if Qr:
                Qr = Qr | q
            else:
                Qr = q
        return FoodMenu.objects.filter(Qr)

    @login_required
    @permission_required('food.view_food')
    def resolve_all_foods(self, info, food_menu):
        food_menu_o = FoodMenu.objects.get(pk=food_menu)
        return Food.objects.filter(Q(food_menu=food_menu_o))

    @login_required
    @permission_required('food.view_food')
    def resolve_food_by_id(self, info, id):
        return Food.objects.get(pk=id)
    
    @login_required
    @permission_required('food.view_foodfile')
    def resolve_all_food_files_by_food(self, info, food):
        food_o = Food.objects.get(pk=food)
        return FoodFile.objects.filter(food=food_o)

    @login_required
    @permission_required('food.view_dailymenu')
    def resolve_all_daily_menus(self, info):
        schoolyear = Schoolyear.objects.get(is_current=True)
        return DailyMenu.objects.filter(schoolyear=schoolyear)

    @login_required
    @permission_required('food.view_dailymenufood')
    def resolve_all_daily_menu_foods(self, info, daily_menu):
        daily_menu_o = DailyMenu.objects.get(pk=daily_menu)
        return DailyMenuFood.objects.filter(daily_menu=daily_menu_o)

class CreateFoodMenu(graphene.Mutation):
    food_menu = graphene.Field(FoodMenuType)

    class Arguments:
        program = graphene.ID()
        name = graphene.String()
    
    @login_required
    @permission_required('food.add_foodmenu')
    def mutate(self, info, program, name):
        program_o = Program.objects.get(pk=program)

        food_menu_o = FoodMenu(program=program_o, name=name)
        food_menu_o.save()

        return CreateFoodMenu(food_menu=food_menu_o)

class UpdateFoodMenu(graphene.Mutation):
    food_menu = graphene.Field(FoodMenuType)

    class Arguments:
        id = graphene.ID()
        program = graphene.ID()
        name = graphene.String()
    
    @login_required
    @permission_required('food.change_foodmenu')
    def mutate(self, info, id, program, name):
        food_menu_o = FoodMenu.objects.get(pk=id)
        program_o = Program.objects.get(pk=program)

        food_menu_o.program=program_o
        food_menu_o.name=name
        food_menu_o.save()

        return UpdateFoodMenu(food_menu=food_menu_o)

class DeleteFoodMenu(graphene.Mutation):
    food_menu = graphene.Field(FoodMenuType)

    class Arguments:
        id = graphene.ID()
    
    @login_required
    @permission_required('food.delete_foodmenu')
    def mutate(self, info, id):
        food_menu_o = FoodMenu.objects.get(pk=id)
        food_menu_o.delete()

        return DeleteFoodMenu(food_menu=food_menu_o)

class CreateFood(graphene.Mutation):
    food = graphene.Field(FoodType)

    class Arguments:
        name = graphene.String()
        ingredients = graphene.String()
        food_menu = graphene.ID()

    @login_required
    @permission_required('food.add_food')
    def mutate(self, info, name, ingredients, food_menu):

        create_userID_i = info.context.user
        food_menu_o = FoodMenu.objects.get(pk=food_menu)
        
        food_o = Food(name=name, ingredients=ingredients, food_menu=food_menu_o, create_userID=create_userID_i)
        food_o.save()

        return CreateFood(food=food_o)

class UpdateFood(graphene.Mutation):
    food = graphene.Field(FoodType)

    class Arguments:
        id = graphene.ID()
        name = graphene.String()
        ingredients = graphene.String()
        food_menu = graphene.ID()

    @login_required
    @permission_required('food.change_food')
    def mutate(self, info, id, name, ingredients, food_menu):

        food_menu_o = FoodMenu.objects.get(pk=food_menu)
        food_o = Food.objects.get(pk=id)

        food_o.name = name
        food_o.ingredients = ingredients
        food_o.food_menu = food_menu_o
        food_o.save()

        return UpdateFood(food=food_o)

class DeleteFood(graphene.Mutation):
    food = graphene.Field(FoodType)

    class Arguments:
        id = graphene.ID()
    
    @login_required
    @permission_required('food.delete_food')
    def mutate(self, info, id):

        food_o = Food.objects.get(pk=id)
        food_o.delete()

        return DeleteFood(food=food_o)

class CreateFoodFile(graphene.Mutation):
    food_file = graphene.Field(FoodFileType)

    class Arguments:
        food = graphene.ID()
        image = Upload(required=True)

    
    @login_required
    @permission_required('food.create_foodfile')
    def mutate(self, info, food, image):

        food_o = Food.objects.get(pk=food)

        food_file_o = FoodFile(food=food_o, image=image)
        food_file_o.save()

        return CreateFoodFile(food_file=food_file_o)

class DeleteFoodFile(graphene.Mutation):
    food_file = graphene.Field(FoodFileType)

    class Arguments:
        id = graphene.ID()
    
    @login_required
    @permission_required('food.delete_foodfile')
    def mutate(self, info, id):

        food_file_o = FoodFile.objects.get(pk=id)
        food_file_o.delete()

        return DeleteFoodFile(food_file=food_file_o)

class CreateDailyMenu(graphene.Mutation):
    daily_menu = graphene.Field(DailyMenuType)

    class Arguments:
        program = graphene.ID()
        name = graphene.String()

    @login_required
    @permission_required('food.add_dailymenu')
    def mutate(self, info, program, name):
        program_o = Program.objects.get(pk=program)
        schoolyear_o = Schoolyear.objects.get(is_current=True)

        daily_menu_o = DailyMenu(program=program_o, schoolyear=schoolyear_o, name=name)
        daily_menu_o.save()

        return CreateDailyMenu(daily_menu=daily_menu_o)

class UpdateDailyMenu(graphene.Mutation):
    daily_menu = graphene.Field(DailyMenuType)

    class Arguments:
        id = graphene.ID()
        program = graphene.ID()
        schoolyear = graphene.ID()
        name = graphene.String()

    @login_required
    @permission_required('food.change_dailymenu')
    def mutate(self, info, id, program, schoolyear, name):
        program_o = Program.objects.get(pk=program)
        schoolyear_o = Schoolyear.objects.get(pk=schoolyear)

        daily_menu_o = DailyMenu.objects.get(pk=id)
        daily_menu_o.program=program_o
        daily_menu_o.schoolyear=schoolyear_o
        daily_menu_o.name=name
        daily_menu_o.save()

        return UpdateDailyMenu(daily_menu=daily_menu_o)

class DeleteDailyMenu(graphene.Mutation):
    daily_menu = graphene.Field(DailyMenuType)

    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('food.delete_dailymenu')
    def mutate(self, info, id):
        daily_menu_o = DailyMenu.objects.get(pk=id)
        daily_menu_o.delete()

        return DeleteDailyMenu(daily_menu=daily_menu_o)

class CreateDailyMenuFood(graphene.Mutation):
    daily_menu_food = graphene.Field(DailyMenuFoodType)

    class Arguments:
        daily_menu = graphene.ID()
        food = graphene.ID()

    @login_required
    @permission_required('food.add_dailymenufood')
    def mutate(self, info, daily_menu, food):
        daily_menu_o = DailyMenu.objects.get(pk=daily_menu)
        food_o = Food.objects.get(pk=food)

        daily_menu_food_o = DailyMenuFood(daily_menu=daily_menu_o, food=food_o)
        daily_menu_food_o.save()

        return CreateDailyMenuFood(daily_menu_food=daily_menu_food_o)

class DeleteDailyMenuFood(graphene.Mutation):
    daily_menu_food = graphene.Field(DailyMenuFoodType)

    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('food.delete_dailymenufood')
    def mutate(self, info, id):
        daily_menu_food_o = DailyMenuFood.objects.get(pk=id)
        daily_menu_food_o.delete()

        return DeleteDailyMenuFood(daily_menu_food=daily_menu_food_o)

class Mutation(graphene.ObjectType):
    create_food_menu = CreateFoodMenu.Field()
    update_food_menu = UpdateFoodMenu.Field()
    delete_food_menu = DeleteFoodMenu.Field()
    create_food = CreateFood.Field()
    update_food = UpdateFood.Field()
    delete_food = DeleteFood.Field()
    create_food_file = CreateFoodFile.Field()
    delete_food_file = DeleteFoodFile.Field()
    create_daily_menu = CreateDailyMenu.Field()
    update_daily_menu = UpdateDailyMenu.Field()
    delete_daily_menu = DeleteDailyMenu.Field()
    create_daily_menu_food = CreateDailyMenuFood.Field()
    delete_daily_menu_food = DeleteDailyMenuFood.Field()