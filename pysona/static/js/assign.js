document.addEventListener('DOMContentLoaded', function() {
    let pluscircle = document.querySelector('#pluscircle');
    let closemodal = document.querySelector('#closemodal');

    pluscircle.addEventListener('click', function () {
        togglemodal(true); 
    });

    closemodal.addEventListener('click', function(){
        togglemodal(false);
    });

    loadPersonas();



});

//Declaring a global variable for locally assigned Personas
let assigned = [];

// Toggle Modal for Assigning Personas Locally
function togglemodal(isShow){

    if (isShow){
        const modal = document.querySelector('#modalblock');
        modal.classList.remove('d-none'); 
    }else{
        const modal = document.querySelector('#modalblock');
        modal.classList.add('d-none'); 
    }

}


// Load personas from API
function loadPersonas() {
    const apiUrl = '/persona/load';
    const itemsPerPage = 9;  
    let currentPage = 1; 

    fetch(apiUrl, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json', 
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const personas = data.personas;
        console.log('Personas loaded successfully:', personas);

        function fillmodal() {
            let personaDiv = document.querySelector('#modalunits'); 
            personaDiv.innerHTML = ''; 

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            const filteredPersonas = personas.filter(persona => !assigned.includes(persona.id));

            const paginatedPersonas = filteredPersonas.slice(startIndex, endIndex);
            
            if (paginatedPersonas.length > 0){
            paginatedPersonas.forEach(persona => { 

                if(!assigned.includes(persona.id)){
                personaDiv.innerHTML += `
                    <div class="col-12 col-sm-6 col-lg-4">
                      <div class="pwidgetmin">
                        <img src="${persona.thumbnail}" alt="${persona.name}'s thumbnail" class="personathumbmin"/>
                        <h2>${persona.name}</h2>
                        <input type="hidden" id="${persona.id}" id="personaid"/>
                        <button onClick="assign(${persona.id})" class="assignbtn">Assign Persona</button>
                      </div>
                    </div>
                `;}
            });
            

            createPagination(filteredPersonas.length);
            }else{
                personaDiv.innerHTML += `
                    <div class="col-12">
                      <div class="pwidgetmin">
                            <img src="../static/images/oops.png" alt="Oops" class="oops"/>
                            <h1><b>Sorry!</b></h1>
                            You have no personas for the moment. Why don't you <a href="/persona/add">Create One?</a>
                      </div>
                    </div>
                `;
            }
        }

        function createPagination(totalItems) {
            const totalPages = Math.ceil(totalItems / itemsPerPage); 
            const paginationDiv = document.querySelector('#pagination');
            paginationDiv.innerHTML = '';  

            for (let page = 1; page <= totalPages; page++) {
                const button = document.createElement('button');
                button.textContent = page;
                button.onclick = () => {
                    currentPage = page; 
                    fillmodal();  
                };
                paginationDiv.appendChild(button);
            }
        }

        fillmodal();
    })
    .catch(error => {
        console.error('An error occurred while loading personas:', error);
    });
}

// Pagination Variables for Assigned Personas
let currentPage = 1;
const itemsPerPage = 5;

//Local Assign and Load Single
function assign(id) {
    assigned.push(id);
    loadPersonas();

    let inputassigned = document.querySelector('#assigned');
    inputassigned.value = assigned;

    let container = document.querySelector('#persocont');
    container.innerHTML = '<h2>Assigned Personas:</h2>';
    container.classList.remove('centering');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPersonas = assigned.slice(startIndex, endIndex);

    const personaPromises = paginatedPersonas.map(personaId => {
        return loadsinglepersona(personaId);
    });

    Promise.all(personaPromises)
        .then(personas => {
            personas.forEach(data => {
                if (data) {
                    container.innerHTML += `
                        <div class="pwidgetmin">
                            <img src="${data.thumbnail}" alt="${data.name}'s thumbnail" class="personathumbmin"/>
                            <h2>${data.name}</h2>
                            <a href="#" onclick="unassign(${data.id})">
                                <img src="../static/images/delete.png" alt="Unassign Persona" class="deletebtn"/>
                            </a>
                        </div>
                    `;
                }
            });

            container.innerHTML += `
                        <div class="assignbottom">
                            <div id="pagination2"></div>
                            <a href="#" id="pluscircle" onClick="togglemodal(true)"><img src="../static/images/addcircle.png" alt="Assign Persona" class="addcircle"/></a>
                        </div>
                    `;

                    const totalPages = Math.ceil(assigned.length / itemsPerPage);
                    const paginationDiv = document.querySelector('#pagination2');
                    paginationDiv.innerHTML = '';

                        if (totalPages > 1) {
                            const prevButton = document.createElement('img');
                            prevButton.src = '../static/images/prev.png';
                            prevButton.alt = 'Previous';
                            prevButton.style.cursor = 'pointer';
                            prevButton.disabled = currentPage === 1;
                            prevButton.onclick = () => changePage(currentPage - 1);
                            paginationDiv.appendChild(prevButton);

                            const nextButton = document.createElement('img');
                            nextButton.src = '../static/images/next.png';
                            nextButton.alt = 'Next';
                            nextButton.style.cursor = 'pointer';
                            nextButton.disabled = currentPage === totalPages;
                            nextButton.onclick = () => changePage(currentPage + 1);
                            paginationDiv.appendChild(nextButton);
                        } else {
                            paginationDiv.style.display = 'none';
                        }
                    
        })
        .catch(error => {
            console.error('Error fetching persona data:', error);
        });
}

