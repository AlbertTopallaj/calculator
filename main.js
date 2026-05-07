// Hämtar display-elementet från HTML
const burger = document.querySelector('.burger');
const nav = document.querySelector('.header-nav');

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
    keypad.appendChild(createKey('1', function () {
    }));
    keypad.appendChild(createKey('2', function () {
    }));
    keypad.appendChild(createKey('3', function () {
    }));
    keypad.appendChild(createKey('DEL', function () {
    }));
    keypad.appendChild(createKey('4', function () {
    }));
    keypad.appendChild(createKey('5', function () {
    }));
    keypad.appendChild(createKey('6', function () {
    }));
    keypad.appendChild(createKey('+', function () {
    }));
    keypad.appendChild(createKey('7', function () {
    }));
    keypad.appendChild(createKey('8', function () {
    }));
    keypad.appendChild(createKey('9', function () {
    }));
    keypad.appendChild(createKey('-', function () {
    }));
    keypad.appendChild(createKey('AC', function () {
    }));
    keypad.appendChild(createKey('0', function () {
    }));
    keypad.appendChild(createKey('C', function () {
    }));
    keypad.appendChild(createKey('=', function () {
    }));
    return keypad;
}


document.getElementById('calculatorSection').appendChild(createCalculator(freeCalculatorKeypad()));

const sliderContainer = document.querySelector('.slides-container');
const dots = document.querySelectorAll('.dot');
const slides = document.querySelectorAll(".slide")
let currentIndex = 0;
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');

    leftArrow.style.display = currentIndex === 0 ? 'none' : 'initial';
    rightArrow.style.display = currentIndex === dots.length - 1 ? 'none' : '';

    const currentVisibleSlide = slides[currentIndex]

    if (currentVisibleSlide.innerHTML.trim() === "") {
        const section = document.createElement("section")
        section.id = `dynamicCalculatorSection${currentIndex}`
        section.className = "calculatorSection"
        section.dataset.state = "empty"
        currentVisibleSlide.appendChild(section)
        getPayload(currentIndex)
    } else if (currentVisibleSlide.firstElementChild.dataset.state === "empty") {
        currentVisibleSlide.firstElementChild.innerHTML = ""
        getPayload(currentIndex)
    }
}

leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--
    updateSlider();
});

rightArrow.addEventListener('click', () => {
    if (currentIndex < dots.length - 1) currentIndex++
    updateSlider();
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateSlider();
    });
});
