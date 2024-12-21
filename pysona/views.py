from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from .models import CustomUser, Persona, Project, Assign
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views import View
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django.utils.dateparse import parse_datetime
from .autoscore import assembly
from django.contrib.auth import update_session_auth_hash
# Create your views here.

#Swap index between auth and not auth
def index(request):
    if request.user.is_authenticated:
          
          projects = Project.objects.filter(user=request.user).order_by('-id')[:2]  
          personas = Persona.objects.filter(user=request.user).order_by('-id')[:3]
          assigns = Assign.objects.filter(user=request.user).order_by('-id')[:2]  

          totalp = len(Project.objects.filter(user=request.user))
          totalpr = len(Persona.objects.filter(user=request.user))
          totala = len(Assign.objects.filter(user=request.user)) 
        
          return render(request, "core/dashboard.html", {
               'projects': projects,
               'personas': personas,
               'assigns': assigns,
               'totalp':totalp,
               'totalpr':totalpr,
               'totala':totala,
          })
    
    else:
         return render(request, "marketing/landing.html")

#Login & Register views functions   
def loginview(request):
     if request.user.is_authenticated:
          return HttpResponseRedirect(reverse("index"))
     else:
          return render(request, "gate/login.html")

def signupview(request):
     if request.user.is_authenticated:
          return HttpResponseRedirect(reverse("index"))
     else:
          return render(request, "gate/signup.html")

def authcheck(request):
        if request.method == 'POST':
             
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "gate/login.html", {
                "message": "Invalid username and/or password."
            })
        else:
            return render(request, 'gate/login.html')

def registercheck(request):
     if request.method == 'POST':

          username = request.POST.get('username')
          email = request.POST.get('email')
          password = request.POST.get('password')
          thumbnail = request.FILES.get('thumbnail')
          
          if CustomUser.objects.filter(username=username).exists():
               message = "Username Already Taken, please choose a diffrent one."
               return render(request,'gate/signup.html', {'message':message})
          else:
               user = CustomUser(
               username=username,
               email=email,
               thumbnail=thumbnail,
               password=make_password(password)  # Encrypt per Lecture 8
               )
               user.save()
               login(request, user)
               return HttpResponseRedirect(reverse("onboarding"))
          
          
     else:
          return render(request,'gate/signup.html')



#Onboarding View
def onboarding(request):
     return render(request,'gate/onboarding.html')

#LogOut
def logginout(request):
     logout(request)
     return HttpResponseRedirect(reverse("index"))

#Create Persona View
def addpersona(request):
     if request.user.is_authenticated:
         return render(request,'core/addpersona.html')
     else:
         return HttpResponseRedirect(reverse("index"))

@login_required
def checkaddpersona(request):
     if request.method == 'POST':
          name = request.POST.get('pname')
          age = request.POST.get('age')
          mstatus = request.POST.get('pstatus')
          location = request.POST.get('plocation')
          occup = request.POST.get('poccup')
          education = request.POST.get('peduc')
          thumbnail = request.FILES.get('pthumb')
          background = request.POST.get('pback')
          techsavvy = request.POST.get('techsav')
          efficiency = request.POST.get('effic')
          curiosity = request.POST.get('curio')
          techintuit = request.POST.get('techintuit')
          techexpert = request.POST.get('techexpert')
          user = request.user

          # Check in case of issues and zero out anythin odd
          try:
               age = int(age)
               techsavvy = int(techsavvy)
               efficiency = int(efficiency)
               curiosity = int(curiosity)
               techintuit = int(techintuit)
               techexpert = int(techexpert)
          except ValueError:
               age = techsavvy = efficiency = curiosity = techintuit = techexpert = 0

          persona = Persona(
               name = name,
               age = age,
               status = mstatus,
               location = location,
               occup = occup,
               education = education,
               thumbnail = thumbnail,
               background = background,
               techsav = techsavvy,
               efficiency = efficiency,
               curiosity = curiosity,
               techintuit = techintuit,
               techexpert = techexpert,
               user = user
          )

          try:
               persona.full_clean()  
               persona.save()
          except ValidationError as e:
               
               # Keeping the e to debug in case of issues

               message = f'Error Saving Your Persona! Please correct your fields.'
               return render(request, 'core/addpersona.html', {'message': message})



          persona.save()
          return HttpResponseRedirect(reverse("personasingle", args=[persona.id]))
     
     return HttpResponseRedirect(reverse("addpersona"))

