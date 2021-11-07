import ReactDOM from './dom/client/ReactDOM'
import { createLegacyRoot } from './dom/client/ReactDOMRoot'
import { createElement } from './react/ReactElement'

console.log('hello entry')

const elem = createElement('div', {key: 'myKey'}, 'hello summer')
const root = document.getElementById('root')
ReactDOM.render(elem, root)

