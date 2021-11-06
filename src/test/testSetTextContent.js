import setTextContent from './setTextContent'

const root =  document.getElementById('root')
console.log(root)
const pEle = document.createElement('p')
pEle.innerHTML = 'test p'
root.appendChild(pEle)
console.log(pEle.nodeType)
setTextContent(root, 'hello summer')