#All Personas View
def allpersonas(request):
     if request.user.is_authenticated:
         
         personas_list = Persona.objects.filter(user=request.user).order_by('-id')

         if personas_list:
               total = len(personas_list)
         else:
              total = 0

         paginator = Paginator(personas_list, 8)

         page_num = request.GET.get('page')
         page_obj = paginator.get_page(page_num)

         return render(request,'core/personas.html', {'page_obj': page_obj, 'total':total})
     
     else:
         return HttpResponseRedirect(reverse("index"))

#Dynamic Persona Single
def personasingle(request, id):
     if request.user.is_authenticated:
          
          try:
              persona = Persona.objects.get(id=id)
          except Persona.DoesNotExist:
              return HttpResponseRedirect(reverse("allpersonas"))

          assign = Assign.objects.filter(persona=persona)

          if assign:
               total = len(assign)
          else:
               total = 0

          return render(request, 'core/personasingle.html', {'id':id, 'total':total})
        
     else:
          return HttpResponseRedirect(reverse("index"))
     

#Delete Persona
@login_required
def deletepersona(request, id):
    persona = Persona.objects.filter(id=id).first()
    
    if persona:
        persona.delete()
    
  
    return HttpResponseRedirect(reverse("allpersonas"))

#Update Persona
class UpdatePersona(View):
    def post(self, request, id):
        try:

            persona = Persona.objects.get(id=id)
            
            persona.name = request.POST.get('name', persona.name)
            persona.thumbnail = request.FILES.get('thumbnail', persona.thumbnail)  
            persona.age = request.POST.get('age', persona.age)
            persona.occup = request.POST.get('occup', persona.occup)
            persona.location = request.POST.get('location', persona.location)
            persona.status = request.POST.get('status', persona.status)
            persona.education = request.POST.get('education', persona.education)
            persona.background = request.POST.get('background', persona.background)
            persona.techsav = request.POST.get('techsav', persona.techsav)
            persona.efficiency = request.POST.get('efficiency', persona.efficiency)
            persona.curiosity = request.POST.get('curiosity', persona.curiosity)
            persona.techintuit = request.POST.get('techintuit', persona.techintuit)
            persona.techexpert = request.POST.get('techexpert', persona.techexpert)
            
            persona.save()

            return JsonResponse({'status': 'success', 'message': 'Persona updated successfully!'}, status=200)
        
        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Persona not found'}, status=404)

    # GET method to retrieve persona data
    def get(self, request, id):
        try:
            persona = Persona.objects.get(id=id)

            if persona.thumbnail:
                 thumburl = persona.thumbnail.url
            else:
                 thumburl = '../static/images/profile.jpg'
            
            response_data = {
                'id': persona.id,
                'name': persona.name,
                'thumbnail': thumburl,
                'age': persona.age,
                'occup': persona.occup,
                'location': persona.location,
                'status': persona.status,
                'education': persona.education,
                'background': persona.background,
                'techsav': persona.techsav,
                'efficiency': persona.efficiency,
                'curiosity': persona.curiosity,
                'techintuit': persona.techintuit,
                'techexpert': persona.techexpert,
            }
            
            return JsonResponse(response_data, status=200)
        
        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Persona not found'}, status=404)
        

#Add new project
def addproject(request):
     if request.user.is_authenticated:
          
          persona = Persona.objects.filter(user=request.user)

          if persona:
               total = len(persona)
          else:
               total = 0


          return render(request, 'core/addproject.html', {'total':total})     

     else:
          return HttpResponseRedirect(reverse("index"))

#loading All Personas to Assign Locally for Add Project
class LoadPersonas(View):
     def get(self,request):
          try:
               personas = Persona.objects.filter(user=request.user).order_by('-id')
               persona_data = []

               for persona in personas:
                    if persona.thumbnail:  
                         thumburl = persona.thumbnail.url
                    else:
                         thumburl = '../static/images/profile.jpg'
                    
                    persona_data.append({
                         'id': persona.id,
                         'name': persona.name,
                         'thumbnail': thumburl
                    })
               
               return JsonResponse({'personas': persona_data})
                   
          except ObjectDoesNotExist:
               return JsonResponse({'status': 'error', 'message': 'No Persona was found'}, status=404)
          

