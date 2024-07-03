from django.db.models import Model, ForeignKey, CASCADE, DateField, CharField, TextField, BooleanField
from apps.section.models import Section
from apps.schoolyear.models import Schoolyear
from apps.employee.models import Employee
from apps.teacher.models import Teacher

class Plan(Model):
    section = ForeignKey(Section, on_delete=CASCADE)
    schoolyear = ForeignKey(Schoolyear, on_delete=CASCADE)
    approved_by = ForeignKey(Employee, on_delete=CASCADE, blank=True, null=True)
    teacher = ForeignKey(Teacher, on_delete=CASCADE)
    start_date = DateField()
    end_date = DateField()

    class Meta:
        permissions = [
            ("approve_plan", "Can approve plan"),
        ]

class DailyPlan(Model):
    plan = ForeignKey(Plan, on_delete=CASCADE)
    # Үйл ажиллагаа
    action = CharField(max_length=100)
    monday = TextField(blank=True, null=True)
    tuesday = TextField(blank=True, null=True)
    wednesday = TextField(blank=True, null=True)
    thursday = TextField(blank=True, null=True)
    friday = TextField(blank=True, null=True)
    is_all_day = BooleanField(default=False)
    all_day = TextField(blank=True, null=True)
    approved_by = ForeignKey(Employee, on_delete=CASCADE, blank=True, null=True)

class SubPlan(Model):
    SUBJECT_NAME_CHOICES = (
        ('LANGUAGE', 'Хэл яриа',),
        ('MOVEMENT', 'Хөдөлгөөн, эрүүл мэнд',),
        ('NATURE', 'Байгаль, нийгмийн ухаан',),
        ('MATH', 'Математикийн энгийн төсөөлөл',),
        ('ART', 'Дүрслэх урлаг',),
        ('MUSIC', 'Дуу хөгжим',),
    )
    plan = ForeignKey(Plan, on_delete=CASCADE)
    subject_name = CharField(max_length=50, default='LANGUAGE', choices=SUBJECT_NAME_CHOICES)
    # Агуулга
    content = TextField()
    # Зорилго
    goal = TextField()
    # Заах арга
    teaching_methods = TextField()
    # Хэрэглэгдэхүүн
    consumables = TextField()
    # Алхалт
    walk = CharField(max_length=150, null=True, blank=True)
    # Гүйлт
    running = CharField(max_length=150, null=True, blank=True)
    # Үсрэлт
    jumping = CharField(max_length=150, null=True, blank=True)
    # Шидэлт
    shoot = CharField(max_length=150, null=True, blank=True)
    # Гар хурууны хөдөлгөөнөө зохицуулна                                                                    
    hand = CharField(max_length=150, null=True, blank=True)
    # Бие хөгжүүлэх дасгал
    body = CharField(max_length=150, null=True, blank=True)
    # Тоглоом
    game = CharField(max_length=150, null=True, blank=True)

class SubPlanAction(Model):
    sub_plan = ForeignKey(SubPlan, on_delete=CASCADE)
     # Үйл ажиллагаа
    action = CharField(max_length=100)
    # Багшийн дэмжлэг, чиглүүлэг
    teacher_activity = TextField(blank=True)
    # Хүүхдийн үйл ажиллагаа
    student_activity = TextField(blank=True)
    approved_by = ForeignKey(Employee, on_delete=CASCADE, blank=True, null=True)
    
    
