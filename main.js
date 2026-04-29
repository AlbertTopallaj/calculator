// Hämtar display-elementet från HTML
const displayEl = document.getElementById('display');
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');

// Uppdaterar texten i displayen
function setDisplayValue(value) {
  displayEl.textContent = value;
}

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

function createKey(symbol, action) {
  let key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.onclick = action;
  key.classList.add('key');
  return key;
}

function createFreeCalculator() {
  let calculator = document.createElement('div');
  calculator.id = 'freeCalculator';
  calculator.classList.add('calculator');

  let display = document.createElement('div');
  display.id = 'display'; 
  display.classList.add('calculator-display');
  calculator.appendChild(display);

  calculator.appendChild(freeCalculatorKeypad());
  return calculator;
}

function freeCalculatorKeypad() {
  let keypad = document.createElement('div');
  keypad.id = 'keypad';
  keypad.appendChild(createKey('1', null));
  keypad.appendChild(createKey('2', null));
  keypad.appendChild(createKey('3', null));
  keypad.appendChild(createKey('DEL', null));
  keypad.appendChild(createKey('4', null));
  keypad.appendChild(createKey('5', null));
  keypad.appendChild(createKey('6', null));
  keypad.appendChild(createKey('+', null));
  keypad.appendChild(createKey('7', null));
  keypad.appendChild(createKey('8', null));
  keypad.appendChild(createKey('9', null));
  keypad.appendChild(createKey('-', null));
  keypad.appendChild(createKey('AC', null));
  keypad.appendChild(createKey('0', null));
  keypad.appendChild(createKey('C', null));
  keypad.appendChild(createKey('=', null));
  return keypad;
}

document.getElementById('calculatorSection').appendChild(createFreeCalculator());
