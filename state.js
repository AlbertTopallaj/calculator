let appState = {
    user: null,
    history: []
};

async function hashPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}


async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!username || !password) {
        errorEl.textContent = 'Something went wrong: Wrong user credentials'
        return;

    }

    const stored = localStorage.getItem(username);
    const hashed = await hashPassword(password);



    if (!stored || stored !== hashed) {
        errorEl.textContent = 'Something went wrong: Wrong user credentials'
        return;
    }






    appState.user = username;
    closeLoginModal();
    renderView();
}

async function handleSignup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');
    if (!username) {
        errorEl.textContent = 'Something went wrong: Username is missing'
        return;
    }

    if (!password) {
        errorEl.textContent = 'Something went wrong: Password is missing'
        return;
    }

    if (localStorage.getItem(username)) {
        errorEl.textContent = 'Something went wrong: Account already exists';
        return;
    }

    const hashed = await hashPassword(password);
    localStorage.setItem(username, hashed);



    appState.user = username;
    closeSignupModal();
    renderView();
}

function handleLogout() {
    appState.user = null;
    renderView();
}

function renderView() {
    const nav = document.querySelector('.header-nav');

    if (!appState.user) {
        const signup = document.createElement('a');
        signup.textContent = 'Sign Up';
        signup.href = '#';
        signup.onclick = openSignupModal;

        const login = document.createElement('a');
        login.textContent = 'Login';
        login.href = '#';
        login.onclick = openLoginModal;

        const pro = document.createElement('a');
        pro.textContent = 'Go Pro';
        pro.href = 'pro.html';

        nav.replaceChildren(signup, login, pro);

    } else {
        const welcome = document.createElement('a');
        welcome.textContent = `Välkommen, ${appState.user}`;
        welcome.style.color = 'white';

        const pro = document.createElement('a');
        pro.textContent = 'Go Pro';
        pro.href = 'pro.html';

        const logout = document.createElement('a');
        logout.textContent = 'Logga ut';
        logout.href = '#';
        logout.onclick = handleLogout;

        nav.replaceChildren(welcome, pro, logout);

    }
}

renderView();