#Add Project and Batch Add Assigns
@login_required
def checkaddproject(request):
     if request.method == 'POST':
          assigned = request.POST.get('assigned')
          title = request.POST.get('title')
          description = request.POST.get('desc')
          url = request.POST.get('url')
          user = request.user
          complexity = int(request.POST.get('complexity'))
          type = request.POST.get('type')


          assigned_list = [int(persona_id) for persona_id in assigned.split(',')] if assigned else []


          project = Project(
                    title=title,
                    description=description,
                    uxboard = url,
                    complexity = complexity,
                    type = type,
                    user = user
                    )
               
          try:
               project.full_clean()  
               project.save()
          except ValidationError as e:
               
               # Keeping the e to debug in case of issues
               message = f'Error Saving Your Project! Please correct your fields.'
               return render(request, 'core/addproject.html', {'message': message})
          
          for persona_id in assigned_list:
            try:
                persona = Persona.objects.get(id=persona_id)
                personaparam = [
                     int(persona.techsav),
                     int(persona.efficiency),
                     int(persona.curiosity),
                     int(persona.techintuit),
                     int(persona.techexpert)
                     ]
                
                #Calling autoscore.py to autoscore the Persona Assign to Project
                score = assembly(int(project.complexity),personaparam,project.type)
                
                for p in personaparam:
                     print(p)
                print(score)
                #End of Autoscore call in debugging its results

                Assign.objects.create(
                    score=score, 
                    user=user,
                    project=project,
                    persona=persona
                )
            except Persona.DoesNotExist:
                print(f"Persona with ID {persona_id} does not exist.")

          

          return HttpResponseRedirect(reverse("projectsingle", args=[project.id]))

#Display All Projects
def allprojects(request):
    if request.user.is_authenticated:
        
        projects = Project.objects.filter(user=request.user).order_by('-id');

        projects = projects.annotate(
            passigned=Count('assign')
        )

        if projects:
             total = len(projects)
        else:
             total = 0

        paginator = Paginator(projects, 6)
        page_number = request.GET.get('page') 
        page_obj = paginator.get_page(page_number) 

        context = {
            'page_obj': page_obj, 'total':total,
        }
        return render(request, 'core/projects.html', context)
    else:
        return HttpResponseRedirect(reverse("index"))

#Project Dynamic Single
def singleproject(request, id):
     if request.user.is_authenticated:
          
          return render(request, 'core/projectsingle.html', {'id':id})
     
     else:
          return HttpResponseRedirect(reverse("index"))


class UpdateProject(View):
    def post(self, request, id):
        try:
            project = Project.objects.get(id=id)

            project.title = request.POST.get('title', project.title)
            project.description = request.POST.get('description', project.description)
            project.uxboard = request.POST.get('uxboard', project.uxboard)
            project.complexity = request.POST.get('complexity', project.complexity)
            project.type = request.POST.get('type', project.type)

            date = request.POST.get('date')
            if date:
                project.date = parse_datetime(date)

            project.save()

            return JsonResponse({'status': 'success', 'message': 'Project updated successfully!'}, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

    def get(self, request, id):
        try:
            project = Project.objects.get(id=id)

            response_data = {
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'date': project.date.isoformat() if project.date else None,
                'uxboard': project.uxboard,
                'complexity': project.complexity,
                'type': project.type,
                'user': project.user.username,
            }

            return JsonResponse(response_data, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)


#Delete Project
@login_required
def deleteproject(request, id):
    project = Project.objects.filter(id=id).first()
    
    if project:
        project.delete()
    
  
    return HttpResponseRedirect(reverse("allprojects"))


#Load All Assigned Personas to Project
class AllAssigned(View):
    def get(self, request, project_id):
        assignments = Assign.objects.filter(project_id=project_id).select_related('persona').order_by('-id')

        # Get pagination parameters from the request
        page = int(request.GET.get('page', 1))  
        limit = int(request.GET.get('limit', 4))  

        # Create paginator and get the page object
        paginator = Paginator(assignments, limit)
        page_obj = paginator.get_page(page)

        # Prepare the data for the current page
        data = [
            {
                'id': assign.id,
                'persona_name': assign.persona.name,
                'persona_id': assign.persona.id,
                'persona_thumb': assign.persona.thumbnail.url if assign.persona.thumbnail else '../static/images/profile.jpg',
                'score': assign.score
            }
            for assign in page_obj
        ]

        # Pagination info for frontend
        pagination = {
            'has_next': page_obj.has_next(), 
            'has_previous': page_obj.has_previous(), 
            'current_page': page_obj.number,  
            'total_pages': paginator.num_pages, 
            'total_count': paginator.count 
        }

        return JsonResponse({'data': data, 'pagination': pagination}, safe=False)


#Load Unassigned Personas
class LoadUnAssigned(View):
    def get(self, request, project_id):
        try:
            personas = Persona.objects.filter(user=request.user).exclude(assign__project_id=project_id).order_by('-id')
            
            paginator = Paginator(personas, 9)
            page = request.GET.get('page')
            personas_page = paginator.get_page(page)

            persona_data = [{
                'id': persona.id,
                'name': persona.name,
                'thumbnail': persona.thumbnail.url if persona.thumbnail else '../static/images/profile.jpg'
            } for persona in personas_page]

            return JsonResponse({
                'personas': persona_data,
                'pagination': {
                    'current_page': personas_page.number,
                    'total_pages': personas_page.paginator.num_pages,
                    'has_previous': personas_page.has_previous(),
                    'has_next': personas_page.has_next(),
                }
            })
        except ObjectDoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'No persona was found'}, status=404)
        
