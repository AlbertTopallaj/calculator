// Hämtar display-elementet från HTML
const displayEl = document.getElementById('display');
displayEl.textContent = 0;

// Uppdaterar texten i displayen
function setDisplayValue(value) {
  displayEl.textContent = value;
}

function addToDisplayValue(value) {
  let display = document.getElementById('display');
  let displayValue = display.textContent;
  if (!isNaN(value)) {
    if (displayValue == 0) {
      display.textContent = '';
    }
  } else {
    if (isNaN(displayValue.at(displayValue.length-1))) {
      display.textContent = displayValue.slice(0, -1);
    }
  }
  display.textContent += value;
}

function deleteFromDisplayValue() {
  let display = document.getElementById('display');
  let value = display.textContent;
  if (value.length < 2) {
    display.textContent = 0;
    return;
  }
  display.textContent = value.slice(0, -1);
}

function calculate() {
  let display = document.getElementById('display');
  let value = display.textContent;

  value = calculateHelper(value);

  display.textContent = eval(value);
}

function calculateSymbolHelper(value) {
  for (let i = 0; i < value.length-1; i++) {
    let char = value.at(i);
    switch (char) {
      case '(':
        if (i == 0) { break; }
        if(!isNaN(value.at(--i))) {
          value = value.slice(0, i) + '*' + value.slice(i);
          i++;
        }
        break;
      case ')':
        if (!isNaN(value.at(++i))) {
          value = value.slice(0, i) + '*' + value.slice(i);
          i++;
        }
        break;
      case '^':
        value = value.slice(0, i) + '**' + value.slice(++i);
        i++;
        break;
      case '√':
        let nRoot = 2;
        let rootIndex = i;
        if (i > 0 && !isNaN(value.at(i-1))) {
          nRoot = '';
          i--;
          while (i >= 0 && !isNaN(value.at(i))) {
            nRoot = value.at(i--) + nRoot;
          }
          value = value.slice(0, ++i) + value.slice(rootIndex);
        }
        rootIndex = i++;
        if (value.at(i++) == '(') {
          let parAmount = 1;
          while (parAmount > 0 && value.length > i) {
            switch (value.at(i)) {
              case '(':
                parAmount++;
                break;
              case ')':
                parAmount--;
                break;
            }
            i++;
          }
        } else {
          while (!isNaN(value.at(i))) {i++}
        }
        value = value.slice(0, rootIndex) + 'Math.pow(' + calculateHelper(value.slice(rootIndex+1, i)) + ', 1/' + nRoot + ')' + value.slice(i);
        i += 13;
        break;
    }
  }
  return value;
}

const burger = document.querySelector('.burger');
const nav = document.querySelector('.header-nav');

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
