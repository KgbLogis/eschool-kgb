"""school URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView
from django.views.generic import TemplateView
from django.views.static import serve 
from django.conf import settings
from apps.student import views as views_student
from apps.teacher import views as views_teacher
from apps.employee import views as views_employee

urlpatterns = [
    path('', TemplateView.as_view(template_name="index.html")),
    path('admin/', admin.site.urls),
    url(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}), 
    url(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}), 
    url(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('student_import/', views_student.Import_csv,name="student_import"),  
    path('teacher_import/', views_teacher.Import_csv,name="teacher_import"),  
    path('employee_import/', views_employee.Import_csv,name="employee_import")
]
