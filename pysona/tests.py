from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project, Persona, Assign
from django.utils import timezone


#Per Lecture 7 running UnitTests for the 3 Models

class ProjectModelTest(TestCase):
    def setUp(self):
        # Create a user to associate with the project
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpassword'
        )
        self.project = Project.objects.create(
            title="Test Project",
            description="Test project description",
            user=self.user,
            uxboard="http://example.com",
            complexity=5,
            type="Creative"
        )

    def test_project_creation(self):
        # Test if the project is created successfully
        self.assertEqual(self.project.title, "Test Project")
        self.assertEqual(self.project.user.username, "testuser")
        self.assertEqual(self.project.complexity, 5)
        self.assertEqual(self.project.type, "Creative")

    def test_project_string_representation(self):
        # Test string representation of the project
        self.assertEqual(str(self.project), "Test Project")


class PersonaModelTest(TestCase):
    def setUp(self):
        # Create a user to associate with the persona
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpassword'
        )
        self.persona = Persona.objects.create(
            name="Test Persona",
            age=30,
            occup="Engineer",
            location="New York",
            status="Active",
            education="Masters",
            background="Test background",
            techsav=7,
            efficiency=8,
            curiosity=6,
            techintuit=5,
            techexpert=9,
            user=self.user
        )

    def test_persona_creation(self):
        # Test if the persona is created successfully
        self.assertEqual(self.persona.name, "Test Persona")
        self.assertEqual(self.persona.age, 30)
        self.assertEqual(self.persona.occup, "Engineer")
        self.assertEqual(self.persona.location, "New York")
        self.assertEqual(self.persona.status, "Active")

    def test_persona_string_representation(self):
        # Test string representation of the persona
        self.assertEqual(str(self.persona), "Test Persona")


class AssignModelTest(TestCase):
    def setUp(self):
        # Create users, projects, and personas for assignments
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpassword'
        )
        self.project = Project.objects.create(
            title="Test Project",
            description="Test project description",
            user=self.user,
            uxboard="http://example.com",
            complexity=5,
            type="Creative"
        )
        self.persona = Persona.objects.create(
            name="Test Persona",
            age=30,
            occup="Engineer",
            location="New York",
            status="Active",
            education="Masters",
            background="Test background",
            techsav=7,
            efficiency=8,
            curiosity=6,
            techintuit=5,
            techexpert=9,
            user=self.user
        )
        # Create an Assign instance
        self.assign = Assign.objects.create(
            score=85,
            user=self.user,
            project=self.project,
            persona=self.persona
        )

    def test_assign_creation(self):
        # Test if the assign is created successfully
        self.assertEqual(self.assign.score, 85)
        self.assertEqual(self.assign.user.username, "testuser")
        self.assertEqual(self.assign.project.title, "Test Project")
        self.assertEqual(self.assign.persona.name, "Test Persona")

    def test_assign_string_representation(self):
        # Test string representation of the assign
        expected_str = "Test Persona is assigned to Test Project "
        self.assertEqual(str(self.assign), expected_str)



class ProjectQuerySetTest(TestCase):
    def setUp(self):
        # Create users and some projects
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpassword'
        )
        self.project1 = Project.objects.create(
            title="Project 1",
            description="First project description",
            user=self.user
        )
        self.project2 = Project.objects.create(
            title="Project 2",
            description="Second project description",
            user=self.user
        )

    def test_latest_projects(self):
        # Test if the latest projects can be fetched correctly
        projects = Project.objects.all().order_by('-date')[:2]
        self.assertEqual(len(projects), 2)
        self.assertEqual(projects[0], self.project2)
        self.assertEqual(projects[1], self.project1)


class PersonaQuerySetTest(TestCase):
    def setUp(self):
        # Create users and some personas
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpassword'
        )
        self.persona1 = Persona.objects.create(
            name="Persona 1",
            age=25,
            occup="Developer",
            location="San Francisco",
            status="Active",
            education="PhD",
            background="Research background",
            techsav=8,
            efficiency=7,
            curiosity=6,
            techintuit=8,
            techexpert=9,
            user=self.user
        )
        self.persona2 = Persona.objects.create(
            name="Persona 2",
            age=35,
            occup="Designer",
            location="Los Angeles",
            status="Inactive",
            education="Masters",
            background="Design background",
            techsav=5,
            efficiency=6,
            curiosity=7,
            techintuit=6,
            techexpert=7,
            user=self.user
        )

    def test_latest_personas(self):
        # Test if the latest personas can be fetched correctly
        personas = Persona.objects.all().order_by('-id')[:3]
        self.assertEqual(len(personas), 2)  # Only two personas were created
        self.assertEqual(personas[0], self.persona2)
        self.assertEqual(personas[1], self.persona1)

