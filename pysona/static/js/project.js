document.addEventListener('DOMContentLoaded', function() {
    let id = document.querySelector('#projectid').value;
    viewProject(id);
    loadAssignedPersonas(id);

    let closemodal = document.querySelector('#closemodal');

    closemodal.addEventListener('click', function(){
        toggleassign(false);
    });

});

function viewProject(id) {
    fetch(`/project/edit/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
            console.log('Project data:', data);

            let head = document.querySelector('#head');

            head.classList.remove('inputzone');

            head.innerHTML = `
                <div>
                    <h5>Project</h5>
                    <h1>${data.title}</h1>
                </div>
                <div class="iconswrapper">
                <a href="/project/delete/${data.id}/"><img src="../static/images/delete.png" alt="Delete Project" class="deleteicon"/></a>
                <a href="#" onClick="editmode(${data.id})"><img src="../static/images/edit.png" alt="Edit Project" class="editicon"/></a>
                </div>
            `;

            let desc = document.querySelector('#desc');

            desc.innerHTML = `
                 <label>About the project</label>
                 <p>${data.description}</p>
                 `;

            let link = document.querySelector('#link');

            link.innerHTML = `
                 <label>Project's link</label>
                 <a href="${data.uxboard}" target="_blank">View Link</a>
                 `;

            let complexity = document.querySelector('#complexity');
            let score = checkComplexity(data.complexity);
               
            complexity.innerHTML = `
            <label>Project UX Complexity</label>
            <h2>${score}</h2>
            `;

            let type = document.querySelector('#type');
            type.innerHTML = `
            <label>Project Type</label>
            <h2>${data.type}</h2>
            `;

            let date = document.querySelector('#date');
            let cleanedDate = new Date(data.date);
            let options = {
                month: 'short', 
                day: 'numeric',  
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric', 
                hour12: true   
            };
            
            let friendlyDate = cleanedDate.toLocaleString('en-US', options);
            date.innerHTML = `
               Created: ${friendlyDate}
            `;
                             

    })
    .catch(error => console.error('Error:', error));
}


function checkComplexity(score){
    let scorearray = [
        'Very Easy',
        'Easy',
        'Moderately Easy', 
        'Slightly Challenging', 
        'Average Difficulty',
        'Moderate',
        'Moderately Hard',
        'Challenging',
        'Very Challenging',
        'Very Difficult',
        'Hardcore', 
    ]

    let complexity = scorearray[score];

    return complexity;

}



function editmode(id){
    fetch(`/project/edit/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
            console.log('Project data:', data);

            let head = document.querySelector('#head');

            head.classList.add('inputzone');

            head.innerHTML = `
                <div>
                    <label>Project title</label>
                    <input type="text" name="title" id="ptitle" placeholder="Web app, software, or mobile app" value="${data.title}"/>
                </div>
                <div class="iconswrapper">
                <a href="#" onClick="viewProject(${data.id})"><img src="../static/images/cancel.png" alt="Delete Project" class="deleteicon"/></a>
                <a href="#" onClick="updateproject(${data.id})"><img src="../static/images/confirm.png" alt="Edit Project" class="editicon"/></a>
                </div>
            `;

            let desc = document.querySelector('#desc');

            desc.innerHTML = `
                 <label>About the project</label>
                 <textarea id="pdesc" name="desc" placeholder="Project description">${data.description}
                 </textarea>
                 `;

            let link = document.querySelector('#link');

            link.innerHTML = `
                 <label>Project's link</label>
                 <input type="url" id="plink" name="link" placeholder="https://www.domain.com" value="${data.uxboard}"/>
                 `;

            let complexity = document.querySelector('#complexity');
            let score = data.complexity;
               
            complexity.innerHTML = `
            <label>Project UX Complexity</label>
            <select name="complexity" id="pcomplexity">
                <option value="0" ${score === 0 ? 'selected' : ''}>Very Easy</option>
                <option value="1" ${score === 1 ? 'selected' : ''}>Easy</option>
                <option value="2" ${score === 2 ? 'selected' : ''}>Moderately Easy</option>
                <option value="3" ${score === 3 ? 'selected' : ''}>Slightly Challenging</option>
                <option value="4" ${score === 4 ? 'selected' : ''}>Average Difficulty</option>
                <option value="5" ${score === 5 ? 'selected' : ''}>Moderate</option>
                <option value="6" ${score === 6 ? 'selected' : ''}>Moderately Hard</option>
                <option value="7" ${score === 7 ? 'selected' : ''}>Challenging</option>
                <option value="8" ${score === 8 ? 'selected' : ''}>Very Challenging</option>
                <option value="9" ${score === 9 ? 'selected' : ''}>Very Difficult</option>
                <option value="10" ${score === 10 ? 'selected' : ''}>Hardcore</option>
            </select>
            `;

            let type = document.querySelector('#type');
            type.innerHTML = `
            <label>Project Type</label>
            <select name="type" id="ptype">
                <option value="Creative" ${data.type === 'Creative'? 'selected':''}>Creative</option>
                <option value="Technical" ${data.type === 'Technical'? 'selected':''}>Technical</option>
                <option value="Business" ${data.type === 'Business'? 'selected':''}>Business</option>
                <option value="Marketing" ${data.type === 'Marketing'? 'selected':''}>Marketing</option>
                <option value="Management" ${data.type === 'Management'? 'selected':''}>Management</option>
            </select>
            `;

            let date = document.querySelector('#date');
            let cleanedDate = new Date(data.date);
            let options = {
                month: 'short', 
                day: 'numeric',  
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric', 
                hour12: true   
            };
            
            let friendlyDate = cleanedDate.toLocaleString('en-US', options);
            date.innerHTML = `
               Created: ${friendlyDate}
            `;
                             

    })
    .catch(error => console.error('Error:', error));
}