#Assign Single Persona to Project
class AssignSingle(View):
     def post(self, request, projectid, personaid):
          try:
               persona = Persona.objects.get(id=personaid)
               project = Project.objects.get(id=projectid)

               #Auto Calculate using autoscore
               personaparam = [
                     int(persona.techsav),
                     int(persona.efficiency),
                     int(persona.curiosity),
                     int(persona.techintuit),
                     int(persona.techexpert)
                     ]
                
               score = assembly(int(project.complexity),personaparam,project.type)

               assign = Assign.objects.create(
                    score=score,
                    user=request.user,
                    project=project,
                    persona=persona
               )

               return JsonResponse({
                'status': 'success',
                'message': f'{persona.name} has been successfully assigned to the project {project.title} with a score of {score}',
                'assigned_id': assign.id,
                'score': score,
                'persona_name': persona.name,
                'project_title': project.title
                })
                        
          except ObjectDoesNotExist:
               return JsonResponse({'status': 'error', 'message': 'No persona was found'}, status=404)
          
#Delete Assign
class DeleteAssign(View):
    def delete(self, request, projectid, personaid):
        try:
            
            persona = Persona.objects.get(id=personaid)
            project = Project.objects.get(id=projectid)
            assign = Assign.objects.get(project=project, persona=persona)

            assign.delete()

            return JsonResponse({
                'status': 'success',
                'message': f'Assignment of {assign.persona.name} to project {assign.project.title} has been successfully deleted.',
            })

        except Assign.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Assignment not found'}, status=404)
        

#Update Score
class UpdateScore(View):
     def post(self,request,projectid,personaid):
          try:
               score = int(request.POST.get('score', 0)) 

               persona = Persona.objects.get(id=personaid)
               project = Project.objects.get(id=projectid)

               assign = Assign.objects.get(project=project,persona=persona)
               assign.score = score
               assign.save()

               return JsonResponse({
                    'status':'success',
                    'message': 'Score Updated Successfully!'
               })
          except Assign.DoesNotExist:
               return  JsonResponse({'status': 'error', 'message': 'Assign not found'}, status=404)
          

#Edit Account View
def myaccount(request):
     if request.user.is_authenticated:
          return render(request, 'core/account.html')
     
     else:
          return HttpResponseRedirect(reverse("index"))
     
#Edit Account via Fetch and Post
class UpdateAccount(View):

    def get(self, request):
        user = request.user
        return JsonResponse({
            'status': 'success',
            'data': {
                'username': user.username,
                'email': user.email,
                'thumbnail': user.thumbnail.url if user.thumbnail else None,
                'password' : user.password,
            }
        }, status=200)

    def post(self, request):
        user = request.user
        username = request.POST.get('username', user.username)
        email = request.POST.get('email', user.email)
        thumbnail = request.FILES.get('thumbnail', user.thumbnail)
        password = request.POST.get('password', None) 


        user.username = username
        user.email = email
        if thumbnail:
            user.thumbnail = thumbnail
        if password:
            user.password = make_password(password)
        user.save()

        update_session_auth_hash(request, user)

        return JsonResponse({'status': 'success', 'message': 'Profile updated successfully.'}, status=200)

     



               


