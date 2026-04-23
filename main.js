
function createKey(symbol, action) {
  const key = document.createElement('button');
  key.append(document.createTextNode(symbol));
  key.onclick = action;
  key.className = 'key';
  return key;
}

document.body.append(createKey('=',null));
