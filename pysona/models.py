from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.conf import settings
# Create your models here.

#Unique name for images to avoid conflicts for multiple users
def get_unique_filename(instance, filename):
    ext = filename.split('.')[-1] 
    unique_filename = f'{uuid.uuid4()}.{ext}'
    return f'user_thumbnails/{unique_filename}'

#Auth User Model
class CustomUser(AbstractUser):
    email = models.EmailField(blank=False, verbose_name="Email Address")
    thumbnail = models.ImageField(upload_to=get_unique_filename, blank=True, null=True)
    
    def __str__(self):
        return self.username
    

#Project Model
class Project(models.Model):
    title = models.CharField(max_length=255)  
    description = models.TextField()  
    date = models.DateTimeField(auto_now_add=True) 
    uxboard = models.URLField(blank=True,null=True)
    complexity = models.IntegerField(default=0)  
    type = models.CharField(max_length=255,default='Creative')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 

    def __str__(self):
        return self.title
    
#Persona Model
class Persona(models.Model):
    name = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to=get_unique_filename, blank=True, null=True)
    age = models.PositiveIntegerField()
    occup = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    education = models.CharField(max_length=255)
    background = models.TextField()
    techsav = models.IntegerField(default=0)
    efficiency = models.IntegerField(default=0)
    curiosity = models.IntegerField(default=0)
    techintuit = models.IntegerField(default=0)
    techexpert = models.IntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 

    def __str__(self):
        return self.name

#Assign Model
class Assign(models.Model):
    score = models.IntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    persona = models.ForeignKey('Persona', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.persona.name} is assigned to {self.project.title} "
    
