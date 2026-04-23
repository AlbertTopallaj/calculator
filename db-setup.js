// DB Setup
import { createClient } from "@supabase/supabase-js"

const url = "https://apbtkadruvamwxaanyaq.supabase.co"
const publicKey = "sb_publishable_mIz9tAx_HUalzbJhVICkJw_Lvc3-CxT"

const supabase = createClient(url, publicKey)

async function signUp(username, password) {

    const {error} =
        await supabase.auth.signUp({
        email: username + "@calculator.com",
        password: password,
    })

    if (error) {
        // Error handling
    } else {
        // Success
    }

}

async function signIn(username, password) {
    await supabase.auth.signInWithPassword({
        email: username + "@calculator.com",
        password: password,
    })

}

async function paymentSuccessful() {
    const {data} = await supabase.auth.getUser()

    if (!data.user) {
        // User not logged in - error handling
        return
    }

    const newValidityDate = new Date()
    newValidityDate.setDate(newValidityDate.getDate() + 30) // + 30 days

    const {error} =  await supabase
        .from("subscriptions")
        .upsert({
            user_id: data.user.id,
            valid_until: newValidityDate.toISOString()
        })

    if (!error) {
        // Upsert success
    } else {
        // Upsert error
    }
}

async function subscriptionCheck() {
    const {data, error} = await supabase
        .from("subscriptions")
        .select("valid_until")
        .maybeSingle()

    if (error) {
        // Connection issues
    }

    if (data) {
        // data = subscription end date in ISO format
        const expiryDate = new Date(data.valid_until)
        return expiryDate > new Date();
    } else {
        // Row empty, user never paid
        return false
    }


}

async function checkUserSession() {
    const {data} = await supabase.auth.getUser()

    if (data.user) {
        // User is logged in
        if (await subscriptionCheck()) {
            // Valid subscription
        } else {
            // Invalid subscription
        }
    } else {
        // User is not logged in
    }

}

checkUserSession()

