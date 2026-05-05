const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const goproOverlay = document.getElementById('goproOverlay');

function openGoProModal() {
    goproOverlay.classList.add('active');
}

function closeGoProModal() {
    goproOverlay.classList.remove('active');
}

function openSignupModal(){
    signupOverlay.classList.add('active');
}

function closeSignupModal(){
    signupOverlay.classList.remove('active');
}

function openLoginModal() {
    loginOverlay.classList.add('active');
}

function closeLoginModal(){
    loginOverlay.classList.remove('active');
}

loginOverlay.addEventListener('click', e => {
    if (e.target === loginOverlay) closeLoginModal();
});

signupOverlay.addEventListener('click', e => {
    if (e.target === signupOverlay)
        closeSignupModal();
})

document.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
        closeGoProModal()
    }
});