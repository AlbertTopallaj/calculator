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
//använd createKey för knapparna
function createKey(symbol, action) {
  let key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.addEventListener('click', action)
  key.classList.add('key');
  return key;
}
//Använd createDisplay till min miniräknare för samma stil
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

const display2 = document.getElementById("display-2");
const keys2 = document.querySelectorAll("#calculator-2 .key");

let input2 = "0";

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
    const match = input2.match(/(\d+\.?\d*)$/);
    if (!match) return;

    const number = parseFloat(match[1]);
    const percentValue = number / 100;

    input2 = input2.replace(/(\d+\.?\d*)$/, percentValue);
    updateDisplay2();
  } catch {
    input2 = "Fel";
    updateDisplay2();
  }
}

function equals2() {
  try {
    const result = Function('"use strict"; return (' + input2 + ")")();
    input2 = String(result);
  } catch {
    input2 = "Fel";
  }
  updateDisplay2();
}


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