function updateproject(id){
    const formData = new FormData();
    
    formData.append('title', document.querySelector('[name="title"]').value);
    formData.append('desc', document.querySelector('[name="desc"]').value);
    formData.append('link', document.querySelector('[name="link"]').value);
    formData.append('complexity', document.querySelector('[name="complexity"]').value);
    formData.append('type', document.querySelector('[name="type"]').value);

    fetch(`/project/edit/${id}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCSRFToken()  // Django CSRF token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            viewProject(id);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating persona:', error);
        alert('An error occurred while updating the persona.');
    });
}

function getCSRFToken() {
    let csrfToken = null;
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
        csrfToken = csrfCookie.split('=')[1];
    }
    return csrfToken;
}

// Loading all assigned Personas to Project
let currentPage = 1;
const itemsPerPage = 4;

function loadAssignedPersonas(projectId, page = 1) {


    currentPage = page; 

    fetch(`/api/assigned/${projectId}/?page=${page}&limit=${itemsPerPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        let total = document.querySelector('#assignedtotal');
        total.innerHTML = data.pagination.total_count; 

        let assigned = document.querySelector('#assigned');
        let footer = document.querySelector('#assignbottom');
        

        assigned.innerHTML = ''; 
        pagination.innerHTML = ''; 

        if (data.data.length > 0) {
            data.data.forEach(persona => {
                assigned.innerHTML += `
                    <div class="pwidgetmin" id="persona${persona.persona_id}">
                        <img src="${persona.persona_thumb}" alt="${persona.persona_name}'s thumbnail" class="personathumbmin"/>
                        <div class="score" id="score">
                           <h6>${persona.persona_name}</h6>
                           <h2>Scored: <span>${persona.score}/10</span></h2>
                        </div>
                        <input type="hidden" id="${persona.id}" id="assignid"/>
                        <div class="actionwrapper">
                            <a href="#" onClick="deleteassign(${projectId}, ${persona.persona_id})"><img src="../static/images/delete.png" alt="Unassign Persona" /></a>
                            <a href="#" onClick="ScoreEdit(${persona.persona_id},${projectId}, ${persona.score})"><img src="../static/images/edit.png" alt="Edit Score" /></a>

                        </div>
                    </div>
                `;
            });

            footer.innerHTML = `
                <div class="pagination" id="pagination2"></div>
                <a href="#" onClick="toggleassign(true)"><img src="../static/images/addcircle.png" alt="Assign Persona" class="addcircle"/></a>
            `;

            let pagination = document.querySelector('#pagination2');

            // Pagination controls
            if (data.pagination.has_previous) {
                pagination.innerHTML += `
                <a href="#" onclick="loadAssignedPersonas(${projectId}, ${data.pagination.current_page - 1})">
                <img src="../static/images/prev.png" alt="Previous" />
                </a>`;
            }

            

            if (data.pagination.has_next) {
                pagination.innerHTML += `
                <a href="#" onclick="loadAssignedPersonas(${projectId}, ${data.pagination.current_page + 1})">
                  <img src="../static/images/next.png" alt="Next" />
                </a>`;
            }

            

        } else {
            assigned.classList.add('centering');
            assigned.innerHTML = `
                <img src="../static/images/oops.png" alt="Oops!" class="oops" style="width:50%;"/>
                <p>No Persona is assigned to this project at the moment. Why don't you assign one?</p>
                <a href="#" onClick="toggleassign(true)"><img src="../static/images/addcircle.png" alt="Assign Persona" class="addcircle"/></a>
            `;
        }
    })
    .catch(error => {
        console.error('Error loading assigned personas:', error);
    });
}

// Toggle Assign Modal
function toggleassign(isShow){

    if (isShow){
        const modal = document.querySelector('#modalblock');
        modal.classList.remove('d-none'); 
        let id = document.querySelector('#projectid').value;
        loadUnassignedPersonas(id);
    }else{
        const modal = document.querySelector('#modalblock');
        modal.classList.add('d-none'); 
    }

}

