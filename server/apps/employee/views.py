import os
import pandas as pd
from .models import Employee
import datetime as dt
from django.conf import settings
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from apps.core.models import City, District, Teacher_status, Employee_compartment
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required
from django.utils.dateparse import parse_date

@login_required
def Import_csv(request):
    print('s')
    try:
        if request.method == 'POST' and request.FILES['myfile']:
          
            myfile = request.FILES['myfile']        
            fs = FileSystemStorage()
            filename = fs.save(myfile.name, myfile)
            uploaded_file_url = fs.url(filename)
            excel_file = uploaded_file_url
            print(excel_file) 
            empexceldata = pd.read_csv("."+excel_file,encoding='utf-8', converters={'username': str, 'password': str, 'employee_code': str})
            print(type(empexceldata))
            dbframe = empexceldata
            for dbframe in dbframe.itertuples():
                 
                # fromdate_time_obj = dt.datetime.strptime(dbframe.DOB, '%d-%m-%Y')

                birth_city_i = City.objects.get(pk=dbframe.birth_city)
                birth_district_i = District.objects.get(pk=dbframe.birth_district)
                status_i = Teacher_status.objects.get(pk=dbframe.status)
                compartment_i = Employee_compartment.objects.get(pk=dbframe.compartment)

                userob = get_user_model()(username=dbframe.username,email=dbframe.email,first_name=dbframe.family_name,last_name=dbframe.name,is_student=False,is_employee=True,)
                userob.set_password(str(dbframe.password))
                userob.save()
                user_i = get_user_model().objects.get(pk=userob.pk)

                group = Group.objects.get(pk=dbframe.group)
                group.user_set.add(user_i)

                if len(str(dbframe.birthdate))==10:
                    birthdate = parse_date(dbframe.birthdate)
                else:
                    birthdate = "2000-01-01"


                registerNo = str(dbframe.registerNo)[:10] + (str(dbframe.registerNo)[10:] and '')
                phone = str(dbframe.phone)[:8] + (str(dbframe.phone)[8:] and '')
                phone2 = str(dbframe.phone2)[:8] + (str(dbframe.phone2)[8:] and '')

                employee = Employee(
                    user=user_i, 
                    employee_code=dbframe.employee_code, 
                    family_name=dbframe.family_name, 
                    name=dbframe.name, 
                    registerNo=registerNo, 
                    phone=phone, 
                    phone2=phone2, 
                    address=dbframe.address,
                    sex=dbframe.sex, 
                    birthdate=birthdate, 
                    birth_city=birth_city_i, 
                    birth_district=birth_district_i, 
                    status=status_i,
                    compartment=compartment_i
                )

                try:
                    print("done:")
                    print(type(employee))
                    print(dbframe.employee_code)
                    print(dbframe.username)
                    employee.save()
                except Exception as identifier:
                    print("error:")
                    print(type(employee))
                    print(dbframe.employee_code)            
                    print(identifier)
 
            return render(request, 'employee_import.html', {
                'uploaded_file_url': uploaded_file_url
            })    
    except Exception as identifier:            
        print(identifier)
     
    return render(request, 'employee_import.html',{})