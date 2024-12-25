document.addEventListener('DOMContentLoaded', function() {
   
    if (currentPath.includes('dashboard')) {
        swapSidebar(0); 
    } else if (currentPath.includes('project')) {
        swapSidebar(1); 
    } else if (currentPath.includes('persona')) {
        swapSidebar(2); 
    } else if (currentPath.includes('account')) {
        swapSidebar(3);
    } 
});

function swapSidebar(index){
    let b1 = document.querySelector('#dashboard');
    let b2 = document.querySelector('#projects');
    let b3 = document.querySelector('#personas');
    let b4 = document.querySelector('#account');

    let storedbtns = [b1,b2,b3,b4];

    storedbtns.forEach(btn => btn.classList.remove('btnactive'));

    storedbtns[index].classList.add('btnactive');
}


