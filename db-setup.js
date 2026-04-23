// DB Setup
import {createClient} from "https://esm.sh/@supabase/supabase-js@2"

const url = "https://apbtkadruvamwxaanyaq.supabase.co"
const publicKey = "sb_publishable_mIz9tAx_HUalzbJhVICkJw_Lvc3-CxT"

const supabase = createClient(url, publicKey)
let daysLeftOnSubscription

async function checkUserSession() {
    const {data, error} = await supabase.auth.getUser()

    if (error) println(error.message)

    if (data.user) {
        // User is logged in
        if (await subscriptionCheck()) {
            // Valid subscription
            println(`Logged in as: ${data.user.email}`)
            println(`Days left: ${daysLeftOnSubscription}`)
        } else {
            // Invalid subscription
            println(`Logged in as: ${data.user.email}`)
        }
    } else {
        println("User is not logged in")
    }

}

async function signUp(username, password) {

    const {error} =
        await supabase.auth.signUp({
            email: username + "@calculator.com",
            password: password,
        })

    if (error) {
        // Error handling
        println(error.message)
    } else {
        // Success
        println("Account created successfully")
        checkUserSession()
    }

}

async function signIn(username, password) {
    const {error, data} =
        await supabase.auth.signInWithPassword({
            email: username + "@calculator.com",
            password: password,
        })

    if (error) {
        println(error.message)
    } else {
        println(`Logged in as ${data.user.email}`)
        subscriptionCheck()
    }

}

async function confirmPayment(cardNumber, cvv, amount) {
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
        // Payment successful
        println("Payment successful")
        subscriptionCheck()
    } else {
        // Payment not successful
        println(error.message)
    }
}

async function subscriptionCheck() {
    const {data, error} = await supabase
        .from("subscriptions")
        .select("valid_until")
        .maybeSingle()

    if (error) {
        println("Error during subscription check")
    }

    if (data) {
        // data = subscription end date in ISO format
        const expiryDate = new Date(data.valid_until)
        if (expiryDate > new Date()) daysLeftOnSubscription =
            Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
        return expiryDate > new Date();
    } else {
        // Row empty, user never paid
        return false
    }


}

window.signUp = signUp
window.signIn = signIn
window.confirmPayment = confirmPayment

checkUserSession()