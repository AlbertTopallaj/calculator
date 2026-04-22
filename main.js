// Hämtar display-elementet från HTML
const displayEl = document.getElementById('display');

// Funktion som uppdaterar texten i displayen
function setDisplayValue(value) {
  displayEl.textContent = value;
}