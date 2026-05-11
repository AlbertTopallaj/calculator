import { checkUserSession, logout, signIn, signUp, confirmPayment, fetchPayload } from "./db-script.js"

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

    const emailSettings = document.getElementById('emailSettings');
    const currentPlan = document.getElementById('currentPlan');


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

        emailSettings.textContent = 'notloggedin@notloggedin.com'
        currentPlan.textContent = 'Free';

    } else {
        const welcome = document.createElement('a');
        welcome.textContent = `Välkommen, ${appState.user}`;

        const settings = document.createElement('a');
        settings.textContent = 'Settings'
        settings.href = '#';
        settings.onclick = openSettingsModal;

        const logout = document.createElement('a');
        logout.textContent = 'Log out';
        logout.href = '#';
        logout.onclick = handleLogout;

        nav.replaceChildren(welcome, logout, settings);

        emailSettings.textContent = appState.user;
        currentPlan.textContent = appState.subscription.isPremium ? 'Pro' : 'Free';
        if (!appState.subscription.isPremium) {
            const pro = document.createElement('a');
            pro.textContent = 'Go Pro';
            pro.onclick = openGoProModal
            nav.appendChild(pro)
        } else {

            const timeLeft = document.createElement('a')
            timeLeft.textContent = `Your subscription has ${appState.subscription.daysRemaining} days remaining`
            nav.appendChild(timeLeft)
        }
        const settingsGoPro = document.getElementById('settingsGoPro');
        if (settingsGoPro) {
            if (appState.subscription.isPremium) {
                settingsGoPro.remove();
            }

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

async function getPayload(index, payload) {
    if (appState.subscription.isPremium) {
        await fetchPayload(payload, index) // orangeMan, advcalc
        document.getElementById(`dynamicCalculatorSection${index}`).dataset.state = "loaded"
    } else {
        const section = document.getElementById(`dynamicCalculatorSection${index}`)
        const paywall = document.createElement("h1")
        paywall.textContent = "Premium content placeholder. \nSign up and Go Pro\n.... or Go Home"
        paywall.style.whiteSpace = "pre-line";
        paywall.style.lineHeight = "4.0";
        paywall.style.textAlign = "center";
        paywall.style.color = "azure"
        section.appendChild(paywall)
    }
}

window.handleLogin = handleLogin
window.handleSignup = handleSignup
window.handleLogout = handleLogout
window.handlePayment = handlePayment
window.getPayload = getPayload
window.appState = appState

sessionCheck()

