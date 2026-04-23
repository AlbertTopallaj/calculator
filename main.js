
function createKey(symbol, action) {
  const key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.onclick = action;

  // Key styling
  key.style.width = '2rem';
  key.style.height = '2rem';
  key.style.cursor = 'pointer'

  return key;
}
