import graphene
from graphene_django.types import DjangoObjectType
from .models import News
from graphql_jwt.decorators import login_required, permission_required
from graphene_file_upload.scalars import Upload

class NewsType(DjangoObjectType):
    class Meta:
        model = News

class Query(object):
    all_news = graphene.List(NewsType, offset=graphene.Int(required=False, default_value=0))
    news_by_id = graphene.Field(NewsType, id=graphene.ID(required=True))

    def resolve_all_news(self, info, offset):
        return News.objects.all().order_by('-created_at')[offset:offset+12]

    def resolve_news_by_id(root, info, id):
        try:
            return News.objects.get(id=id)
        except News.DoesNotExist:
            return News.objects.none()

class CreateNews(graphene.Mutation):
    news = graphene.Field(NewsType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        image = Upload()

    @login_required
    @permission_required('news.add_news')
    def mutate(self, info, title, description, image):
        news = News(title=title, description=description, image=image)
        news.save()
        return CreateNews(news=news)

class UpdateNews(graphene.Mutation):
    news = graphene.Field(NewsType)

    class Arguments:
        id = graphene.ID()
        title = graphene.String()
        description = graphene.String()
        image = Upload()

    @login_required
    @permission_required('news.change_news')
    def mutate(self, info, title, description, image, id):
        news = News.objects.get(pk=id)
        news.title = title
        news.description = description
        if (image):
            news.image = image
        news.save()
        return UpdateNews(news=news)     

class DeleteNews(graphene.Mutation):
    news = graphene.Field(NewsType)
    class Arguments:
        id = graphene.ID()

    @login_required
    @permission_required('news.delete_news')
    def mutate(self, info, **kwargs):
        
        try:
            news = News.objects.get(pk=kwargs["id"])
            news.delete()
            
        except News.DoesNotExist:
            news = News.objects.none()
        
        return DeleteNews(news=news)
class Mutation(graphene.ObjectType):
    create_news = CreateNews.Field()
    update_news = UpdateNews.Field()
    delete_news = DeleteNews.Field()