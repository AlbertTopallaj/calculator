const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const goproOverlay = document.getElementById('goproOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const logoutOverlay = document.getElementById('logoutOverlay');

function openLogoutModal(){
    logoutOverlay.classList.add('active');
}

function closeLogoutModal(){
    logoutOverlay.classList.remove('active');
}

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
        closeLogoutModal();
    }
});

document.querySelector('#logoutOverlay .btn-yes').addEventListener('click', async () =>{
    await handleLogout();
    closeLogoutModal();
});

document.querySelector('#logoutOverlay .btn-no').addEventListener('click', () => {
    closeLogoutModal();
})

document.getElementById('settings-search').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    const sections = document.querySelectorAll('.settings-section');

    sections.forEach(section => {
        if (query === '') {
            section.style.display = '';
            return;
        }
        const text = section.textContent.toLowerCase();
        section.style.display = text.includes(query) ? '' : 'none';
    });
});