//Load Personas For Modal Assignment Filtering by Non Assigned Only
let currentPage2 = 1;

function loadUnassignedPersonas(projectId, page = 1) {
    currentPage2 = page;

    fetch(`/api/unassigned/${projectId}/?page=${currentPage2}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const unassignedContainer = document.querySelector('#modalunits');
        const pagination = document.querySelector('#pagination');

        if (data.personas.length > 0) {
            unassignedContainer.innerHTML = '';

            data.personas.forEach(persona => {
                unassignedContainer.innerHTML += `
                    <div class="col-12 col-sm-6 col-lg-4">
                      <div class="pwidgetmin">
                        <img src="${persona.thumbnail}" alt="${persona.name}'s thumbnail" class="personathumbmin"/>
                        <h2>${persona.name}</h2>
                        <input type="hidden" id="${persona.id}" id="personaid"/>
                        <button onClick="assign(${projectId},${persona.id})" class="assignbtn">Assign Persona</button>
                      </div>
                    </div>
                `;
            });

            pagination.innerHTML = '';

            if (data.pagination.has_previous) {
                pagination.innerHTML += `
                    <a href="#" onclick="loadUnassignedPersonas(${projectId}, ${data.pagination.current_page - 1})">
                        <img src="../static/images/prev.png" alt="Previous" class="pagination-icon" />
                    </a>
                `;
            }

            if (data.pagination.has_next) {
                pagination.innerHTML += `
                    <a href="#" onclick="loadUnassignedPersonas(${projectId}, ${data.pagination.current_page + 1})">
                        <img src="../static/images/next.png" alt="Next" class="pagination-icon" />
                    </a>
                `;
            }
        } else {
            unassignedContainer.innerHTML = `
                   
                    <div class="col-12">
                      <div class="pwidgetmin">
                            <img src="../static/images/oops.png" alt="Oops" class="oops"/>
                            <h1><b>Sorry!</b></h1>
                            You have no personas for the moment. Why don't you <a href="/persona/add">Create One?</a>
                      </div>
                    </div>
        
            `;
        }
    })
    .catch(error => {
        console.error('Error loading unassigned personas:', error);
    });
}


//Assign Persona to Project
function assign(projectid, personaid) {
    fetch(`/api/assign/${projectid}/${personaid}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadUnassignedPersonas(projectid);
            loadAssignedPersonas(projectid);
        } else {
            console.error('Assignment failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


//Delete Assign
function deleteassign(projectid, personaid) {
    fetch(`/api/assign/delete/${projectid}/${personaid}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadAssignedPersonas(projectid);  // Reload after delete
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Update Score Manually
function ScoreEdit(personaid,projectid,score) {
    // Find the div by persona ID
    let personaDiv = document.querySelector(`#persona${personaid}`);

    let scoreDiv = personaDiv.querySelector('.score h2');

    scoreDiv.classList.add('inputzone');
    scoreDiv.classList.remove('score');
    
    scoreDiv.innerHTML = `

                <select name="score" id="score">
                    <option value="0" ${score === 0 ? 'selected' : ''}>0/10</option>
                    <option value="1" ${score === 1 ? 'selected' : ''}>1/10</option>
                    <option value="2" ${score === 2 ? 'selected' : ''}>2/10</option>
                    <option value="3" ${score === 3 ? 'selected' : ''}>3/10</option>
                    <option value="4" ${score === 4 ? 'selected' : ''}>4/10</option>
                    <option value="5" ${score === 5 ? 'selected' : ''}>5/10</option>
                    <option value="6" ${score === 6 ? 'selected' : ''}>6/10</option>
                    <option value="7" ${score === 7 ? 'selected' : ''}>7/10</option>
                    <option value="8" ${score === 8 ? 'selected' : ''}>8/10</option>
                    <option value="9" ${score === 9 ? 'selected' : ''}>9/10</option>
                    <option value="10"${score === 10 ? 'selected' : ''}>10/10</option>
                </select>
    
    `;


    let actionWrapper = personaDiv.querySelector('.actionwrapper');
    
    actionWrapper.innerHTML = `
       
        <a href="#" onClick="cancelEdit(event,${projectid},${currentPage})"><img src="../static/images/cancel.png" alt="Cancel Scoring" /></a>
        <a href="#" onClick="updatescore(${projectid},${personaid})"><img src="../static/images/confirm.png" alt="Edit Score" /></a>

    `;

}

function cancelEdit(event, projectid, currentPage) {
    event.preventDefault();
    loadAssignedPersonas(projectid, currentPage);
}


//Update Score
function updatescore(projectid, personaid) {

    let formData = new FormData();
    let score = document.querySelector(`#persona${personaid} select[name='score']`).value;
    formData.append('score', score);

    fetch(`/api/assign/update/${projectid}/${personaid}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(), 
        },
        body: formData, 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadAssignedPersonas(projectid, currentPage); 
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
    
}
