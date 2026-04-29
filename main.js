// Hämtar display-elementet från HTML
const displayEl = document.getElementById('display');

// Uppdaterar texten i displayen
function setDisplayValue(value) {
  displayEl.textContent = value;
}
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');


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

document.body.append(createKey('=',null));

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
