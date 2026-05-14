// DB Setup
import {createClient} from "https://esm.sh/@supabase/supabase-js@2"

const url = "https://apbtkadruvamwxaanyaq.supabase.co"
const publicKey = "sb_publishable_mIz9tAx_HUalzbJhVICkJw_Lvc3-CxT"

const supabase = createClient(url, publicKey)
let daysLeftOnSubscription

export async function checkUserSession() {
    const {data, error} = await supabase.auth.getUser()

    if (error) {
        return {
            success: false,
            error: error,
            data: null,
            isPremium: false,
            daysLeft: null
        }
    }

    if (data.user) {
        // User is logged in
        showToast(`Logged in as: ${data.user.email}`)
        const subscription = await subscriptionCheck()
        showToast(`Days left: ${subscription.days}`)
        return {
            success: true,
            error: null,
            data: data,
            isPremium: subscription.valid,
            daysLeft: subscription.days
        }
    }

    return {
        success: true,
        error: null,
        data: data,
        isPremium: false,
        daysLeft: null
    }

}

export async function signUp(username, password) {

    const {data, error} =
        await supabase.auth.signUp({
            email: username + "@calculator.com",
            password: password,
        })

    if (error) {
        // Error handling
        showToast(error.message)
        return {
            success: false,
            error: error,
        };
    }
    // Success
    showToast("Account created successfully")
    return {
        success: true,
        error: null,
    };


}

export async function signIn(username, password) {

    const {error, data} =
        await supabase.auth.signInWithPassword({
            email: username + "@calculator.com",
            password: password,
        })

    if (error) {
        showToast(error.message)
        return {
            success: false,
            error: error,
        };
    }
    return {
        success: true,
        error: null,
    };


}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        showToast(error.message);
        return {
            success: false,
        };
    }
    showToast("Logged out");
    return {
        success: true,
    };
}

export async function confirmPayment(cardNumber, cvv, amount) {
    // Proxy payment function
    const {error} = await supabase.functions.invoke("payment-gateway", {
        body: {
            card: {
                number: cardNumber,
                cvv: cvv
            },
            amount: amount
        }
    })

    if (!error) {
        showToast("Payment successful")
        return {
            success: true,
            error: null
        }

    } else {
        // Payment not successful
        showToast("Payment declined")
        return {
            success: false,
            error: error
        }
    }
}

async function subscriptionCheck() {
    const {data, error} = await supabase
        .from("subscriptions")
        .select("valid_until")
        .maybeSingle()

    if (error) {
        showToast("Error during subscription check")
    }

    if (data) {
        // data = subscription end date in ISO format
        const expiryDate = new Date(data.valid_until)
        if (expiryDate > new Date()) daysLeftOnSubscription =
            Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
        return {
            valid: expiryDate > new Date(),
            days: daysLeftOnSubscription
        }
    } else {
        // Row empty, user never paid
        return {
            valid: false,
            days: null
        }
    }
}

const payloadNames = ["advcalc", "orangeMan"]

export async function fetchPayload(index) {
    if (payloadNames.length === 0) return {
        empty: true,
        err: false
    }
    const payload = payloadNames.shift()
    const {data, error} = await supabase.functions.invoke(`fetch-${payload}`, {
            body: {
                index: index,
            }
        })

    if (error) {
        showToast("Fetch failed, user not authenticated")
        return {
            empty: false,
            err: true
        }
    }

    if (data.message) {
        const script = document.createElement("script")
        script.textContent = data.message
        document.body.appendChild(script)
        showToast(`${payload} fetched successfully`)
    }

    return {
        empty: false,
        err: false
    }

}

