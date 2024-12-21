# Project title: Pysona
---
### Distinctiveness and Complexity:
 
**UX research** involves the creation of personas and their evaluation in regards to the project in question, particularly of a digital nature (web-app, mobile-app, or software). The creation of personas and their assignments to projects can be chaotic, which is why Pysona helps organize this process for UX researchers. 

**Personas and Projects** Creating personas, assigning them to projects, and evaluating their relevance can often be a daunting and chaotic process. Researchers must account for diverse user traits, behaviors, and goals while ensuring alignment with the project's objectives. This complexity increases when multiple personas need to be tailored, analyzed, and tracked across different stages of development. Without a structured system, it becomes challenging to maintain consistency, organize data, and draw meaningful insights. Pysona streamlines this workflow, offering researchers an intuitive platform to simplify persona management and optimize their evaluation process.

**Human Bias**: Profiting from Django as a Python framework to build basic python programs that can auto-generate scores for a persona's performance on a project can greatly address a problem that the UX research community faces on a daily basis: **human bias**. By using the proper parameters from both the projects and personas, along with the addition of weights, an autoscore system can help reduce this problem to a certain degree.

**Distinctivness**: What makes **Pysona** distinct is its ability to help users create personas and projects, assign personas to specific projects, and automatically generate a score for each persona's performance in relation to the project. Additionally, the app offers the flexibility for users to manually update scores, providing a balanced approach between automated analysis and human input.

**Complexity**: Persona creation is simple in its mechanism, but the project creation process must masquerade as a single component while actually combining the creation, removal, and update of the **Assign and Project Models**. First, the personas need to be fetched and stored locally to simulate the assignment using JavaScript, by manipulating the array of personas within the **project creation** process, since the project itself has not been created yet. In addition, users should be allowed to abandon the assignment for later if they want to. Then comes the project edition itself, which is similar in structure to the project creation but easier, as it avoids the local manipulation of data since the project has already been created. In both cases, the autoscore basic program will be called inside **views** directly, or via the API fetch (GET/POST), as an indirect approach to autoscore each persona assigned to a project, either during its conception or long after its creation.

---
### Workflow:

**Introduction**: Pysona was built following the standard workflow used in digital agencies minus the post-production, CI/CD, and user-testing as the following:
- [Story Board](https://www.figma.com/design/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?node-id=0-1&t=hU9slBBEe6BeNZxM-1)
- [High-Fidelity (Figma UI Board)](https://www.figma.com/design/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?node-id=1-78&t=hU9slBBEe6BeNZxM-1)
- [M.V.P (Basic Figma Prototype)](https://www.figma.com/proto/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?page-id=1%3A78&node-id=2-2&viewport=566%2C292%2C0.05&t=ciepLLsNsXkHp3eQ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2%3A2)
- [Extract and design the relational database to easily build the Django Models](https://www.figma.com/design/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?node-id=67-746&t=hU9slBBEe6BeNZxM-1)
- Splitting the structure before the Django project is created
- Production phase in parallel (Front and Back-ends for each split)

**The Structure Split**: The Design's purpose is to establish a UI guideline for Pysona to ease up the front parallel line, but also to deduce the split structure or paths on how to tackle the development of Pysona, following the logic of what path should go first where each path will be treated as a small project on its own. The Split is the following:

- Marketing path (Pysona Landing Page)
- Gate path (Sign-up, Login, and Onboarding)
- Persona path
- Autoscore path
- Project path
- Account path
- Dashboard assembly
- Unit Tests

---
### Structure:

***Views***: This file sets all the functions and classes that either render, or send API calls to javascript in the front-end. It also serves as where the autoscore basic program will be called to handle the assignment scoring between Persona and Project.

***Models***: This file sets all the SQL table following the [database design](https://www.figma.com/design/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?node-id=67-746&t=hU9slBBEe6BeNZxM-1) from the earlier phase including the customization of the Django's default auth user table.

***Admin***: This file opens each model to edition within the Django admin panel and it was written for the sake of easy testing and debugging during development.

***Templates (Structure)***: The templates folder and its files were split in alignment with the paths outlined in the High-Fidelity or Storyboard phases. The split is as follows:

- Marketing Folder (Landing Page)
- Gate Folder (Sign-up, login, and onboarding)
- Core Folder (All core functions of Pysona post-authentification)

***Static (Structure)***: This folder is split into three subfolder for organization and easy-access as the following:

- js (Javascript files handling simpler DOM operation or fetching APIs from Django as the back-end)
- css (Style files using scss then mapping them into classic css)
- images (Storing all visual cuts from the [UI Figma Board](https://www.figma.com/design/G3RkWjLHtHeGCJYMUb5Fn6/CS50W-Pysona?node-id=1-78&t=hU9slBBEe6BeNZxM-1))

***Template Core/Layout***: Sets the global structure that remains throughout the experience with the help of sidebar js file that simulate the active buttons in the sidebar without the need to add the sidebar to each child. 

***Static js/onboarding***: Manages the multiple steps during the onboarding process without the need to create a separate view for each step. The four steps are dynamically generated by manipulating the DOM.

***Static js/assign***: Simulates the persona assignment to a project locally during its creation. Once the assignment is complete, it sends the data to the back-end using an API POST request.

***Autoscore Python***: Uses the Persona parameters, the Project complexity, and the Project type to deduce a weight then calculate a score
during the creation of a project.

Each Persona parameter faces the Project complexity that are both scores between 0 and 10, then weighted in by the weights adapted in regards to the project type and the Persona's parameter in question as the following:


*Table 1: Weight list order*

| Tech Savvy | Efficiency | Curiosity | Tech Intuition | Tech Expert |
|------------|------------|-----------|----------------|-------------|
| Weight     | Weight     | Weight    | Weight         | Weight      |

*Table 2: Weight List for Different Categories with Project Type Explanation*

| Project Type      | Tech Savvy | Efficiency | Curiosity | Tech Intuition | Tech Expert |
|-------------------|------------|------------|-----------|----------------|-------------|
| **Creative**      | 1          | 3          | 0         | 1              | 1           |
| **Technical**     | 1          | 1          | 3         | 1              | 0           |
| **Business**      | 2          | 0          | 2         | 0              | 1           |
| **Marketing**     | 1          | 1          | 0         | 2              | 1           |
| **Management**    | 1          | 0          | 2         | 1              | 0           |

***JS Files Handling fetch (POST/GET/DELETE)***:  
These JavaScript files are linked to specific paths for the edition, display, or removal of data. Each file handles requests (POST, GET, DELETE) that correspond to actions within the **persona path**, **project path**, or other related paths in the application. These files manage the interaction with the backend, ensuring that the front-end communicates effectively with the Django views to perform necessary CRUD operations.

***Unit Test***: In this files all tests were made specifically to only test the models.

---
### How to run:
- Navigate to the root folder
- Run: `python manage.py makemigrations`
- Run: `python manage.py migrate`
- Run: `python manage.py runserver`

---
### Conclusion:
Pysona simplifies the process of creating and managing personas for digital projects. It helps UX researchers by automating persona scoring based on project details, while still allowing for manual adjustments. With a clean and organized structure, Pysona makes it easier to assign personas to projects, track their progress, and reduce human bias in evaluations. The project is designed to be efficient and flexible, providing a practical tool for UX researchers.

***My name is Zine.E.Falouti and this was my CS50W capstone project***









