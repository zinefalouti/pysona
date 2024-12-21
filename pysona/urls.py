
from django.urls import path
from . import views
from .views import UpdatePersona,LoadPersonas,UpdateProject, AllAssigned,LoadUnAssigned,AssignSingle,DeleteAssign,UpdateScore,UpdateAccount

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.loginview, name="login"),
    path("signup", views.signupview, name="signup"),
    path("authcheck", views.authcheck, name="authcheck"),
    path("registercheck", views.registercheck, name="registercheck"),
    path("onboarding", views.onboarding, name="onboarding"),
    path('logout', views.logginout, name='logout'),
    path('persona/add', views.addpersona, name='addpersona'),
    path('persona/add/check', views.checkaddpersona, name='checkaddpersona'),
    path('persona', views.allpersonas, name='allpersonas'),
    path('persona/<int:id>', views.personasingle, name='personasingle'),
    path('persona/delete/<int:id>/', views.deletepersona, name='deletepersona'),
    path('persona/edit/<int:id>/', UpdatePersona.as_view(), name='edit_persona'),
    path('project/add', views.addproject, name='addproject'),
    path('persona/load', LoadPersonas.as_view(), name='load_personas'),
    path('project/addcheck', views.checkaddproject, name='checkaddproject'),
    path('project', views.allprojects, name='allprojects'),
    path('project/<int:id>', views.singleproject, name='projectsingle'),
    path('project/edit/<int:id>/', UpdateProject.as_view(), name='updateproject'),
    path('project/delete/<int:id>/', views.deleteproject, name='deleteproject'),
    path('api/assigned/<int:project_id>/', AllAssigned.as_view(), name='allassigned'),
    path('api/unassigned/<int:project_id>/', LoadUnAssigned.as_view(), name='allunassigned'),
    path('api/assign/<int:projectid>/<int:personaid>/', AssignSingle.as_view(), name='assignsingle'),
    path('api/assign/delete/<int:projectid>/<int:personaid>/', DeleteAssign.as_view(), name='deleteassign'),
    path('api/assign/update/<int:projectid>/<int:personaid>/', UpdateScore.as_view(), name='updatescore'),
    path('account', views.myaccount, name='account'),
    path('account/edit/', UpdateAccount.as_view(), name='updateaccount'),
]
