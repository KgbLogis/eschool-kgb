from django.db import models

class News(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/news')
    created_at = models.DateTimeField(auto_now_add=True)
