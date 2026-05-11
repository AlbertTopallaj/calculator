// supabase/functions/get-script/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            status: 200,
            headers: corsHeaders,
        });
    }

    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405,
            headers: corsHeaders,
        });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        return new Response("Unauthorized", {
            status: 401,
            headers: corsHeaders,
        });
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
);

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return new Response("Unauthorized", {
            status: 401,
            headers: corsHeaders,
        });
    }

    try {

        const body = await req.json();

        const index = body.index;

        const advCalcPayload = `

function updateDisplay2() {
    display2.textContent = input2 || "0";
}

function addValue2(v) {
    if (input2 === "0" && v !== ".") {
        input2 = v;
    } else {
        input2 += v;
    }
    updateDisplay2();
}

function clear2() {
    input2 = "0";
    updateDisplay2();
}

function del2() {
    if (input2.length <= 1) input2 = "0";
    else input2 = input2.slice(0, -1);
    updateDisplay2();
}

function percent2() {
    try {
        const match = input2.match(/(\\d+\\.?\\d*)$/);
        if (!match) return;

        const number = parseFloat(match[1]);
        const percentValue = number / 100;

        input2 = input2.replace(/(\\d+\\.?\\d*)$/, percentValue);
        updateDisplay2();
    } catch (error) {
        input2 = "Fel";
        updateDisplay2();
    }
}

function equals2() {
    try {
        const result = Function('"use strict"; return (' + input2 + ")")();
        input2 = String(result);
    } catch (error) {
        input2 = "Fel";
    }
    updateDisplay2();
}




function injElements(index) {
    const section = document.getElementById("dynamicCalculatorSection" + index);

    section.innerHTML =
        '<div class="calculator" id="calculator-2">' +
            '<div id="display-2" class="calculator-display">0</div>' +
            '<div class="keypad">' +
                '<div class="key clear" data-action="clear">C</div>' +
                '<div class="key" data-action="delete">⌫</div>' +
                '<div class="key operator" data-value="/">÷</div>' +
                '<div class="key operator" data-value="*">×</div>' +
                '<div class="key" data-value="7">7</div>' +
                '<div class="key" data-value="8">8</div>' +
                '<div class="key" data-value="9">9</div>' +
                '<div class="key operator" data-value="-">−</div>' +
                '<div class="key" data-value="4">4</div>' +
                '<div class="key" data-value="5">5</div>' +
                '<div class="key" data-value="6">6</div>' +
                '<div class="key operator" data-value="+">+</div>' +
                '<div class="key" data-value="1">1</div>' +
                '<div class="key" data-value="2">2</div>' +
                '<div class="key" data-value="3">3</div>' +
                '<div class="key operator" data-action="percent">%</div>' +
                '<div class="key equal" data-action="equals">=</div>' +
                '<div class="key zero" data-value="0">0</div>' +
                '<div class="key" data-value=".">.</div>' +
            '</div>' +
        '</div>';

    display2 = document.getElementById("display-2");
    keys2 = document.querySelectorAll("#calculator-2 .key");

    keys2.forEach(key => {
        key.addEventListener("click", () => {
            const value = key.getAttribute("data-value");
            const action = key.getAttribute("data-action");

            if (value) addValue2(value);
            else if (action === "clear") clear2();
            else if (action === "delete") del2();
            else if (action === "equals") equals2();
            else if (action === "percent") percent2();
        });
    });
}

let display2 = null;
let keys2 = [];
let input2 = "0";

keys2.forEach(key => {
    key.addEventListener("click", () => {
        const value = key.getAttribute("data-value");
        const action = key.getAttribute("data-action");

        if (value) addValue2(value);
        else if (action === "clear") clear2();
        else if (action === "delete") del2();
        else if (action === "equals") equals2();
        else if (action === "percent") percent2();
    });
});

injElements(${index});

`;

        return new Response(
            JSON.stringify({
                message: advCalcPayload,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});