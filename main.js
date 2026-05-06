// Hämtar display-elementet från HTML
const burger = document.querySelector('.burger');
const nav = document.querySelector('.header-nav');

// Uppdaterar texten i displayen
function setDisplayValue(value) {
  document.getElementById('display').textContent = value;
}

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

// Uppdaterar texten i displayen
function setDisplayValue(value) {
  displayEl.textContent = value;
}

//Toast
function showToast(message) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message;
  document.body.appendChild(toast);

  let offset = parseInt(getComputedStyle(toast).getPropertyValue("bottom"))
  document.querySelectorAll(".toast").forEach(element => {
    offset += element.offsetHeight + 10 // space between
  })

  toast.style.bottom = `${offset}px`;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 3000);

}

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

function createKey(symbol, action) {
  let key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.addEventListener('click', action)
  key.classList.add('key');
  return key;
}

function createDisplay() {
  let display = document.createElement('div');
  display.id = 'display';
  display.classList.add('calculator-display');
  display.appendChild(document.createTextNode('0'));
  return display;
}

function createCalculator(keypad) {
  let calculator = document.createElement('div');
  calculator.classList.add('calculator');

  calculator.appendChild(createDisplay());

  calculator.appendChild(keypad);
  return calculator;
}

function freeCalculatorKeypad() {
  let keypad = document.createElement('div');
  keypad.classList.add('keypad');
  keypad.appendChild(createKey('1', function () {  }));
  keypad.appendChild(createKey('2', function () {  }));
  keypad.appendChild(createKey('3', function () {  }));
  keypad.appendChild(createKey('DEL', function () {  }));
  keypad.appendChild(createKey('4', function () {  }));
  keypad.appendChild(createKey('5', function () {  }));
  keypad.appendChild(createKey('6', function () {  }));
  keypad.appendChild(createKey('+', function () {  }));
  keypad.appendChild(createKey('7', function () {  }));
  keypad.appendChild(createKey('8', function () {  }));
  keypad.appendChild(createKey('9', function () {  }));
  keypad.appendChild(createKey('-', function () {  }));
  keypad.appendChild(createKey('AC', function () {  }));
  keypad.appendChild(createKey('0', function () {  }));
  keypad.appendChild(createKey('C', function () {  }));
  keypad.appendChild(createKey('=', function () {  }));
  return keypad;
}


document.getElementById('calculatorSection').appendChild(createCalculator(freeCalculatorKeypad()));

const sliderContainer = document.querySelector('.slides-container');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

document.querySelector('.arrow.left').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + dots.length) % dots.length;
    updateSlider();
});

document.querySelector('.arrow.right').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % dots.length;
    updateSlider();
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateSlider();
    });
});

const display = document.getElementById("display-2");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";

function updateDisplay() {
  display.textContent = currentInput || "0";
}

function handleValue(value) {
  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function handleClear() {
  currentInput = "0";
  updateDisplay();
}

function handleDelete() {
  if (currentInput.length <= 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function handleEquals() {
  try {
    const result = Function('"use strict"; return (' + currentInput + ")")();
    currentInput = String(result);
  } catch (e) {
    currentInput = "Fel";
  }
  updateDisplay();
}

function flashButton(btn) {
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    flashButton(btn);

    const value = btn.getAttribute("data-value");
    const action = btn.getAttribute("data-action");

    if (action === "clear") {
      handleClear();
    } else if (action === "delete") {
      handleDelete();
    } else if (action === "equals") {
      handleEquals();
    } else if (value) {
      handleValue(value);
    }
    else if (action === "percent") {
      handlePercent();
    }
  });

  function handlePercent() {
  try {
    const match = currentInput.match(/(\d+\.?\d*)$/);
    if (!match) return;

    const number = parseFloat(match[1]);
    const percentValue = number / 100;

    currentInput = currentInput.replace(/(\d+\.?\d*)$/, percentValue);
    updateDisplay();
  } catch {
    currentInput = "Fel";
    updateDisplay();
  }
}
});