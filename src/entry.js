
import React from 'react'
import ReactDOM from './dom/client/ReactDOM'
import { createLegacyRoot } from './dom/client/ReactDOMRoot'
import { createElement } from './react/ReactElement'

console.log('hello entry')

ReactDOM.render(<div><span>hello</span><div>world</div></div>, root)