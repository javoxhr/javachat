const modalBtn = document.getElementById('profil');
const modal = document.querySelector('.modal');
const prof = document.querySelector('.prof');
const modalClose = document.querySelector('.modal-close');


modalBtn.addEventListener('click', ()=> {
    modal.classList.remove('open')
    prof.classList.remove('open')
})

modalClose.addEventListener('click', ()=> {
    modal.classList.add('open')
    prof.classList.add('open')
})

prof.addEventListener('click', ()=> {
    modal.classList.add('open')
    prof.classList.add('open')
})