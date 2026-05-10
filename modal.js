const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const goproOverlay = document.getElementById('goproOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');



function openGoProModal() {
    goproOverlay.classList.add('active');
}

function closeGoProModal() {
    goproOverlay.classList.remove('active');
}

function openSignupModal() {
    signupOverlay.classList.add('active');
}

function closeSignupModal() {
    signupOverlay.classList.remove('active');
}

function openLoginModal() {
    loginOverlay.classList.add('active');
}

function closeLoginModal() {
    loginOverlay.classList.remove('active');
}

function openSettingsModal() {
    document.getElementById('settingsOverlay').classList.add('active');
}


function closeSettingsModal() {
    document.getElementById('settingsOverlay').classList.remove('active');
}

loginOverlay.addEventListener('click', e => {
    if (e.target === loginOverlay) closeLoginModal();
});

signupOverlay.addEventListener('click', e => {
    if (e.target === signupOverlay)
        closeSignupModal();
})

goproOverlay.addEventListener('click', e => {
    if (e.target === goproOverlay) 
        closeGoProModal();
})

settingsOverlay.addEventListener('click', e => {
    if (e.target === settingsOverlay)
        closeSettingsModal();
})

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
        closeGoProModal();
        closeSettingsModal();
    }
});
