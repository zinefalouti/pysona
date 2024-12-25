document.addEventListener('DOMContentLoaded', function() {
    iterOnBoard(0); // Initialize Onboarding
});

function iterOnBoard(index) {
    // Fetching the progress bars from the DOM
    let prbar1 = document.querySelector('#prbar1');
    let prbar2 = document.querySelector('#prbar2');
    let prbar3 = document.querySelector('#prbar3');

    // Content
    let title = document.querySelector('#onboardtitle');
    let step = document.querySelector('#onboardstep');
    let content = document.querySelector('#onboardtext');
    let image = document.querySelector('#onboardimg');

    //Buttons
    let actiondiv = document.querySelector('#onboardaction');
    let buttonnext = document.createElement('button');
    let buttonprev = document.createElement('button');

    switch(index) {
        case 0:
            prbar1.classList.add('active');
            prbar2.classList.remove('active');
            prbar3.classList.remove('active');
            title.innerHTML = 'Welcome to Pysona';
            step.innerHTML = '1 of 3';
            content.innerHTML = 'Pysona is a simple tool designed to help users organize their work by creating projects and defining personas. Users can assign these personas to specific projects, making it easier to keep track of roles, responsibilities, or different perspectives. The app provides a straightforward interface to streamline this process, making it useful for project planning.';
            image.src = '/static/images/onboard1.png';

            
            buttonnext.innerHTML = "Next";
            buttonnext.onclick = function() {
                iterOnBoard(1); 
            };

            actiondiv.innerHTML = '';
            actiondiv.appendChild(buttonnext);

            break; 

        case 1:
            prbar1.classList.add('active');
            prbar2.classList.add('active');
            prbar3.classList.remove('active');
            title.innerHTML = 'About Projects';
            step.innerHTML = '2 of 3';
            content.innerHTML = 'In the Projects section, users can create and manage individual projects to organize their work. Each project allows the assignment of relevant personas to represent key roles or viewpoints. Additionally, users can link a Figma or Adobe XD board directly to the project, enabling easy access to design assets and collaborative tools. This integration helps keep all essential resources in one place.';
            image.src = '/static/images/onboard2.png';

            buttonnext.innerHTML = "Next";
            buttonnext.onclick = function() {
                iterOnBoard(2); 
            };

            
            buttonprev.innerHTML = "Previous";
            buttonprev.onclick = function() {
                iterOnBoard(0);
            };

            actiondiv.innerHTML = '';
            actiondiv.appendChild(buttonprev);
            actiondiv.appendChild(buttonnext);
            

            break; 

        case 2:
            prbar1.classList.add('active');
            prbar2.classList.add('active');
            prbar3.classList.add('active');
            title.innerHTML = 'About Personas';
            step.innerHTML = '3 of 3';
            content.innerHTML = 'In the Personas section, users can define and manage personas to represent fictional ux users in their projects. Each persona can be assigned to one or multiple projects, providing a clear overview of their involvement. Users can also register the persona’s performance in regards to a project.';
            image.src = '/static/images/onboard3.png';
            
            buttonnext.innerHTML = "Next";
            buttonnext.onclick = function() {
                iterOnBoard(3); 
            };

            buttonprev.innerHTML = "Previous";
            buttonprev.onclick = function() {
                iterOnBoard(1);
            };

            actiondiv.innerHTML = '';

            actiondiv.appendChild(buttonprev);
            actiondiv.appendChild(buttonnext);
            
            
            break; 

        case 3:
            prbar1.style.visibility = 'hidden'; 
            prbar2.style.visibility = 'hidden'; 
            prbar3.style.visibility = 'hidden'; 
            title.innerHTML = "You're All Set!";
            step.style.visibility = 'hidden'; 
            content.innerHTML = 'Start exploring the app to organize your work, create projects, and track persona progress with ease.';
            image.src = '/static/images/onboard4.png';


            buttonnext.innerHTML = "To Pysona";
            buttonnext.onclick = function() {
                window.location.href = "/";
            };

            actiondiv.innerHTML = '';
            actiondiv.appendChild(buttonnext);

            break; 
    }
}

