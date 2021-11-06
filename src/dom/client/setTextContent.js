


function setTextContent(node, text) {

  if (text) {
    const firstChild = node.firstChild

    if (firstChild &&
      firstChild === node.lastChild &&
      firstChild.nodeType === Node.TEXT_NODE) {
        firstChild.nodeValue = text
        return
      }

      node.textContent = text
  }
}

export default setTextContent