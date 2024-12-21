document.addEventListener('DOMContentLoaded', function() {
    let id = document.querySelector('#personaid').value;
    viewmode(id);
});


function editmode(id){

    const url = `/persona/edit/${id}/`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'error') {
            alert('Error: ' + data.message);
        } else {
            // Handle the retrieved persona data
            console.log('Persona data:', data);
            let name = document.querySelector('#name');
            name.innerHTML = `
            <label>Name</label>
            <input type="text" name="name" value="${data.name}" required/>
            `;

            let thumb = document.querySelector('#profilethumb');
            thumb.innerHTML = `
                <label>Persona Thumbnail</label>
                <img src="${data.thumbnail}" alt="Persona Thumbnail" class="personathumb" style="margin-top: 20px;"/>
                <input type="file" name="thumbnail" accept="image/*"><br>
            `;

            let age = document.querySelector('#age');
            age.innerHTML = `
            <label>Age</label>
            <input type="number" placeholder="21" value="${data.age}" name="age" min="0" required/>
            `;

            let occup = document.querySelector('#occup');
            occup.innerHTML = `
            <label>Occupation</label>
            <input type="text" placeholder="Example: Actor" name="occup" value="${data.occup}" required/>
            `;

            let location = document.querySelector('#location');
            location.innerHTML = `
            <label>Location</label>
            <input type="text" placeholder="Boston, MA" name="location" value="${data.location}" required/>
            `;

            let status = document.querySelector('#status');
            status.innerHTML = `
            <label>Location</label>
            <select name="status" required>
                <option value="Single" ${data.status === 'Single' ? 'selected' : ''}>Single</option>
                <option value="Divorced" ${data.status === 'Divorced' ? 'selected' : ''}>Divorced</option>
                <option value="Married" ${data.status === 'Married' ? 'selected' : ''}>Married</option>
                <option value="Widowed" ${data.status === 'Widowed' ? 'selected' : ''}>Widowed</option>
            </select>
            `;

            let education = document.querySelector('#education');
            education.innerHTML = `
            <label>Education</label>
            <input type="text" name="education" placeholder="Example: None" value="${data.education}" required/>
            `;

            let background = document.querySelector('#background');
            background.innerHTML = `
            <label>Background</label>
            <textarea name="background" placeholder="Tell us more about your UX Persona...">${data.background}</textarea>
            `;

            let techsav = document.querySelector('#techsav');
            techsav.innerHTML = `
                <label>Tech Savvy</label>
                ${fillscore(data.techsav, 'techsav')}
            `;

            let effic = document.querySelector('#effic');
            effic.innerHTML = `
                <label>Efficiency</label>
                ${fillscore(data.efficiency, 'effic')}
            `;

            let curio = document.querySelector('#curio');
            curio.innerHTML = `
                <label>Curiosity</label>
                ${fillscore(data.curiosity, 'curio')}
            `;

            let techintuit = document.querySelector('#techintuit');
            techintuit.innerHTML = `
                <label>Tech Intuition</label>
                ${fillscore(data.techintuit, 'techintuit')}
            `;

            let techexpert = document.querySelector('#techexpert');
            techexpert.innerHTML = `
                <label>Tech Expert</label>
                ${fillscore(data.techexpert, 'techexpert')}
            `;

            let actions = document.querySelector('.blockactions');

            actions.innerHTML= `
                <a href="#" id="canceledit" onClick="viewmode(${data.id})"><img src="../static/images/cancel.png" alt="Cancel Edit"/></a>
                <a href="#" id="confirmedit" onClick="updatepersona(${data.id})"><img src="../static/images/confirm.png" alt="Confirm Edit"/></a>
            `;
           

        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
   
}

//Easily check and fill the selects for the Persona Scores
function fillscore(score, name) {
    let select = `<select name="${name}" required>`;

    for (let i = 0; i <= 10; i++) {
        select += `<option value="${i}" ${i === score ? 'selected' : ''}>${i}/10</option>`;
    }

    select += '</select>';
    return select;
}


