
import React from 'react'
import ReactDOM from './dom/client/ReactDOM'
import { createLegacyRoot } from './dom/client/ReactDOMRoot'
import { createElement } from './react/ReactElement'
import Yeact from './react/React'
import RD from 'react-dom'
console.log('hello entry')

function say() {
    console.log('none!!')
}
RD.render((
    <div>
        <div>jiji</div>
        <button onClick={say}>add</button>
    </div>
), document.getElementById('realroot'))

class Counter extends Yeact.Component {


    render() {
        return <div>
            counter
        </div>
    } 
}

ReactDOM.render(<div><span>hello</span><button onClick={(e) => {
    console.log(e, 'xxxx')
}}>click</button><div>world</div>
<Counter />
</div>, root)