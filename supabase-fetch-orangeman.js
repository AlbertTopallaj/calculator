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

        const orangeManPayload = `
const canvas = document.createElement('canvas')
const ctx = canvas.getContext("2d");

let coordX = Math.trunc(canvas.height / 2)
let coordY = Math.trunc(canvas.width / 2)
let speed = 4
const pressedKeys = {
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false
};

let direction = "right"
let bullets = []
let enemies = []

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if (key in pressedKeys) {
        e.preventDefault();
        pressedKeys[key] = true;
        handleKeys();
    }
});

document.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();

    if (key in pressedKeys) {
        pressedKeys[key] = false;
        handleKeys()
    }

    if (key === " ") {
        e.preventDefault();
    }
});

function handleKeys() {
    document.querySelectorAll(".key").forEach(key => {
        key.style.transform = "";
        key.style.backgroundColor = "";
        key.style.boxShadow = "";
    })

    let symbol = null;
    let action = null;

    if (pressedKeys.a && pressedKeys.w) {
        symbol = "↖";
        direction = "up-left";
    } else if (pressedKeys.d && pressedKeys.w) {
        symbol = "↗";
        direction = "up-right";
    } else if (pressedKeys.a && pressedKeys.s) {
        symbol = "↙";
        direction = "down-left";
    } else if (pressedKeys.d && pressedKeys.s) {
        symbol = "↘";
        direction = "down-right";
    } else if (pressedKeys.w) {
        symbol = "↑";
        direction = "up";
    } else if (pressedKeys.s) {
        symbol = "↓";
        direction = "down";
    } else if (pressedKeys.a) {
        symbol = "←";
        direction = "left";
    } else if (pressedKeys.d) {
        symbol = "→";
        direction = "right";
    }
    if (pressedKeys[" "]) {
        action = "⎵";
    }

    [symbol, action].forEach(symbol => {
        if (!symbol) return;

        const button = [...document.querySelectorAll(".key")]
            .find(key => key.textContent === symbol);

        if (!button) return;

        button.style.transform = "translateY(2px)";
        button.style.backgroundColor = "#555";
        button.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.4)";

        button.click();
    });

}

function shoot() {
    const bulletSpeed = 3;

    let dx = 0;
    let dy = 0;

    if (direction === "up") dy = -bulletSpeed;
    if (direction === "down") dy = bulletSpeed;
    if (direction === "left") dx = -bulletSpeed;
    if (direction === "right") dx = bulletSpeed;

    if (direction === "up-left") {
        dx = -bulletSpeed;
        dy = -bulletSpeed;
    }

    if (direction === "up-right") {
        dx = bulletSpeed;
        dy = -bulletSpeed;
    }

    if (direction === "down-left") {
        dx = -bulletSpeed;
        dy = bulletSpeed;
    }

    if (direction === "down-right") {
        dx = bulletSpeed;
        dy = bulletSpeed;
    }

    bullets.push({
        x: coordX + 9,
        y: coordY + 9,
        dx: dx,
        dy: dy,
        width: 3,
        height: 3,
        visible: true
    });
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 10,
        height: 10,
        speed: 0.25,
        health: 3,
        alive: true
    });
}

function gameKeyPad() {
    let keypad = document.createElement('div');
    keypad.classList.add('keypad');
    keypad.appendChild(createKey('↖', function () {
        coordX -= speed;
        coordY -= speed
    }));
    keypad.appendChild(createKey('↑', function () {
        coordY -= speed
    }));
    keypad.appendChild(createKey('↗', function () {
        coordX += speed;
        coordY -= speed
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('←', function () {
        coordX -= speed;
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('→', function () {
        coordX += speed;
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('↙', function () {
        coordX -= speed;
        coordY += speed;
    }));
    keypad.appendChild(createKey('↓', function () {
        coordY += speed
    }));
    keypad.appendChild(createKey('↘', function () {
        coordX += speed;
        coordY += speed;
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('⎵', function () {
        shoot()
    }));
    keypad.appendChild(createKey('', function () {
    }));
    keypad.appendChild(createKey('', function () {
    }));
    return keypad;
}

function update() {

    if (coordY > canvas.height + 2) coordY = canvas.height - 2
    if (coordY < 1) coordY = 1
    if (coordX > canvas.width + 2) coordX = canvas.width + 2
    if (coordX < 1) coordX = 1

    bullets.forEach(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    });

    bullets = bullets.filter(bullet =>
        bullet.x > 0 &&
        bullet.x < canvas.width &&
        bullet.y > 0 &&
        bullet.y < canvas.height
    );

    enemies.forEach(enemy => {
        if (enemy.x < coordX) enemy.x += enemy.speed;
        if (enemy.x > coordX) enemy.x -= enemy.speed;

        if (enemy.y < coordY) enemy.y += enemy.speed;
        if (enemy.y > coordY) enemy.y -= enemy.speed;
    });

    bullets.forEach(bullet => {
        enemies.forEach(enemy => {
            const hit =
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y;

            if (hit) {
                enemy.health -= 1;
                bullet.visible = false;
            }
        });
    });

    bullets = bullets.filter(bullet => bullet.visible);
    enemies = enemies.filter(enemy => enemy.health > 0);
}

function draw() {
    // Borders
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, 1)
    ctx.fillRect(0, 0, 1, canvas.height)
    ctx.fillRect(canvas.width - 1, 0, 1, canvas.height)
    ctx.fillRect(0, canvas.height - 1, canvas.width, 1)

    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2)

    // Orange man
    ctx.fillStyle = "orange"
    ctx.fillRect(coordX + 6, coordY + 6, 6, 6);
    ctx.fillRect(coordX + 8, coordY, 2, 6);
    ctx.fillRect(coordX + 8, coordY + 12, 2, 6);
    ctx.fillRect(coordX, coordY + 8, 6, 2);
    ctx.fillRect(coordX + 12, coordY + 8, 6, 2);
    ctx.fillRect(coordX + 3, coordY + 3, 3, 3);
    ctx.fillRect(coordX + 12, coordY + 3, 3, 3);
    ctx.fillRect(coordX + 3, coordY + 12, 3, 3);
    ctx.fillRect(coordX + 12, coordY + 12, 3, 3);

    // Direction pixels
    ctx.fillStyle = "red"
    if (direction === "up") {
        ctx.fillRect(coordX + 8, coordY - 3, 2, 3);
    } else if (direction === "down") {
        ctx.fillRect(coordX + 8, coordY + 18, 2, 3);
    } else if (direction === "left") {
        ctx.fillRect(coordX - 3, coordY + 8, 3, 2);
    } else if (direction === "right") {
        ctx.fillRect(coordX + 18, coordY + 8, 3, 2);
    } else if (direction === "up-left") {
        ctx.fillRect(coordX, coordY, 3, 3);
    } else if (direction === "up-right") {
        ctx.fillRect(coordX + 15, coordY, 3, 3);
    } else if (direction === "down-left") {
        ctx.fillRect(coordX, coordY + 15, 3, 3);
    } else if (direction === "down-right") {
        ctx.fillRect(coordX + 15, coordY + 15, 3, 3);
    }

    // Bullets
    ctx.fillStyle = "red";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Enemies
    ctx.fillStyle = "green";
    enemies.forEach(enemy => {
        // slime body
        ctx.fillStyle = "limegreen";
        ctx.fillRect(enemy.x + 2, enemy.y + 4, 12, 8);
        ctx.fillRect(enemy.x + 4, enemy.y + 2, 8, 2);
        ctx.fillRect(enemy.x + 3, enemy.y + 12, 2, 2);
        ctx.fillRect(enemy.x + 10, enemy.y + 12, 3, 2);

        // eyes
        ctx.fillStyle = "white";
        ctx.fillRect(enemy.x + 5, enemy.y + 6, 2, 2);
        ctx.fillRect(enemy.x + 9, enemy.y + 6, 2, 2);

        // pupils
        ctx.fillStyle = "black";
        ctx.fillRect(enemy.x + 6, enemy.y + 7, 1, 1);
        ctx.fillRect(enemy.x + 9, enemy.y + 7, 1, 1);

        // smile
        ctx.fillStyle = "black";
        ctx.fillRect(enemy.x + 6, enemy.y + 10, 4, 1);
    });

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}


function startGame(index) {
    const section = document.getElementById("dynamicCalculatorSection${index}");
    section.appendChild(createCalculator(gameKeyPad()));
    const calculator = section.querySelector(".calculator")
    const display = section.querySelector("#display")

    canvas.width = display.clientWidth
    canvas.height = display.clientHeight * 2

    display.parentNode.replaceChild(canvas, display)
    section.querySelectorAll('.key').forEach(x => x.style.aspectRatio = 1.5);
    calculator.style.height = "auto"
    calculator.style.height = calculator.scrollHeight + "px";

    gameLoop()
    setInterval(spawnEnemy, 2000)
}
startGame(${index})
  `;

        return new Response(
            JSON.stringify({
                message: orangeManPayload,
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