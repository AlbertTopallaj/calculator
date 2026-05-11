import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

        const authHeader = req.headers.get("Authorization")

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(authHeader?.replace("Bearer ", ""))

        if (authError) {
            return new Response(JSON.stringify({ success: false, error: authError.message }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            })
        }

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            })
        }

        const body = await req.json()

        const paymentRes = await fetch("https://calc-payments.free.beeceptor.com/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const payment = await paymentRes.json()

        if (payment.success !== true) {
            return new Response(JSON.stringify({ success: false, payment }), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            })
        }

        const date = new Date()
        date.setDate(date.getDate() + 30)

        const { error: dbError } = await supabase.from("subscriptions").upsert({
            user_id: user.id,
            valid_until: date.toISOString(),
        })

        if (dbError) {
            return new Response(JSON.stringify({ success: false, error: dbError.message }), {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            })
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        })
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        )
    }
})