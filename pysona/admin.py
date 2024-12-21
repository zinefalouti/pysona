from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Assign, Project, Persona

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('thumbnail',)}),  
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('email', 'thumbnail')}),
    )

@admin.register(Assign)
class AssignAdmin(admin.ModelAdmin):
    list_display = ('persona', 'project', 'user', 'score') 
    search_fields = ('persona__name', 'project__title', 'user__username') 
    list_filter = ('project', 'user')  
    ordering = ('-score',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'date') 
    search_fields = ('title', 'user__username') 
    list_filter = ('date',) 

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'occup', 'user') 
    search_fields = ('name', 'occup', 'user__username')  
    list_filter = ('age', 'location')

admin.site.register(CustomUser, CustomUserAdmin)
