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
  const key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.onclick = action;
  key.className = 'key';
  return key;
}

function createFreeCalculator() {
  const calculator = document.createElement('div');
  calculator.id = 'freeCalculator';
  calculator.className = 'calculator';

  let display = document.createElement('div');
  display.id = 'display'; 
  display.className = 'calculator-display';
  calculator.appendChild(display);

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
  calculator.appendChild(keypad);
  return calculator;
}

document.getElementById('calculatorSection').appendChild(createFreeCalculator());