function changePage(page) {
    const totalPages = Math.ceil(assigned.length / itemsPerPage);
    if (page < 1) {
        page = 1;
    } else if (page > totalPages) {
        page = totalPages;
    }

    currentPage = page; 
    unassign();
}

async function loadsinglepersona(id) {
    const url = `/persona/edit/${id}/`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error') {
            alert('Error: ' + data.message);
            return null;
        } else {
            return data;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//Delete Local Assign
function unassign(id) {

    const index = assigned.indexOf(id);

    if (index !== -1) {
        assigned.splice(index, 1);
    }

    let inputassigned = document.querySelector('#assigned');
    inputassigned.value = assigned;

    loadPersonas();

    let container = document.querySelector('#persocont');
    container.innerHTML = '<h2>Assigned Personas:</h2>';
    container.classList.remove('centering');
    
    // Calculate the start and end indices for pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPersonas = assigned.slice(startIndex, endIndex);

    if (paginatedPersonas.length === 0 && currentPage > 1) {
        currentPage = 1;
        return unassign(id); 
    }

    const personaPromises = paginatedPersonas.map(personaId => {
        return loadsinglepersona(personaId);
    });

    Promise.all(personaPromises)
        .then(personas => {
            personas.forEach(data => {
                if (data) {
                    container.innerHTML += ` 
                        <div class="pwidgetmin">
                            <img src="${data.thumbnail}" alt="${data.name}'s thumbnail" class="personathumbmin"/>
                            <h2>${data.name}</h2>
                            <a href="#" onclick="unassign(${data.id})">
                                <img src="../static/images/delete.png" alt="Unassign Persona" class="deletebtn"/>
                            </a>
                        </div>
                    `;
                }
            });

            container.innerHTML += ` 
                <div class="assignbottom">
                    <div id="pagination2"></div>
                    <a href="#" id="pluscircle" onClick="togglemodal(true)">
                        <img src="../static/images/addcircle.png" alt="Assign Persona" class="addcircle"/>
                    </a>
                </div>
            `;

            const totalPages = Math.ceil(assigned.length / itemsPerPage);
            const paginationDiv = document.querySelector('#pagination2');
            paginationDiv.innerHTML = ''; 

            // Hide pagination if there are no entries or just one page
            if (assigned.length === 0 || totalPages === 1) {
                paginationDiv.style.display = 'none';
            } else {

                const prevButton = document.createElement('img');
                prevButton.src = '../static/images/prev.png';
                prevButton.alt = 'Previous';
                prevButton.style.cursor = 'pointer';
                prevButton.disabled = currentPage === 1;
                prevButton.onclick = () => changePage(currentPage - 1);
                paginationDiv.appendChild(prevButton);

                const nextButton = document.createElement('img');
                nextButton.src = '../static/images/next.png';
                nextButton.alt = 'Next';
                nextButton.style.cursor = 'pointer';
                nextButton.disabled = currentPage === totalPages;
                nextButton.onclick = () => changePage(currentPage + 1);
                paginationDiv.appendChild(nextButton);
            }

        })
        .catch(error => {
            console.error('Error fetching persona data:', error);
        });
}

