import {checkUserSession, logout, signIn, signUp, confirmPayment} from "./db-script.js"

let appState = {
    user: null,
    subscription: {
        isPremium: false,
        daysRemaining: null
    }
};

async function hashPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}


async function handleLogin() {
    const errorEl = document.getElementById('login-error');
    const username = document.getElementById('login-username').value;
    const password = await hashPassword(document.getElementById('login-password').value);

    const result = await signIn(username, password)

    if (!result.success) {
        errorEl.textContent = 'Something went wrong: Wrong user credentials'
        return;
    }

    const session = await checkUserSession()

    if (!session.success) return

    appState.user = session.data.user.email;
    appState.subscription.isPremium = session.isPremium
    appState.subscription.daysRemaining = session.daysLeft
    closeLoginModal();
    renderView();
}

async function handleSignup() {
    const username = document.getElementById('signup-username').value;
    const password = await hashPassword(document.getElementById('signup-password').value);
    const errorEl = document.getElementById('signup-error');


    if (!username) {
        errorEl.textContent = 'Something went wrong: Username is missing'
        return;
    }

    if (!password) {
        errorEl.textContent = 'Something went wrong: Password is missing'
        return;
    }

    const result = await signUp(username, password)

    if (!result.success) {
        errorEl.textContent = 'Something went wrong: Wrong user credentials'
        return;
    }

    const session = await checkUserSession()

    if (!session.success) return

    appState.user = session.data.user.email;
    appState.subscription.isPremium = session.isPremium
    appState.subscription.daysRemaining = session.daysLeft
    closeSignupModal();
    renderView();
}

async function handleLogout() {
    const result = await logout()
    if (!result.success) return
    appState.user = null;
    appState.subscription.isPremium = false
    appState.subscription.daysRemaining = null
    renderView();
}

async function handlePayment() {
    const cardNumber = document.getElementById('card-number').value;
    const cvv = document.getElementById('card-cvv').value;

    const result = await confirmPayment(cardNumber, cvv, 499)

    if (result.success) {
        sessionCheck()
    } else {
        // error message
    }
    closeGoProModal()
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

        nav.replaceChildren(signup, login);

    } else {
        const welcome = document.createElement('a');
        welcome.textContent = `Välkommen, ${appState.user}`;
        welcome.style.color = 'white';

        const logout = document.createElement('a');
        logout.textContent = 'Logga ut';
        logout.href = '#';
        logout.onclick = handleLogout;

        nav.replaceChildren(welcome, logout);

        if (!appState.subscription.isPremium) {
            const pro = document.createElement('a');
            pro.textContent = 'Go Pro';
            pro.onclick = openGoProModal
            nav.appendChild(pro)
        } else {
            const timeLeft = document.createElement('a')
            timeLeft.textContent = `${appState.subscription.daysRemaining} days remaining`
            nav.appendChild(timeLeft)
        }

    }
}

async function sessionCheck() {
    const session = await checkUserSession()

    if (!session.success) return

    appState.user = session.data.user.email
    appState.subscription.isPremium = session.isPremium
    appState.subscription.daysRemaining = session.daysLeft

    renderView()
}

window.handleLogin = handleLogin
window.handleSignup = handleSignup
window.handleLogout = handleLogout
window.handlePayment = handlePayment
window.appState = appState

sessionCheck()

