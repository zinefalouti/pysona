document.addEventListener('DOMContentLoaded', function() {
    showAccount();

});



//Django CSRF
function getCSRFToken() {
    let csrfToken = null;
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
        csrfToken = csrfCookie.split('=')[1];
    }
    return csrfToken;
}

//Fetch Auth User Data
function showAccount() {
    fetch('/account/edit/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            let username = document.querySelector('#username');
            username.innerHTML = `
                                  <label>Username</label>
                                  <h2>${data.data.username.charAt(0).toUpperCase() + data.data.username.slice(1)}</h2>
            `;

            let email = document.querySelector('#email');
            email.innerHTML =  `
                                  <label>Email</label>
                                  <h4>${data.data.email}</h4>
            `;

            let password = document.querySelector('#password');
            password.innerHTML = `
                                  <label>Password</label>
                                  <input type="text" value="**********" disabled/>
            `;

            let thumbnail = document.querySelector('#thumbnail');
            if (data.data.thumbnail) {
                thumbnail.innerHTML = `
                                  <label>Profile Thumbnail</label>
                                  <img src="${data.data.thumbnail}" alt="Profile Thumbnail" class="profilethumblg"/>
                  `;
            } else {
                thumbnail.innerHTML = `
                                  <label>Profile Thumbnail</label>
                                  <img src="../static/images/profile.jpg" alt="Profile Thumbnail" class="profilethumblg"/>
                  `;
            }

            let action = document.querySelector('#action');
            action.innerHTML = `
                              <button onClick="editmode()" class="save">Edit Account</button>    
                  `;

        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function editmode() {
    fetch('/account/edit/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            let username = document.querySelector('#username');
            username.innerHTML = `
                                  <label>Username</label>
                                  <input type="text" placeholder="example: elmo" value="${data.data.username}" name="username"/>
            `;

            let email = document.querySelector('#email');
            email.innerHTML =  `
                                  <label>Email</label>
                                  <input type="email" value="${data.data.email}" name="email"/>
            `;

            let password = document.querySelector('#password');
            password.innerHTML = `
                                  <label>Password</label>
                                  <input type="password" name="password" value="" autocomplete="new-password"/>
            `;

            let thumbnail = document.querySelector('#thumbnail');
            if (data.data.thumbnail) {
                thumbnail.innerHTML = `
                                  <label>Profile Thumbnail</label>
                                  <img src="${data.data.thumbnail}" alt="Profile Thumbnail" class="profilethumblg"/>
                                  <input type="file" name="thumbnail"/>
                  `;
            } else {
                thumbnail.innerHTML = `
                                  <label>Profile Thumbnail</label>
                                  <img src="../static/images/profile.jpg" alt="Profile Thumbnail" class="profilethumblg"/>
                                  <input type="file" name="thumbnail"/>
                  `;
            }

            let action = document.querySelector('#action');
            action.innerHTML = `
                              <button onClick="showAccount()" class="cancel">Cancel</button>  
                              <button onClick="saveChanges()" class="save">Save Changes</button>                         
                  `;

        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function saveChanges(userData) {
    const formData = new FormData();
    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const thumbnail = document.querySelector('input[name="thumbnail"]').files[0];

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password); 
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);  
    }

    fetch('/account/edit/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showAccount(); 
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}