//Update Persona
function updatepersona(id){
    const formData = new FormData();
    
    formData.append('name', document.querySelector('[name="name"]').value);
    formData.append('age', document.querySelector('[name="age"]').value);
    formData.append('occup', document.querySelector('[name="occup"]').value);
    formData.append('location', document.querySelector('[name="location"]').value);
    formData.append('status', document.querySelector('[name="status"]').value);
    formData.append('education', document.querySelector('[name="education"]').value);
    formData.append('background', document.querySelector('[name="background"]').value);
    formData.append('techsav', document.querySelector('[name="techsav"]').value);
    formData.append('efficiency', document.querySelector('[name="effic"]').value);
    formData.append('curiosity', document.querySelector('[name="curio"]').value);
    formData.append('techintuit', document.querySelector('[name="techintuit"]').value);
    formData.append('techexpert', document.querySelector('[name="techexpert"]').value);

    const thumbnail = document.querySelector('[name="thumbnail"]');
    if (thumbnail && thumbnail.files[0]) {
        formData.append('thumbnail', thumbnail.files[0]);
    }

    fetch(`/persona/edit/${id}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCSRFToken()  // Django CSRF token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            viewmode(id);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating persona:', error);
        alert('An error occurred while updating the persona.');
    });

}


//Cancel Edit Mode
function viewmode(id){

    const url = `/persona/edit/${id}/`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'error') {
            alert('Error: ' + data.message);
        } else {
            // Handle the retrieved persona data
            console.log('Persona data:', data);
            let name = document.querySelector('#name');
            name.innerHTML = `
            <h1>Persona: <span>${data.name}</span></h1>
            <a href="/persona"><img src="../static/images/backbtn.png" alt="Back Button"/></a>
            `;

            let thumb = document.querySelector('#profilethumb');
            let thumbnailSrc = data.thumbnail ? data.thumbnail : '../static/images/profile.jpg';

            thumb.innerHTML = `
                <img src="${thumbnailSrc}" alt="Persona Thumbnail" class="personathumb" style="margin-top:20px;"/>
                <h3>${data.name}</h3>
            `;

            

            let age = document.querySelector('#age');
            age.innerHTML = `
            <h4>Age: <span>${data.age}</span></h4>
            `;

            let occup = document.querySelector('#occup');
            occup.innerHTML = `
            <h4>Occupation: <span>${data.occup}</span></h4>
            `;

            let location = document.querySelector('#location');
            location.innerHTML = `
            <h4>Location: <span>${data.location}</span></h4>
            `;

            let status = document.querySelector('#status');
            status.innerHTML = `
            <h4>Marital Status: <span>${data.status}</span></h4>
            `;

            let education = document.querySelector('#education');
            education.innerHTML = `
            <label>Education</label>
            <h4>${data.education}</h4>
            `;

            let background = document.querySelector('#background');
            background.innerHTML = `
            <label>Background</label>
            <h4>${data.background}</h4>
            `;

            let techsav = document.querySelector('#techsav');
            techsav.innerHTML = `
                <label>Tech Savvy</label>
                 <div class="scorearea">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${data.techsav*10}%;"></div>
                    </div>
                    ${data.techsav}/10
                 </div>
            `;

            let effic = document.querySelector('#effic');
            effic.innerHTML = `
                <label>Efficiency</label>
                <div class="scorearea">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${data.efficiency*10}%;"></div>
                    </div>
                    ${data.efficiency}/10
                 </div>
            `;

            let curio = document.querySelector('#curio');
            curio.innerHTML = `
                <label>Curiosity</label>
                <div class="scorearea">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${data.curiosity*10}%;"></div>
                    </div>
                    ${data.curiosity}/10
                 </div>
            `;

            let techintuit = document.querySelector('#techintuit');
            techintuit.innerHTML = `
                <label>Tech Intuition</label>
                <div class="scorearea">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${data.techintuit*10}%;"></div>
                    </div>
                    ${data.techintuit}/10
                 </div>
            `;

            let techexpert = document.querySelector('#techexpert');
            techexpert.innerHTML = `
                <label>Tech Expert</label>
                <div class="scorearea">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${data.techexpert*10}%;"></div>
                    </div>
                    ${data.techexpert}/10
                 </div>
            `;

            let actions = document.querySelector('.blockactions');

            actions.innerHTML = `
                <a href="/persona/delete/${data.id}/"><img src="../static/images/delete.png" alt="Delete Button"/></a>
                <a href="#" id="editbutton" onClick="editmode(${data.id})"><img src="../static/images/edit.png" alt="Edit Button"/></a>
            `;


        }
    })
    .catch(error => {
        console.error('Error:', error);
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

