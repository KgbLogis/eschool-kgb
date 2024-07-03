from django.db.models import Model, ForeignKey, CASCADE, BooleanField, CharField, TimeField, TextField, TextChoices
from django.utils.translation import gettext_lazy as _
from apps.program.models import Program

# Create your models here.

class Flex_time(Model):
    program = ForeignKey(Program, on_delete=CASCADE)
    is_current = BooleanField(default=False)

class Flex_time_sub(Model):
    # class Period(TextChoices):
    #     MORNING = "MORNING", _("Өглөөний үйл ажиллагаа")
    #     AFTERNOON = "AFTERNOON", _("Өдрийн үйл ажиллагаа")
    #     EVENING = "EVENING", _("Оройн үйл ажиллагаа")
    flex_time = ForeignKey(Flex_time, on_delete=CASCADE)
    # period = CharField(
    #     max_length=10, 
    #     choices=Period.choices, 
    #     default=Period.MORNING
    # )
    action = CharField(max_length=100)
    start_at = TimeField()
    end_at = TimeField()
    content = TextField()

    def __str__(self):
        return self.action

